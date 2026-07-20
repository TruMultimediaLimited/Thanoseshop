"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, getTransactionIdError } from "@/lib/validation/checkout";
import type { PaymentMethodType } from "@/lib/types/commerce";

interface CheckoutResult {
  ok: boolean;
  message?: string;
  orderId?: string;
  requiresAuth?: boolean;
}

export async function placeOrder(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid checkout details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Please log in to check out." };
  }

  const { paymentMethodId, transactionId, amountClaimed, couponCode } = parsed.data;

  // Re-validate the transaction ID against the selected method's expected
  // format (bKash 10 chars, Nagad 8) — the client check alone isn't trusted.
  const { data: method } = await supabase
    .from("payment_methods")
    .select("type")
    .eq("id", paymentMethodId)
    .eq("is_active", true)
    .single();

  if (!method) {
    return { ok: false, message: "Select a valid payment method." };
  }

  const trxError = getTransactionIdError(method.type as PaymentMethodType, transactionId);
  if (trxError) {
    return { ok: false, message: trxError };
  }

  // place_order() is the single atomic entry point for turning a cart into
  // an order — it snapshots prices, decrements stock, validates the coupon,
  // and clears the cart server-side (see supabase/migrations/..._functions.sql).
  const { data, error } = await supabase.rpc("place_order", {
    p_payment_method_id: paymentMethodId,
    p_transaction_id: transactionId,
    p_screenshot_path: null,
    p_amount_claimed: amountClaimed,
    p_coupon_code: couponCode ? couponCode.trim().toUpperCase() : null,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const order = Array.isArray(data) ? data[0] : data;

  revalidatePath("/cart");
  revalidatePath("/account/orders");

  return { ok: true, orderId: order?.order_id };
}
