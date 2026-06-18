import z from "zod";

// POST/Register
export const RegisterSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters long")
      .trim(),

    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address format")
      .toLowerCase()
      .trim(),

    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

// POST/login

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address format")
      .toLowerCase()
      .trim(),

    password: z.string({ error: "Password is required" }),
  }),
});
