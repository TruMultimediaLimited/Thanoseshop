import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types/content";

export async function getApprovedReviews(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles(full_name)")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    reviewer_name: row.reviewer?.full_name ?? "Verified Buyer",
  })) as Review[];
}

/**
 * A customer can review a product once they have a delivered order_item
 * for it — this is what "verified buyer" actually means here, not just
 * "logged in." Returns the order_item to attach to the review, or null if
 * they're not eligible (and whether they've already reviewed it).
 */
export async function getReviewEligibility(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { canReview: false, alreadyReviewed: false, orderItemId: null };

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingReview) return { canReview: false, alreadyReviewed: true, orderItemId: null };

  const { data: orderItem } = await supabase
    .from("order_items")
    .select("id, order:orders!inner(user_id, status)")
    .eq("product_id", productId)
    .eq("order.user_id", user.id)
    .eq("order.status", "completed")
    .limit(1)
    .maybeSingle();

  return {
    canReview: Boolean(orderItem),
    alreadyReviewed: false,
    orderItemId: orderItem?.id ?? null,
  };
}
