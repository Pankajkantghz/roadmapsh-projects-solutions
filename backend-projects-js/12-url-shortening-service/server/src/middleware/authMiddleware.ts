import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

 
  if (!token) {
    throw new AppError("You are not logged in. Please provide a valid token to gain access.", 401);
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as DecodedToken;

    
    req.user = {
      id: decoded.userId,
    };

    next(); 
  } catch (error) {
    throw new AppError("Invalid or expired access token. Please authenticate again.", 401);
  }
});