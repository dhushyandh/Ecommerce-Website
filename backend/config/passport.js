const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const crypto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/auth/google/callback').replace(/\/$/, ''),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          const oauthPassword = crypto
            .randomBytes(12)
            .toString("base64")
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 8);

          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,            // userModel.password has maxlength 8
            password: oauthPassword,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;