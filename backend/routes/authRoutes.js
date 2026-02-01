const express = require("express");
const passport = require("passport");
const router = express.Router();

const isSecureRequest = (req) => {
  if (req.secure) return true;
  const proto = req.get('x-forwarded-proto');
  return proto === 'https';
};

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

router.get("/google", (req, res, next) => {

  const requestedOrigin = sanitizeFrontendOrigin(req.query.redirect);
  const state = requestedOrigin || getDefaultFrontendBaseUrl(req);

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {

    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  (req, res) => {

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
  }
);

router.get('/google/failure', (req, res) => {
  const frontendBase = getDefaultFrontendBaseUrl(req);
  res.redirect(`${frontendBase}/login?oauth=failed`);
});

module.exports = router;
