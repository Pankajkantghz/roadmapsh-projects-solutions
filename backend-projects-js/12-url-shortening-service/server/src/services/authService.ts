import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

interface RefreshDecoded {
  userId: string;
}

export async function registerUser(
  username: string,
  email: string,
  passwordPlain: string,
) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("This email address is already registered.", 400);
  }

  // pre-save hooks in model handle hashing automatically
  const newUser = await User.create({
    username,
    email,
    passwordHash: passwordPlain,
  });

  const accessToken = generateAccessToken({ userId: newUser._id.toString() });
  const refreshToken = generateRefreshToken({ userId: newUser._id.toString() });

  return { user: newUser, accessToken, refreshToken };
}

export async function loginUser(email: string, passwordCandidate: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password provided.", 401);
  }

  const isMatch = await user.comparePassword(passwordCandidate);
  if (!isMatch) {
    throw new AppError("Invalid email or password provided.", 401);
  }

  const accessToken = generateAccessToken({ userId: user._id.toString() });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return { user, accessToken, refreshToken };
}

export async function refreshUserSession(incomingRefreshToken: string) {
  if (!incomingRefreshToken) {
    throw new AppError("Refresh token missing. Please log in again.", 401);
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshDecoded;

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("The user owning this token no longer exists.", 401);
    }

    const newAccessToken = generateAccessToken({ userId: user._id.toString() });

    return { user, accessToken: newAccessToken };
  } catch (error) {
    throw new AppError(
      "Invalid or expired refresh token. Please sign in again.",
      401,
    );
  }
}
