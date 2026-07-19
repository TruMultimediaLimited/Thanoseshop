import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Enter a site name."),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  faviconUrl: z.string().trim().optional().or(z.literal("")),
  contactEmail: z.string().trim().optional().or(z.literal("")),
  contactPhone: z.string().trim().optional().or(z.literal("")),
  whatsappNumber: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  footerText: z.string().trim().optional().or(z.literal("")),
  defaultMetaTitle: z.string().trim().optional().or(z.literal("")),
  defaultMetaDescription: z.string().trim().optional().or(z.literal("")),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const seoSettingSchema = z.object({
  pageKey: z.string().trim().min(1, "Enter a page key."),
  metaTitle: z.string().trim().optional().or(z.literal("")),
  metaDescription: z.string().trim().optional().or(z.literal("")),
  ogImageUrl: z.string().trim().optional().or(z.literal("")),
  canonicalUrl: z.string().trim().optional().or(z.literal("")),
});
export type SeoSettingInput = z.infer<typeof seoSettingSchema>;
