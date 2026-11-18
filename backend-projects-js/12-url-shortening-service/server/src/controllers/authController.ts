import { Request, Response } from "express";
import { loginUser, registerUser, refreshUserSession } from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import crypto from "crypto";
import { redisClient } from "../config/redis";
import { sendEmail } from "../utils/mailer";
import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { renderRoyalEmailTemplate } from "../utils/emailTemplates";

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
      subject: `${emailOtp} - Verify Your Identity | Darth Shortener`,
      html: renderRoyalEmailTemplate({
        title: "Welcome to Darth Shortener",
        bodyText:
          "Thank you for signing up. Please enter the secure registration token below to verify your email address and activate your account:",
        otpCode: emailOtp,
        footerNote:
          "This security code is temporary and will expire automatically within a 15-minute window.",
      }),
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
        isEmailVerified: user.isEmailVerified,
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
        isEmailVerified: user.isEmailVerified,
        accessToken,
      },
    });
  },
);

function readCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  const value = cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : undefined;
}

export const refreshHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { user, accessToken } = await refreshUserSession(readCookie(req, "refreshToken") || "");
  res.status(200).json({
    success: true,
    data: { id: user._id, username: user.username, email: user.email, accessToken },
  });
});

export const logoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(204).end();
};

export const currentUserHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("You are not logged in.", 401);
  const user = await User.findById(userId).select("username email isEmailVerified");
  if (!user) throw new AppError("User account not found.", 404);
  res.status(200).json({
    success: true,
    data: { id: user._id, username: user.username, email: user.email, isEmailVerified: user.isEmailVerified },
  });
});

export const verifyEmailHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { otp } = req.body;

    // Safely extract ID regardless of whether protect middleware attaches id or userId
    const userContext = req.user as
      | { id?: string; userId?: string }
      | undefined;
    const userId = userContext?.userId || userContext?.id;

    if (!userId) {
      throw new AppError(
        "Authentication context missing or invalid token payload.",
        401,
      );
    }

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

    // Evict token from Redis so it cannot be re-used
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
    const user = req.user as { id: string; email?: string } | undefined;
    const userId = user?.id;
    let email = user?.email;

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

    if (!email) throw new AppError("User email address is unavailable.", 500);

    const redisKey = `otp:verify:${userId}`;
    const freshOtp = crypto.randomInt(100000, 999999).toString();

    await redisClient.setEx(redisKey, 900, freshOtp);

    await sendEmail({
      to: email,
      subject: `${freshOtp} - New Verification Code | Darth Shortener`,
      html: renderRoyalEmailTemplate({
        title: "Fresh Verification Code",
        bodyText:
          "You requested a new verification token. Use the high-security code below to complete your account activation:",
        otpCode: freshOtp,
        footerNote:
          "This security token is valid for 15 minutes. If you did not request a new code, please secure your account.",
      }),
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
      res.status(200).json({
        success: true,
        message: "If an account exists for that email, a password reset link has been sent.",
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const redisKey = `password:reset:${hashedToken}`;

    await redisClient.setEx(redisKey, 600, user._id.toString());

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - Darth Shortener",
      html: renderRoyalEmailTemplate({
        title: "Password Reset Request",
        bodyText:
          "We received a request to reset your password. Click the secure button below to initialize a new credential stack:",
        actionButton: {
          text: "Reset Password Now",
          url: resetUrl,
        },
        footerNote:
          "This security link expires automatically in 10 minutes. If you did not request a password reset, you can safely ignore this email.",
      }),
    }).catch((err) => console.error("Background Mail Delivery Error:", err));

    res.status(200).json({
      success: true,
      message: "If an account exists for that email, a password reset link has been sent.",
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

export const googleAuthCallbackHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;

    if (!user) {
      throw new AppError("OAuth user context synchronization failed.", 401);
    }

    // 🔑 Generate standard JWT infrastructure stack using helper functions
    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    // 🍪 Inject the HTTP-Only Refresh Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Put the one-time handoff in the URL fragment so the token is not sent in HTTP requests or referrers.
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const handoff = new URLSearchParams({
      token: accessToken,
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      verified: String(Boolean(user.isEmailVerified)),
    });
    const targetDashboard = `${frontendUrl.replace(/\/$/, "")}/oauth-success#${handoff.toString()}`;
    res.redirect(targetDashboard);
  },
);
