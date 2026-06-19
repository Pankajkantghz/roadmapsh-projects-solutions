import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.util.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_this";

// POST/Register
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

    const token = generateToken(newUser._id as any);

    res.status(201).json({ token });
    return;
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error during registration" });
    return;
  }
};

// POST/Login

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
    //

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = generateToken(user._id as any);
    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login" });
    return;
  }
};
