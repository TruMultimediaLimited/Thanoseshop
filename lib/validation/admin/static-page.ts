import { z } from "zod";

export const staticPageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(2, "Enter a title."),
  content: z.string().trim().min(1, "Enter the page content."),
  metaTitle: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().optional().or(z.literal("")),
  isPublished: z.coerce.boolean().default(true),
});
export type StaticPageInput = z.infer<typeof staticPageSchema>;
