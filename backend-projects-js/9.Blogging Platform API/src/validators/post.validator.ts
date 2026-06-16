import { z } from "zod";

export const createPostValidator = z.object({
  body: z.object({
    title: z
      .string({ message: "Title is required" })
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title cannot exceed 255 characters"),
    content: z
      .string({ message: "Content is required" })
      .min(10, "Content must be at least 10 characters long"),
    category: z
      .string({ message: "Category is required" })
      .min(2, "Category must be at least 2 characters long"),

    tags: z.array(z.string()).min(1, "Please provide at least one tag"),
  }),
});

export type CreatePostValidatorInput = z.infer<typeof createPostValidator>;
