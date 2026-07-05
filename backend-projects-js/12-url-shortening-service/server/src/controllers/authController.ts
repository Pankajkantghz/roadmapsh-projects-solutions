import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import crypto from "crypto";
import { redisClient } from "../config/redis";
import { sendEmail } from "../utils/mailer";
import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const registerHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } = await registerUser(
      username,
      email,
      password,
    );

    const emailOtp = crypto.randomInt(100000, 999999).toString();
    const redisKey = `otp:verify:${user._id}`;

    await redisClient.setEx(redisKey, 900, emailOtp);

    await sendEmail({
      to: user.email,
      subject: "Verify Your Identity - Darth Shortener",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Welcome to Darth Shortener!</h2>
          <p>Thank you for signing up. Please verify your email address using the secure registration token below:</p>
          <div style="background: #f1f5f9; padding: 15px; font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; border-radius: 6px; color: #0f172a; margin: 20px 0; border: 1px dashed #cbd5e1;">
            ${emailOtp}
          </div>
          <p style="font-size: 13px; color: #64748b;">This validation challenge is temporary and will expire inside a 15-minute runtime window.</p>
        </div>
      `,
    }).catch((err) => console.error("Background Mail Delivery Error:", err));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    res.status(201).json({
      success: true,
      message:
        "User account registered successfully. Please verify your email.",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
      },
    });
  },
);

export const loginHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Authentication successful. Welcome back!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
      },
    });
  },
);

export const verifyEmailHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { otp } = req.body;

    const userId = req.user!.id;

    if (!otp) {
      throw new AppError(
        "Please provide a valid 6-digit verification code.",
        400,
      );
    }

    const redisKey = `otp:verify:${userId}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp) {
      throw new AppError(
        "Verification code has expired. Please request a new one.",
        400,
      );
    }

    if (storedOtp !== otp) {
      throw new AppError(
        "Incorrect verification code. Please check your inbox.",
        400,
      );
    }

    await User.findByIdAndUpdate(userId, { isEmailVerified: true });

    //Evict token from Redis so it cannot be re-used
    await redisClient.del(redisKey);

    res.status(200).json({
      success: true,
      message:
        "Email address verified successfully! Your account is now fully activated.",
    });
  },
);

export const resendVerificationHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    let email = req.user?.email;

    if (!userId) {
      throw new AppError(
        "Authentication context missing. Please log in again.",
        401,
      );
    }

    if (!email) {
      const userRecord = await User.findById(userId);
      if (!userRecord) {
        throw new AppError("User record not found.", 404);
      }
      email = userRecord.email;
    }

    const redisKey = `otp:verify:${userId}`;
    const freshOtp = crypto.randomInt(100000, 999999).toString();

    await redisClient.setEx(redisKey, 900, freshOtp);

    await sendEmail({
      to: email,
      subject: "New Verification Code - Darth Shortener",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Fresh Verification Token</h2>
          <p>You requested a new verification code. Use the secure token below to activate your account:</p>
          <div style="background: #f1f5f9; padding: 15px; font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; border-radius: 6px; color: #0f172a; margin: 20px 0; border: 1px dashed #cbd5e1;">
            ${freshOtp}
          </div>
        </div>
      `,
    }).catch((err) => console.error("Background Mail Delivery Error:", err));

    res.status(200).json({
      success: true,
      message:
        "A fresh verification token has been successfully dispatched to your inbox.",
    });
  },
);

export const forgotPasswordHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Please provide your email address.", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("No user found with that email address.", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const redisKey = `password:reset:${hashedToken}`;

    await redisClient.setEx(redisKey, 600, user._id.toString());

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - Darth Shortener",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the secure button below to create a new credential stack:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b; word-break: break-all;">If the button doesn't work, copy and paste this link into your browser:<br>${resetUrl}</p>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px;">This security link expires automatically in 10 minutes.</p>
        </div>
      `,
    }).catch((err) => console.error("Background Mail Delivery Error:", err));

    res.status(200).json({
      success: true,
      message: "A password reset link has been dispatched to your email inbox.",
    });
  },
);

export const resetPasswordHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new AppError("Please provide a new secure password.", 400);
    }

    
    const hashedToken = crypto
      .createHash("sha256")
      .update(token as string)
      .digest("hex");
    const redisKey = `password:reset:${hashedToken}`;

    const userId = await redisClient.get(redisKey);
    if (!userId) {
      throw new AppError("The reset token is invalid or has expired.", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User account no longer exists.", 404);
    }

    user.passwordHash = password;
    await user.save();

    await redisClient.del(redisKey);

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully! You can now log in with your new credentials.",
    });
  },
);
