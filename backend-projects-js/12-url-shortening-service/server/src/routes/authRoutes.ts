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
import passport from "passport";

const router = Router();

// =========================================================================
// STANDARD AUTHENTICATION ENDPOINTS
// =========================================================================
router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

router.post("/verify-email", protect, verifyEmailHandler);
router.post("/resend-verification", protect, resendVerificationHandler);

router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);

// =========================================================================
// GOOGLE OAUTH ENDPOINTS
// =========================================================================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true, // Set to true so express-session can track state securely
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // Turn back to false if you use JWTs post-login
    failureRedirect: "/login",
  }),
  googleAuthCallbackHandler,
);

export default router;
