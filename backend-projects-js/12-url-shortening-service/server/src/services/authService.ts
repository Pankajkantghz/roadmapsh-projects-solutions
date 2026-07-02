import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

interface RefreshDecoded {
  userId: string;
}

/**
 * Registers a brand-new user into the system after checking for unique email constraints.
 */
export async function registerUser(
  username: string,
  email: string,
  passwordPlain: string,
) {
  // 1. Enforce unique check strictly against email address
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("This email address is already registered.", 400);
  }

  // 2. Safe instantiation (Pre-save hooks in User model hash passwordPlain automatically)
  const newUser = await User.create({
    username,
    email,
    passwordHash: passwordPlain,
  });

  // 3. Structural token generations
  const accessToken = generateAccessToken({ userId: newUser._id.toString() });
  const refreshToken = generateRefreshToken({ userId: newUser._id.toString() });

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
}

/**
 * Authenticates an existing user profile checking email presence and hashing match metrics.
 */
export async function loginUser(email: string, passwordCandidate: string) {
  // 1. Locate user structure by email reference
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password provided.", 401);
  }

  // 2. Execute encrypted password verification match routines
  const isMatch = await user.comparePassword(passwordCandidate);
  if (!isMatch) {
    throw new AppError("Invalid email or password provided.", 401);
  }

  // 3. Issue fresh tracking token layers
  const accessToken = generateAccessToken({ userId: user._id.toString() });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

/**
 * Validates a long-term HTTP-Only refresh token to issue a new short-lived access token.
 */
export async function refreshUserSession(incomingRefreshToken: string) {
  if (!incomingRefreshToken) {
    throw new AppError("Refresh token missing. Please log in again.", 401);
  }

  try {
    // 1. Verify token integrity using your refresh secret key signature
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshDecoded;

    // 2. Double-check that the user still exists in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("The user owning this token no longer exists.", 401);
    }

    // 3. Issue a shiny new access token safely stringified
    const newAccessToken = generateAccessToken({ userId: user._id.toString() });

    return {
      user,
      accessToken: newAccessToken,
    };
  } catch (error) {
    throw new AppError(
      "Invalid or expired refresh token. Please sign in again.",
      401,
    );
  }
}
