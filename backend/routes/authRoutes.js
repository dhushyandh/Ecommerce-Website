const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = req.user.getJwtToken(); // SAME AS NORMAL LOGIN

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ✅ LOCAL
      sameSite: "lax",
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
    });

    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL + "/oauth-success"
        : "http://localhost:3000/oauth-success";

    res.redirect(redirectUrl);

  }
);

module.exports = router;
