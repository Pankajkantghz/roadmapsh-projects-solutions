import { z } from "zod";

//incoming payload for the POST/todos
export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .min(1, "Title cannotn be empty")
      .max(100, "Title cannot exceed 100 characters")
      .trim(),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional()
      .default(""),
  }),
});

// incoming payload for the PUT/todos/:id

export const updateTodoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannotn be empty")
      .max(100, "Title cannot exceed 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Todo ID format'), // Validates it is a real MongoDB ObjectId
  }),
});
