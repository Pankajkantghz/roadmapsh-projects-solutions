import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Request, Response } from "express";
import { RefreshToken } from "../models/refreshToken.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util.js"; // Swapped out utility path

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "All fields (name, email, password) are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate both token variants
    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = await generateRefreshToken(newUser._id.toString());

    res.status(201).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error during registration" });
    return;
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate both token variants
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = await generateRefreshToken(user._id.toString());

    res.status(200).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login" });
    return;
  }
};

// POST /api/auth/refresh
export const refreshSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    if (new Date() > storedToken.expiresAt) {
      await storedToken.deleteOne();
      res.status(401).json({ message: "Refresh token expired. Please login again" });
      return;
    }

    const newAccessToken = generateAccessToken(storedToken.userId.toString());

    res.status(200).json({ accessToken: newAccessToken });
    return;
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Server error during token rotation" });
    return;
  }
};

// POST /api/auth/logout
export const logoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.status(200).json({ message: "Logged out successfully, session revoked." });
    return;
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
    return;
  }
};
