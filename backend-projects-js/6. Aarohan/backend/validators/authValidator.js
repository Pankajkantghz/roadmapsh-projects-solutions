import { z } from "zod";

export const signupSchema = z
  .object({
    name: z

      .string()

      .min(
        3,

        "Name must be at least 3 characters",
      ),

    email: z.email("Invalid email"),

    password: z

      .string()

      .min(
        6,

        "Password must be at least 6 characters",
      ),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.email("Invalid email"),

    password: z

      .string()

      .min(
        1,

        "Password is required",
      ),
  })
  .strict();

export const updateProfileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
});
