import { z } from "zod";

const headingBlock = z.object({
  type: z.literal("heading"),

  level: z.number().min(1).max(6),

  text: z.string().min(1),
});

const paragraphBlock = z.object({
  type: z.literal("paragraph"),

  text: z.string().min(1),
});

const imageBlock = z.object({
  type: z.literal("image"),

  url: z.string().url(),

  caption: z.string().optional(),
});

const codeBlock = z.object({
  type: z.literal("code"),

  language: z.string(),

  content: z.string().min(1),
});

const quoteBlock = z.object({
  type: z.literal("quote"),

  text: z.string().min(1),
});

const listBlock = z.object({
  type: z.literal("list"),

  style: z.enum(["ordered", "unordered"]),

  items: z.array(z.string()).min(1),
});

const contentBlockSchema = z.union([
  headingBlock,
  paragraphBlock,
  imageBlock,
  codeBlock,
  quoteBlock,
  listBlock,
]);

export const createArticleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),

  content: z.array(contentBlockSchema).min(1, "Content is required"),

  category: z.string().min(3, "Category must be at least 3 characters"),

  tags: z.array(z.string()).optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(5).optional(),

  content: z.array(contentBlockSchema).optional(),

  category: z.string().min(3).optional(),

  tags: z.array(z.string()).optional(),
});

export const updateArticleStatusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});
