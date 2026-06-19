import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_this";

interface jwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({ message: "Not authorized, token missing" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwtPayload;

    req.user = { id: decoded.userId };
    next();
    return;
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid or expired" });
    return;
  }
};
