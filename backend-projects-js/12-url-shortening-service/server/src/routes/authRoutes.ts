import { Router } from "express";
import { validate } from "../validators";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authValidator";
import {
  forgotPasswordHandler,
  googleAuthCallbackHandler,
  loginHandler,
  currentUserHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resendVerificationHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { rateLimiter } from "../middleware/rateLimiter";
import passport from "passport";

const router = Router();

// Rate limiters for sensitive endpoints
const authLimiter = rateLimiter({
  windowSizeInSeconds: 900, // 15 minutes
  maxRequests: 10,
  endpointName: "auth-sensitive",
});

const standardAuthLimiter = rateLimiter({
  windowSizeInSeconds: 900, // 15 minutes
  maxRequests: 30,
  endpointName: "auth-standard",
});

// Standard Authentication Endpoints
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerHandler,
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  loginHandler,
);
router.post("/refresh", standardAuthLimiter, refreshHandler);
router.post("/logout", logoutHandler);
router.get("/me", protect, currentUserHandler);

router.post("/verify-email", protect, validate(verifyEmailSchema), verifyEmailHandler);
router.post(
  "/resend-verification",
  protect,
  standardAuthLimiter,
  resendVerificationHandler,
);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler,
);

router.post(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordSchema),
  resetPasswordHandler,
);

// Google OAuth Endpoints
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    res.status(503).json({ success: false, message: "Google sign-in is not configured on this server." });
    return;
  }
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?oauth=unavailable`);
      return;
    }
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?oauth=failed`,
    })(req, res, next);
  },
  googleAuthCallbackHandler,
);

export default router;
