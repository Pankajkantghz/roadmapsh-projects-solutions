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

export const updateUrlSchema = z.object({
  params: z.object({
    id: z.string().min(1, "URL ID parameter is required"),
  }),
  body: z.object({
    tags: z
      .array(z.string().trim())
      .max(10, "You can assign a maximum of 10 tags")
      .optional(),
    isFavorite: z.boolean().optional(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long")
      .nullable()
      .optional(),
    expiresAt: z
      .string()
      .datetime({ message: "Invalid expiration date string format" })
      .refine((val) => new Date(val) > new Date(), {
        message: "Expiration date must be set in the future",
      })
      .transform((val) => new Date(val))
      .nullable()
      .optional(),
  }),
});

export const bulkDeleteSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().min(1, "ID cannot be empty"))
      .min(1, "At least one target ID must be provided")
      .max(100, "Cannot delete more than 100 links in a single request"),
  }),
});

export const getUrlsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    tag: z.string().optional(),
    isFavorite: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? val === "true" : undefined)),
    page: z
      .string()
      .default("1")
      .transform((val) => {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 1 : Math.max(1, parsed);
      }),
    limit: z
      .string()
      .default("10")
      .transform((val) => {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 10 : Math.max(1, Math.min(100, parsed));
      }),
  }),
});

export const redirectSchema = z.object({
  params: z.object({
    shortCode: z.string().min(1, "Short code routing parameter is required"),
  }),
  body: z
    .object({
      password: z.string().optional(),
    })
    .optional(),
});