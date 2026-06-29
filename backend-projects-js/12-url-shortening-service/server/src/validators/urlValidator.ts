import { z } from "zod";

export const shortenUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string({ error: "Original URL is required" })
      .url("Invalid URL format"),
    customAlias: z
      .string()
      .min(3, "Custom alias must be at least 3 characters long")
      .max(30, "Custom alias cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "Custom alias can only contain alphanumeric characters, hyphens, and underscores",
      )
      .optional(),
    tags: z
      .array(z.string().trim())
      .max(10, "You can assign a maximum of 10 tags")
      .optional(),
    isFavorite: z.boolean().optional(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long")
      .optional(),
    expiresAt: z
      .string()
      .datetime({ message: "Invalid expiration date string format" })
      .refine((val) => new Date(val) > new Date(), {
        message: "Expiration date must be set in the future",
      })
      .transform((val) => new Date(val))
      .optional(),
  }),
});

export const getUrlsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    tag: z.string().optional(),
    isFavorite: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    page: z
      .string()
      .default("1")
      .transform((val) => Math.max(1, parseInt(val, 10))),
    limit: z
      .string()
      .default("10")
      .transform((val) => Math.max(1, Math.min(100, parseInt(val, 10)))),
  }),
});

export const redirectSchema = z.object({
  params: z.object({
    shortCode: z.string().min(1, "Short code routing parameter is required"),
  }),
});
