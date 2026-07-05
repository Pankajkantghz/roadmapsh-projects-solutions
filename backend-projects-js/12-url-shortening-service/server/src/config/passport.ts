import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter-oauth2";
import { User } from "../models/User.js";
import crypto from "crypto";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email found"), false);
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

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID || "",
        clientSecret: process.env.FACEBOOK_APP_SECRET || "",
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails"], // Explicitly ask for email
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("Facebook account must have a verified email linked."),
              false,
            );
          }

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

  passport.use(
    new TwitterStrategy(
      {
        clientID: process.env.X_CLIENT_ID || "",
        clientSecret: process.env.X_CLIENT_SECRET || "",
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/x/callback`,
        clientType: "confidential",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Note: X requires elevated App permissions in their Developer portal to share user emails
          const email =
            profile.emails?.[0]?.value || `${profile.username}@x-user.com`;

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              username:
                profile.username.toLowerCase() + crypto.randomInt(10, 99),
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
