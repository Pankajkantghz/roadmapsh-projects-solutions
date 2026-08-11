import { Router } from "express";
import { validate } from "../validators";
import { loginSchema, registerSchema } from "../validators/authValidator";
import {
  forgotPasswordHandler,
  googleAuthCallbackHandler,
  loginHandler,
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

router.post("/verify-email", protect, verifyEmailHandler);
router.post(
  "/resend-verification",
  protect,
  standardAuthLimiter,
  resendVerificationHandler,
);

router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordHandler,
);

router.post(
  "/reset-password/:token",
  authLimiter,
  resetPasswordHandler,
);

// Google OAuth Endpoints
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthCallbackHandler,
);

export default router;