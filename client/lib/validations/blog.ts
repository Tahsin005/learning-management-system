import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title cannot exceed 160 characters"),
  body: z
    .string()
    .trim()
    .min(10, "Article body must be at least 10 characters"),
  coverImageUrl: z
    .string()
    .url("Please enter a valid cover image URL")
    .or(z.literal(""))
    .optional(),
  isPublished: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
