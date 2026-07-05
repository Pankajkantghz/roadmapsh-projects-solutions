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

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

router.post("/verify-email", protect, verifyEmailHandler);
router.post("/resend-verification", protect, resendVerificationHandler);

router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);

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

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthCallbackHandler,
);

router.get(
  "/x",
  passport.authenticate("twitter", {
    scope: ["users.read", "tweet.read", "offline.access"],
  }),
);

router.get(
  "/x/callback",
  passport.authenticate("twitter", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthCallbackHandler,
);
export default router;
