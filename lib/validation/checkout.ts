import { z } from "zod";

import type { PaymentMethodType } from "@/lib/types/commerce";

export const checkoutSchema = z.object({
  paymentMethodId: z.string().uuid({ message: "Select a payment method." }),
  transactionId: z.string().trim().min(3, "Enter the transaction ID from your payment."),
  amountClaimed: z.coerce.number().positive("Enter the amount you paid."),
  couponCode: z.string().trim().optional().or(z.literal("")),
});

// Real bKash/Nagad transaction IDs are alphanumeric, so we validate exact
// length rather than digits-only.
export const TRX_ID_LENGTHS: Partial<Record<PaymentMethodType, number>> = {
  bkash: 10,
  nagad: 8,
};

const METHOD_LABELS: Partial<Record<PaymentMethodType, string>> = {
  bkash: "bKash",
  nagad: "Nagad",
};

export function getTransactionIdError(
  type: PaymentMethodType | undefined,
  value: string,
): string | null {
  const trimmed = value.trim();
  const expected = type ? TRX_ID_LENGTHS[type] : undefined;
  if (expected == null) return null;

  if (trimmed.length !== expected || !/^[A-Za-z0-9]+$/.test(trimmed)) {
    return `Enter the ${expected}-character ${METHOD_LABELS[type!] ?? ""} transaction ID.`.replace("  ", " ");
  }
  return null;
}

// z.coerce.number() accepts an unvalidated input (e.g. a string from a form
// field) and produces a validated number as output — those are genuinely
// different types, so react-hook-form needs both: the form works with the
// input shape until submit, zodResolver validates/coerces to the output
// shape for the submit handler.
export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutInput = z.output<typeof checkoutSchema>;
