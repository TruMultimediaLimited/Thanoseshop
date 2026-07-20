"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  ok: boolean;
  message?: string;
}

// Simple spam guard: block a user from submitting more than one review in
// any 60-second window, across any product.
async function isRateLimited(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", oneMinuteAgo);

  return (count ?? 0) > 0;
}

export async function submitReview(input: {
  productId: string;
  orderItemId: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Please log in to leave a review." };
  if (input.rating < 1 || input.rating > 5) return { ok: false, message: "Invalid rating." };

  if (await isRateLimited(supabase, user.id)) {
    return { ok: false, message: "You're submitting too quickly — please wait a moment and try again." };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: input.productId,
    user_id: user.id,
    order_item_id: input.orderItemId,
    rating: input.rating,
    comment: input.comment.trim() || null,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/products`);
  return { ok: true, message: "Thanks! Your review is pending moderation." };
}
