import { z } from "zod";

export const paymentMethodSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  type: z.enum(["bkash", "nagad", "rocket", "bank", "other"]),
  accountNumber: z.string().trim().optional().or(z.literal("")),
  accountName: z.string().trim().optional().or(z.literal("")),
  bankName: z.string().trim().optional().or(z.literal("")),
  branch: z.string().trim().optional().or(z.literal("")),
  routingNumber: z.string().trim().optional().or(z.literal("")),
  instructions: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});
export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
