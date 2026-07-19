import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Enter a variant name."),
  price: z.coerce.number().positive("Enter a positive price."),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().trim().optional().nullable(),
  stockQuantity: z.coerce.number().int().optional().nullable(),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});
export type ProductVariantInput = z.infer<typeof productVariantSchema>;

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a name."),
    slug: z
      .string()
      .trim()
      .min(2, "Enter a slug.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
    productType: z.enum(["topup", "giftcard", "subscription", "account"]),
    gameId: z.string().uuid().optional().or(z.literal("")),
    categoryId: z.string().uuid().optional().or(z.literal("")),
    regionId: z.string().uuid().optional().or(z.literal("")),
    description: z.string().trim().optional().or(z.literal("")),
    shortDescription: z.string().trim().optional().or(z.literal("")),
    thumbnailUrl: z.string().trim().optional().or(z.literal("")),
    gallery: z.array(z.string().trim().min(1)).default([]),
    basePrice: z.string().trim().optional().or(z.literal("")),
    compareAtPrice: z.string().trim().optional().or(z.literal("")),
    hasVariants: z.coerce.boolean().default(false),
    deliveryType: z.enum(["instant_code", "manual_topup", "account_credentials"]),
    deliveryInstructions: z.string().trim().optional().or(z.literal("")),
    requiresPlayerId: z.coerce.boolean().default(false),
    stockQuantity: z.string().trim().optional().or(z.literal("")),
    isPublished: z.coerce.boolean().default(true),
    isFeatured: z.coerce.boolean().default(false),
    isTrending: z.coerce.boolean().default(false),
    isBestSeller: z.coerce.boolean().default(false),
    metaTitle: z.string().trim().optional().or(z.literal("")),
    metaDescription: z.string().trim().optional().or(z.literal("")),
    sortOrder: z.coerce.number().int().default(0),
    variants: z.array(productVariantSchema).default([]),
  })
  .refine((data) => data.hasVariants || data.basePrice, {
    message: "Set a base price, or enable variants and add at least one.",
    path: ["basePrice"],
  })
  .refine((data) => !data.hasVariants || data.variants.length > 0, {
    message: "Add at least one variant, or turn off 'Has variants' and set a base price.",
    path: ["variants"],
  });
export type ProductInput = z.infer<typeof productSchema>;
