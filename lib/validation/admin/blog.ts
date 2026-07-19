import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().trim().min(2, "Enter a title."),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().trim().min(10, "Write some content."),
  coverImageUrl: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  metaTitle: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().optional().or(z.literal("")),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;
