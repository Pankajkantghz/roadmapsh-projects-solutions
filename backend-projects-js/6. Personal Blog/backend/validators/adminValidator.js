import { z } from "zod";

export const userLockSchema = z.object({
  action: z
    .string({
      required_error: "Action is required",
    })
    .min(1, "Action is required")
    .refine((value) => ["lock", "unlock"].includes(value), {
      message: "Action must be lock or unlock",
    }),
});

export const updateUserRoleSchema = z.object({
  role: z
    .string({
      required_error: "Role is required",
    })
    .min(1, "Role is required")
    .refine((value) => ["user", "admin"].includes(value), {
      message: "Role must be user or admin",
    }),
});

export const updateUserStatusSchema = z.object({
  status: z
    .string({
      required_error: "Status is required",
    })
    .min(1, "Status is required")
    .refine((value) => ["active", "suspended", "banned"].includes(value), {
      message: "Status must be active, suspended, or banned",
    }),
});
export const adminUpdateArticleStatusSchema = z.object({
  status: z
    .string({
      required_error: "Status is required",
    })
    .min(1, "Status is required")
    .refine(
      (value) => ["draft", "published", "hidden", "blocked"].includes(value),
      {
        message: "Status must be draft, published, hidden, or blocked",
      },
    ),
});
