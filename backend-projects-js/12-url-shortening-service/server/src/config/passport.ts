import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "../models/User.js";
import crypto from "crypto";

export const configurePassport = () => {
  // =========================================================================
  // GOOGLE STRATEGY
  // =========================================================================
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(new Error("No email found from Google profile"), false);

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              username:
                profile.displayName.replace(/\s+/g, "").toLowerCase() +
                crypto.randomInt(100, 999),
              email,
              passwordHash: crypto.randomBytes(16).toString("hex"),
              isVerified: true,
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );

 
};
