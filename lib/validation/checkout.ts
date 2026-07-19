import { z } from "zod";

export const checkoutSchema = z.object({
  paymentMethodId: z.string().uuid({ message: "Select a payment method." }),
  transactionId: z.string().trim().min(3, "Enter the transaction ID from your payment."),
  screenshotPath: z.string().min(1, "Upload a screenshot of your payment."),
  amountClaimed: z.coerce.number().positive("Enter the amount you paid."),
  couponCode: z.string().trim().optional().or(z.literal("")),
});

// z.coerce.number() accepts an unvalidated input (e.g. a string from a form
// field) and produces a validated number as output — those are genuinely
// different types, so react-hook-form needs both: the form works with the
// input shape until submit, zodResolver validates/coerces to the output
// shape for the submit handler.
export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutInput = z.output<typeof checkoutSchema>;
