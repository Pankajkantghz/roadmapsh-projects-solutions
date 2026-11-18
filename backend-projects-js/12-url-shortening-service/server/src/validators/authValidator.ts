import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ error: "Username is required" })
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username cannot exceed 30 characters"),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email format structures"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email format structures"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }).strict(),
});

export const verifyEmailSchema = z.object({
  body: z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code") }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email("Enter a valid email address") }),
});

export const resetPasswordSchema = z.object({
  params: z.object({ token: z.string().min(1, "Reset token is required") }),
  body: z.object({ password: z.string().min(6, "Password must be at least 6 characters long") }),
});
