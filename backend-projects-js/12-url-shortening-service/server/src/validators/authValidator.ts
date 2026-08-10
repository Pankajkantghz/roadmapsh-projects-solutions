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
