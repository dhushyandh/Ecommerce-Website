const express = require("express");
const passport = require("passport");
const router = express.Router();

const isSecureRequest = (req) => {
  if (req.secure) return true;
  const proto = req.get('x-forwarded-proto');
  return proto === 'https';
};

const getBackendBaseUrl = (req) => {
  const host = req.get('host');
  const protocol = isSecureRequest(req) ? 'https' : req.protocol;
  return `${protocol}://${host}`;
};

const getConfiguredGoogleCallbackUrl = (req) => {
  // Prefer an explicit callback URL (must match what's configured in Google Console).
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
  return `${getBackendBaseUrl(req)}/api/auth/google/callback`;
};

const getCurrentRequestUrl = (req) => `${getBackendBaseUrl(req)}${req.baseUrl}${req.path}`;

const getDefaultFrontendBaseUrl = (req) => {
  const host = req.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  if (isLocalhost) {

    return "http://localhost:3000";
  }
  return process.env.FRONTEND_URL || `${isSecureRequest(req) ? 'https' : req.protocol}://${host}`;
};

const sanitizeFrontendOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const url = new URL(origin);
    const allowed = new Set([
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8000',
      process.env.FRONTEND_URL,
    ].filter(Boolean));

    const normalized = `${url.protocol}//${url.host}`;
    return allowed.has(normalized) ? normalized : null;
  } catch {
    return null;
  }
};

const handleGoogleOAuthSuccess = (req, res) => {
  const token = req.user.getJwtToken();
  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES_TIME || 7);

  const secure = isSecureRequest(req);

  res.cookie("token", token, {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
  });

  const frontendBase = sanitizeFrontendOrigin(req.query.state) || getDefaultFrontendBaseUrl(req);
  res.redirect(`${frontendBase}/oauth-success`);
};

router.get("/google", (req, res, next) => {

  // If Google redirects back to this route (misconfigured redirect URI),
  // treat it as the callback route so users don't land on a "Bad Request" JSON.
  if (req.query.code || req.query.error) {
    return passport.authenticate("google", {
      failureRedirect: "/api/auth/google/failure",
      session: false,
      // Must match the exact URL Google redirected to (redirect_uri).
      callbackURL: getCurrentRequestUrl(req),
    })(req, res, next);
  }

  const requestedOrigin = sanitizeFrontendOrigin(req.query.redirect);
  const state = requestedOrigin || getDefaultFrontendBaseUrl(req);

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    session: false,
    // Must match a URI present in Google Console "Authorized redirect URIs".
    callbackURL: getConfiguredGoogleCallbackUrl(req),
  })(req, res, next);
}, handleGoogleOAuthSuccess);

router.get(
  "/google/callback",
  (req, res, next) =>
    passport.authenticate("google", {
      failureRedirect: "/api/auth/google/failure",
      session: false,
      callbackURL: getConfiguredGoogleCallbackUrl(req),
    })(req, res, next),
  handleGoogleOAuthSuccess
);

router.get('/google/failure', (req, res) => {
  const frontendBase = getDefaultFrontendBaseUrl(req);
  res.redirect(`${frontendBase}/login?oauth=failed`);
});

module.exports = router;
