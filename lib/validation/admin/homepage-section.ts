import { z } from "zod";

export const SECTION_TYPES = [
  "hero_banner",
  "search_bar",
  "popular_games",
  "trending_games",
  "featured_gift_cards",
  "featured_categories",
  "best_sellers",
  "latest_products",
  "flash_deals",
  "why_choose_us",
  "testimonials",
  "faq",
  "newsletter",
] as const;

export const homepageSectionSchema = z.object({
  sectionType: z.enum(SECTION_TYPES),
  title: z.string().trim().optional().or(z.literal("")),
  subtitle: z.string().trim().optional().or(z.literal("")),
  configJson: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Config must be valid JSON." },
    ),
  isActive: z.coerce.boolean().default(true),
});
export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
