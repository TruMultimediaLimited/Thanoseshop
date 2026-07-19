"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  ok: boolean;
  wishlisted?: boolean;
  message?: string;
  requiresAuth?: boolean;
}

export async function toggleWishlist(productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Please log in to save items." };
  }

  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
    if (error) return { ok: false, message: error.message };
    revalidatePath("/account/wishlist");
    return { ok: true, wishlisted: false };
  }

  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: user.id, product_id: productId });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/account/wishlist");
  return { ok: true, wishlisted: true };
}
