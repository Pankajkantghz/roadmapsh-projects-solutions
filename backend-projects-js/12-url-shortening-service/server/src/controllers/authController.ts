import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { catchAsync } from "../utils/catchAsync";

export const registerHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } = await registerUser(
      username,
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    res.status(201).json({
      success: true,
      message: "User account registered successfully.",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    res.status(200).json({
      success: true,
      message: "Authentication successful. Welcome back!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
      },
    });
  },
);
