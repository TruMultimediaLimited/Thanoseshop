import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Enter a code.")
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Letters, numbers, hyphens, and underscores only."),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.coerce.number().positive("Enter a positive value."),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxUses: z.string().trim().optional().or(z.literal("")),
  maxUsesPerUser: z.string().trim().optional().or(z.literal("")),
  startsAt: z.string().trim().optional().or(z.literal("")),
  expiresAt: z.string().trim().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
});
export type CouponInput = z.infer<typeof couponSchema>;
