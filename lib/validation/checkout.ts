import { z } from "zod";

import type { PaymentMethodType } from "@/lib/types/commerce";

export const checkoutSchema = z.object({
  paymentMethodId: z.string().uuid({ message: "Select a payment method." }),
  transactionId: z.string().trim().min(3, "Enter the transaction ID from your payment."),
  amountClaimed: z.coerce.number().positive("Enter the amount you paid."),
  couponCode: z.string().trim().optional().or(z.literal("")),
});

// Real transaction IDs are alphanumeric: bKash is 10 characters and always
// starts with D, E, F, or G; Nagad is 8 characters.
const TRX_ID_RULES: Partial<
  Record<PaymentMethodType, { length: number; pattern: RegExp; error: string }>
> = {
  bkash: {
    length: 10,
    pattern: /^[DEFG][A-Z0-9]{9}$/i,
    error: "bKash transaction ID is 10 characters and starts with D, E, F, or G.",
  },
  nagad: {
    length: 8,
    pattern: /^[A-Z0-9]{8}$/i,
    error: "Nagad transaction ID is 8 characters.",
  },
};

export const TRX_ID_LENGTHS: Partial<Record<PaymentMethodType, number>> = {
  bkash: TRX_ID_RULES.bkash!.length,
  nagad: TRX_ID_RULES.nagad!.length,
};

export const TRX_ID_HINTS: Partial<Record<PaymentMethodType, string>> = {
  bkash: "10 characters, starts with D, E, F, or G (e.g. D7A2B9C1X4).",
  nagad: "8 characters (e.g. 74XK2M9P).",
};

export function getTransactionIdError(
  type: PaymentMethodType | undefined,
  value: string,
): string | null {
  const rule = type ? TRX_ID_RULES[type] : undefined;
  if (!rule) return null;
  return rule.pattern.test(value.trim()) ? null : rule.error;
}

// z.coerce.number() accepts an unvalidated input (e.g. a string from a form
// field) and produces a validated number as output — those are genuinely
// different types, so react-hook-form needs both: the form works with the
// input shape until submit, zodResolver validates/coerces to the output
// shape for the submit handler.
export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutInput = z.output<typeof checkoutSchema>;
