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

    res.redirect("http://localhost:3000/oauth-success");
  }
);

module.exports = router;
