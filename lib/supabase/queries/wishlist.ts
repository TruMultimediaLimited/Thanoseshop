import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ProductWithRelations } from "@/lib/types/catalog";

export async function getWishlistedProductIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Set();

  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.product_id as string));
}

const PRODUCT_WITH_RELATIONS_SELECT = `
  *,
  game:games ( id, name, slug, logo_url ),
  category:categories ( id, name, slug ),
  region:regions ( id, name, code, flag_icon_url ),
  variants:product_variants ( * )
`;

export async function getWishlistProducts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlists")
    .select(`product:products ( ${PRODUCT_WITH_RELATIONS_SELECT} )`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as unknown as { product: ProductWithRelations }[])
    .map((row) => row.product)
    .filter(Boolean);
}
