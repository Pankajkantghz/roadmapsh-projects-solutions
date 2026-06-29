import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // Log severe system errors for debugging, but leave user validation errors quiet
  if (statusCode === 500) {
    console.error("SYSTEM CRASH LOG:", err);
  }

  // 🟢 Standardized Professional Format
  res.status(statusCode).json({
    success: false,
    message,
    // Safely hide the stack trace on production environments
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
