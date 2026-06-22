import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";
import { catchAsync } from "../utils/catchAsync.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = catchAsync(async (req, res, next) => {

  const { name, email, password } = req.body;

  const existingUser = await authService.findUserByEmail(email);

  if (existingUser) {

    return res
      .status(409)
      .json({ success: false, message: "Email is already registered" });

  }

  const newUser = await authService.createUser(name, email, password);

  const accessToken = generateAccessToken(newUser.id);
  
  const refreshToken = generateRefreshToken(newUser.id);

  await authService.storeRefreshToken(newUser.id, refreshToken);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user: newUser, accessToken },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.verifyUserCredentials(email, password);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await authService.storeRefreshToken(user.id, refreshToken);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, accessToken },
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token missing" });
  }

  const isWhitelisted = await authService.verifyWhitelistedToken(refreshToken);
  if (!isWhitelisted) {
    return res
      .status(403)
      .json({ success: false, message: "Session revoked or invalid" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const newAccessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// ✅ REMOVED: The duplicate catchAsync utility definition has been removed from here
