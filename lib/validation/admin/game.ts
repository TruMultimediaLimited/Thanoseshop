import { z } from "zod";

export const gameSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  bannerUrl: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  publisher: z.string().trim().optional().or(z.literal("")),
  metaTitle: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
  isTrending: z.coerce.boolean().default(false),
  isPopular: z.coerce.boolean().default(false),
});
export type GameInput = z.infer<typeof gameSchema>;
