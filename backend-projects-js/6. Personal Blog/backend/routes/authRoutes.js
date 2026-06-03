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
} from "../controllers/authController.js";

import { signupSchema, loginSchema } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import verifyJWT from "../middleware/verifyJWT.js";



const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new account and send email verification OTP. If an unverified account exists and OTP has expired, a new OTP is sent.
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pankaj
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Password123
 *
 *     responses:
 *       201:
 *         description: Signup successful and OTP sent
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 201
 *               message: OTP sent to email. Verify account to login.
 *               data: null
 *
 *       200:
 *         description: New OTP sent for existing unverified user
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: New OTP sent to email. Please verify your account.
 *               data: null
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             examples:
 *
 *               otpAlreadySent:
 *                 summary: OTP still valid
 *                 value:
 *                   success: false
 *                   message: OTP already sent. Please check your email.
 *
 *               validationError:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: All fields are required
 *
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User already exists
 *
 *       500:
 *         description: Failed to send verification email
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Failed to send verification email. Please try again.
 */
router.post("/signup", validate(signupSchema), signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user using email and password
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Login successful
 *               data:
 *                 user:
 *                   _id: 6a1abf2b3831cc7c7f5d6569
 *                   name: Pankaj
 *                   email: pankaj@gmail.com
 *                   role: user
 *                   bookmarksCount: 0
 *                 accessToken: jwt_access_token
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingFields:
 *                 summary: Missing email and password
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Email is required
 *                     - Password is required
 *
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Invalid email
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid credentials
 *
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             examples:
 *
 *               emailNotVerified:
 *                 summary: Email not verified
 *                 value:
 *                   success: false
 *                   message: Please verify your email first
 *
 *               accountLocked:
 *                 summary: Account locked
 *                 value:
 *                   success: false
 *                   message: Your account is temporarily locked due to multiple failed login attempts. Please verify OTP sent to your email.
 *
 *               resetPasswordRequired:
 *                 summary: Reset password required
 *                 value:
 *                   success: false
 *                   message: Please reset your password before logging in.
 */

router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Generate a new access token using refresh token from cookies or request body
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token
 *
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Access token refreshed
 *               data:
 *                 accessToken: new_jwt_access_token
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingToken:
 *                 summary: Refresh token missing
 *                 value:
 *                   success: false
 *                   message: Refresh token required
 *
 *               invalidToken:
 *                 summary: Invalid or expired token
 *                 value:
 *                   success: false
 *                   message: Invalid or expired refresh token
 *
 *               invalidRefreshToken:
 *                 summary: Refresh token mismatch
 *                 value:
 *                   success: false
 *                   message: Invalid refresh token
 *
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   success: false
 *                   message: User not found
 */

router.post("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout user by clearing refresh token from database and cookies
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token
 *
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Logged out successfully
 *               data: null
 *
 *       400:
 *         description: Missing refresh token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Refresh token required
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid refresh token
 */

router.post("/logout", verifyJWT, logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get currently authenticated user's profile
 *     tags:
 *       - Auth
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Current user fetched successfully
 *               data:
 *                 _id: 6a1abf2b3831cc7c7f5d6569
 *                 name: Pankaj
 *                 email: pankaj@gmail.com
 *                 role: user
 *                 bookmarksCount: 0
 *                 createdAt: "2026-06-01T10:00:00.000Z"
 *                 updatedAt: "2026-06-01T10:00:00.000Z"
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             examples:
 *
 *               unauthorized:
 *                 summary: Missing token
 *                 value:
 *                   success: false
 *                   message: Unauthorized access
 *
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *
 *               expiredToken:
 *                 summary: Token expired
 *                 value:
 *                   success: false
 *                   message: Token expired
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

router.get("/me", verifyJWT, getCurrentUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send OTP to verified user's email for password reset with cooldown and daily limit protection
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: OTP sent successfully
 *               data: null
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingEmail:
 *                 summary: Missing email
 *                 value:
 *                   success: false
 *                   message: Email is required
 *
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             examples:
 *
 *               emailNotVerified:
 *                 summary: Email not verified
 *                 value:
 *                   success: false
 *                   message: Please verify your email first
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 *
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             examples:
 *
 *               cooldown:
 *                 summary: Cooldown period active
 *                 value:
 *                   success: false
 *                   message: Please wait 43 seconds before requesting another OTP.
 *
 *               dailyLimit:
 *                 summary: Daily OTP limit reached
 *                 value:
 *                   success: false
 *                   message: Daily OTP limit reached. Try again tomorrow.
 */

router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verify email OTP for account activation or unlock account after failed login attempts
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *               otp:
 *                 type: string
 *                 example: "123456"
 *
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               signupVerification:
 *                 summary: Email verified successfully
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Email verified successfully
 *                   data: null
 *
 *               lockedAccountVerification:
 *                 summary: Locked account OTP verified
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: OTP verified successfully. Please reset your password.
 *                   data: null
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingFields:
 *                 summary: Missing email or OTP
 *                 value:
 *                   success: false
 *                   message: Email and OTP are required
 *
 *               invalidOTP:
 *                 summary: Invalid OTP
 *                 value:
 *                   success: false
 *                   message: Invalid OTP
 *
 *               otpExpired:
 *                 summary: OTP expired
 *                 value:
 *                   success: false
 *                   message: OTP expired
 *
 *               alreadyVerified:
 *                 summary: Account already verified
 *                 value:
 *                   success: false
 *                   message: Account already verified
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user password after OTP verification
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Password reset successfully
 *               data: null
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingFields:
 *                 summary: Missing fields
 *                 value:
 *                   success: false
 *                   message: Email and new password are required
 *
 *               samePassword:
 *                 summary: Same password used
 *                 value:
 *                   success: false
 *                   message: New password cannot be same as old password
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify OTP first
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/resend-unlock-otp:
 *   post:
 *     summary: Resend unlock OTP
 *     description: Resend OTP to unlock account after multiple failed login attempts with cooldown and daily limit protection
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pankaj@gmail.com
 *
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: OTP resent successfully
 *               data: null
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             examples:
 *
 *               missingEmail:
 *                 summary: Missing email
 *                 value:
 *                   success: false
 *                   message: Email is required
 *
 *               accountNotLocked:
 *                 summary: Account is not locked
 *                 value:
 *                   success: false
 *                   message: Account is not locked
 *
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 *
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             examples:
 *
 *               cooldown:
 *                 summary: Cooldown period active
 *                 value:
 *                   success: false
 *                   message: Please wait 43 seconds before requesting another OTP.
 *
 *               dailyLimit:
 *                 summary: Daily OTP limit reached
 *                 value:
 *                   success: false
 *                   message: Daily OTP limit reached. Try again tomorrow.
 */

router.post("/resend-unlock-otp", resendUnlockOTP);

export default router;
