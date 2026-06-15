import User from "../models/User.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import {
  unlockOTPTemplate,
  verificationEmailTemplate,
} from "../utils/emailTemplate.js";

export const signupService = async (name, email, password) => {
  const existingUser = await User.findOne({
    email,
  });

  // User exists
  if (existingUser) {
    // Already verified
    if (existingUser.isVerified) {
      throw new ApiError(409, "User already exists");
    }

    // OTP still valid
    if (
      existingUser.resetPasswordOTPExpires &&
      existingUser.resetPasswordOTPExpires > Date.now()
    ) {
      throw new ApiError(400, "OTP already sent. Please check your email.");
    }

    // Generate fresh OTP
    const otp = generateOTP();

    existingUser.resetPasswordOTP = otp;

    existingUser.resetPasswordOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await existingUser.save();

    await sendEmail(
      existingUser.email,
      "Verify Your Aarohan Account",
      verificationEmailTemplate(otp),
    );

    throw new ApiError(
      200,
      "New OTP sent to email. Please verify your account.",
    );
  }

  const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return user;
};

export const loginService = async (email, password) => {
  const user = await User.findOne({
    email,
  });

  // User not found
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Email not verified
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  // Must reset password
  if (user.mustResetPassword) {
    throw new ApiError(403, "Please reset your password before logging in.");
  }

  // Account locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ApiError(
      403,
      "Your account is temporarily locked due to multiple failed login attempts. Please verify OTP sent to your email.",
    );
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // Wrong password
  if (!isPasswordCorrect) {
    user.loginAttempts += 1;

    // Lock after 3 attempts
    if (
      user.loginAttempts >= 3 &&
      (!user.lockUntil || user.lockUntil < Date.now())
    ) {
      const otp = generateOTP();

      // Save OTP
      user.resetPasswordOTP = otp;

      user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000;

      // Lock account
      user.lockUntil = Date.now() + 10 * 60 * 1000;

      // Reset attempts
      user.loginAttempts = 0;

      // Force reset flow
      user.mustResetPassword = false;

      await sendEmail(
        user.email,
        "Aarohan Account Security Verification",
        unlockOTPTemplate(otp),
      );
    }

    await user.save();

    throw new ApiError(401, "Invalid credentials");
  }

  // Successful login
  user.loginAttempts = 0;

  await user.save();

  return user;
};

export const updateProfileService = async (userId, name) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = name;

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    bookmarksCount: user.bookmarks?.length || 0,
    updatedAt: user.updatedAt,
  };
};
