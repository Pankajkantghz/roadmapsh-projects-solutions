import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  const randomToken = crypto.randomBytes(40).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId,
    token: randomToken,
    expiresAt,
  });

  return randomToken;
};
