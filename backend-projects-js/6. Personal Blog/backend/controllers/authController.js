import { loginService, signupService, updateProfileService } from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ApiResponse from "../utils/apiResponse.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import {
  forgotPasswordTemplate,
  verificationEmailTemplate,
} from "../utils/emailTemplate.js";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await signupService(name, email, password);

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;

    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.isVerified = false;

    await user.save();

    await sendEmail(
      user.email,
      "Verify Your Aarohan Account",
      verificationEmailTemplate(otp),
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          null,
          "OTP sent to email. Verify account to login.",
        ),
      );
  } catch (error) {
    await User.findByIdAndDelete(user._id);

    throw new ApiError(
      500,
      "Failed to send verification email. Please try again.",
    );
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginService(email, password);

  const accessToken = generateToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;

  await user.save();

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bookmarksCount: user.bookmarks?.length || 0,
  };

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: safeUser,
          accessToken,
        },
        "Login successful",
      ),
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
      },
      "Access token refreshed",
    ),
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token required");
  }

  const user = await User.findOne({
    refreshToken,
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  user.refreshToken = null;

  await user.save();

  res
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const safeUser = {
    _id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    accountStatus: user.accountStatus,

    isVerified: user.isVerified,

    bookmarksCount: user.bookmarks?.length || 0,

    createdAt: user.createdAt,

    updatedAt: user.updatedAt,
  };

  res
    .status(200)
    .json(new ApiResponse(200, safeUser, "Current user fetched successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }
  const now = new Date();

  // Reset count daily
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (!user.passwordResetRequestDate || user.passwordResetRequestDate < today) {
    user.passwordResetRequestCount = 0;

    user.passwordResetRequestDate = now;
  }

  // Daily limit
  if (user.passwordResetRequestCount >= 3) {
    throw new ApiError(429, "Daily OTP limit reached. Try again tomorrow.");
  }

  // 1 minute cooldown
  if (user.passwordResetCooldown && user.passwordResetCooldown > now) {
    const secondsLeft = Math.ceil((user.passwordResetCooldown - now) / 1000);

    throw new ApiError(
      429,
      `Please wait ${secondsLeft} seconds before requesting another OTP.`,
    );
  }

  const otp = generateOTP();

  user.resetPasswordOTP = otp;

  user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000;

  // Set cooldown
  user.passwordResetCooldown = new Date(Date.now() + 60 * 1000);

  // Increment count
  user.passwordResetRequestCount += 1;

  await user.save();

  await sendEmail(user.email, forgotPasswordTemplate(otp));

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body || {};

  // Validation
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({
    email,
  });

  // User not found
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Already verified
  // and not locked
  if (user.isVerified && !user.lockUntil) {
    throw new ApiError(400, "Account already verified");
  }

  // OTP mismatch
  if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP expired
  if (
    !user.resetPasswordOTPExpires ||
    user.resetPasswordOTPExpires < Date.now()
  ) {
    throw new ApiError(400, "OTP expired");
  }

  // LOCKED ACCOUNT FLOW
  if (user.lockUntil) {
    user.mustResetPassword = true;

    user.resetPasswordOTP = null;

    user.resetPasswordOTPExpires = null;

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "OTP verified successfully. Please reset your password.",
        ),
      );
  }

  // SIGNUP EMAIL VERIFICATION FLOW
  user.isVerified = true;

  user.resetPasswordOTP = null;

  user.resetPasswordOTPExpires = null;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body || {};

  // Validation
  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password are required");
  }

  const user = await User.findOne({
    email,
  });

  // User not found
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // OTP verification required
  if (!user.mustResetPassword) {
    throw new ApiError(401, "Please verify OTP first");
  }

  // New password cannot
  // be same as old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  // Save new password
  user.password = newPassword;

  // Unlock account
  user.lockUntil = null;

  user.loginAttempts = 0;

  user.mustResetPassword = false;

  // Clear OTP
  user.resetPasswordOTP = null;

  user.resetPasswordOTPExpires = null;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

export const resendUnlockOTP = asyncHandler(async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Must be verified
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  // Account must be locked
  if (!user.lockUntil || user.lockUntil < Date.now()) {
    throw new ApiError(400, "Account is not locked");
  }

  const now = new Date();

  // Reset count daily
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (!user.unlockOTPRequestDate || user.unlockOTPRequestDate < today) {
    user.unlockOTPRequestCount = 0;

    user.unlockOTPRequestDate = now;
  }

  // Daily limit
  if (user.unlockOTPRequestCount >= 3) {
    throw new ApiError(429, "Daily OTP limit reached. Try again tomorrow.");
  }

  // Cooldown
  if (user.unlockOTPCooldown && user.unlockOTPCooldown > now) {
    const secondsLeft = Math.ceil((user.unlockOTPCooldown - now) / 1000);

    throw new ApiError(
      429,
      `Please wait ${secondsLeft} seconds before requesting another OTP.`,
    );
  }

  const otp = generateOTP();

  user.resetPasswordOTP = otp;

  user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000;

  // 1 minute cooldown
  user.unlockOTPCooldown = new Date(Date.now() + 60 * 1000);

  // Increment count
  user.unlockOTPRequestCount += 1;

  await user.save();

  await sendEmail(
    user.email,
    "Aarohan Unlock Account OTP",
    unlockOTPTemplate(otp),
  );

  res.status(200).json(new ApiResponse(200, null, "OTP resent successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await updateProfileService(req.user._id, name);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});
