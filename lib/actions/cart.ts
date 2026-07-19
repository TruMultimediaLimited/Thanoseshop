"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  ok: boolean;
  message?: string;
  requiresAuth?: boolean;
}

async function getOrCreateCartId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw error;
  return created.id as string;
}

export async function addToCart(input: {
  productId: string;
  variantId: string | null;
  quantity: number;
  playerIdNote: string | null;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Please log in to add items to your cart." };
  }

  if (input.quantity < 1) {
    return { ok: false, message: "Quantity must be at least 1." };
  }

  const cartId = await getOrCreateCartId(supabase, user.id);

  // No true upsert here: cart_items uses two partial unique indexes (see
  // Phase 1 migrations) to correctly treat NULL variant_id as "the same
  // row" for merge purposes, since a plain UNIQUE(...) treats every NULL as
  // distinct. That means the standard onConflict upsert can't target the
  // right partial index, so we check-then-write instead.
  let existingQuery = supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", input.productId);

  existingQuery = input.variantId
    ? existingQuery.eq("variant_id", input.variantId)
    : existingQuery.is("variant_id", null);

  const { data: existing } = await existingQuery.maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + input.quantity })
      .eq("id", existing.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: input.productId,
      variant_id: input.variantId,
      quantity: input.quantity,
      player_id_note: input.playerIdNote,
    });
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/cart");
  return { ok: true };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<ActionResult> {
  if (quantity < 1) return { ok: false, message: "Quantity must be at least 1." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/cart");
  return { ok: true };
}

export async function removeCartItem(cartItemId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/cart");
  return { ok: true };
}

export async function clearCart(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, requiresAuth: true };

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (cart) {
    const { error } = await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/cart");
  return { ok: true };
}
