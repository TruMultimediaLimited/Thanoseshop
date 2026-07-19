"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation/checkout";

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

  const { paymentMethodId, transactionId, screenshotPath, amountClaimed, couponCode } = parsed.data;

  // place_order() is the single atomic entry point for turning a cart into
  // an order — it snapshots prices, decrements stock, validates the coupon,
  // and clears the cart server-side (see supabase/migrations/..._functions.sql).
  const { data, error } = await supabase.rpc("place_order", {
    p_payment_method_id: paymentMethodId,
    p_transaction_id: transactionId,
    p_screenshot_path: screenshotPath,
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
