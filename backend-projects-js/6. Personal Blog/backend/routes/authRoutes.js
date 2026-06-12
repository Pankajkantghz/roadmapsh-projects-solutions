import express from "express";

import {
  signup,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendUnlockOTP,
  updateProfile,
} from "../controllers/authController.js";

import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import verifyJWT from "../middleware/verifyJWT.js";
import requireVerifiedUser from "../middleware/requireVerifiedUser.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);

router.post("/login",authLimiter ,validate(loginSchema), login);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", verifyJWT, logout);

router.get("/profile", verifyJWT, requireVerifiedUser, getCurrentUser);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

router.post("/resend-unlock-otp", resendUnlockOTP);

router.patch(
  "/profile",
  verifyJWT,
  requireVerifiedUser,
  validate(updateProfileSchema),
  updateProfile,
);

export default router;
