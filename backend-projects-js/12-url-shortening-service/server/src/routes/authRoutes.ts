import { Router } from "express";
import { validate } from "../validators";
import { loginSchema, registerSchema } from "../validators/authValidator";
import {
    forgotPasswordHandler,
  loginHandler,
  registerHandler,
  resendVerificationHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

router.post("/verify-email", protect, verifyEmailHandler);
router.post("/resend-verification", protect, resendVerificationHandler);

router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);

export default router;
