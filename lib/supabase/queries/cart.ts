import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CartItemWithProduct } from "@/lib/types/commerce";

const CART_ITEM_SELECT = `
  id, cart_id, product_id, variant_id, quantity, player_id_note,
  product:products ( id, name, slug, thumbnail_url, base_price, requires_player_id ),
  variant:product_variants ( id, name, price )
`;

export async function getCurrentUserCartItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!cart) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select(CART_ITEM_SELECT)
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as CartItemWithProduct[];
}

export function computeCartTotal(items: CartItemWithProduct[]) {
  return items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.base_price ?? 0;
    return sum + price * item.quantity;
  }, 0);
}
