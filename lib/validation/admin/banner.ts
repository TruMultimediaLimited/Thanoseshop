import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().optional().or(z.literal("")),
  subtitle: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().min(1, "Upload an image."),
  mobileImageUrl: z.string().trim().optional().or(z.literal("")),
  linkUrl: z.string().trim().optional().or(z.literal("")),
  placement: z.enum(["hero", "promo", "category", "gift_card"]),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});
export type BannerInput = z.infer<typeof bannerSchema>;
