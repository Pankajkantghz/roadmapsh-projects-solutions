import jwt from "jsonwebtoken";
import { Types } from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_this";

export const generateToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "24h",
  });
};
