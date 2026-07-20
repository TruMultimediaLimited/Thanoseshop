import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, Faq, Game, Product, ProductWithRelations, Region } from "@/lib/types/catalog";

const PRODUCT_WITH_RELATIONS_SELECT = `
  *,
  game:games ( id, name, slug, logo_url ),
  category:categories ( id, name, slug ),
  region:regions ( id, name, code, flag_icon_url ),
  variants:product_variants ( * )
`;

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  gameSlug?: string;
  productType?: Product["product_type"];
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "best_selling";
}

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT, { count: "exact" })
    .eq("is_published", true)
    .is("deleted_at", null);

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  if (filters.productType) {
    query = query.eq("product_type", filters.productType);
  }
  // PostgREST only lets you filter on an embedded resource's columns when
  // that resource is joined with `!inner`, which PRODUCT_WITH_RELATIONS_SELECT
  // isn't (it's a left join so products without a game/category still show
  // up). Resolving the slug to an id first and filtering on the FK column
  // directly is simpler and avoids restructuring the select per-filter.
  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.gameSlug) {
    const game = await getGameBySlug(filters.gameSlug);
    query = query.eq("game_id", game?.id ?? "00000000-0000-0000-0000-000000000000");
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("base_price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("base_price", { ascending: false, nullsFirst: false });
      break;
    case "best_selling":
      query = query.order("is_best_seller", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    products: (data ?? []) as unknown as ProductWithRelations[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getFeaturedGiftCards(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("is_published", true)
    .in("product_type", ["giftcard", "subscription"])
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getFlashDeals(limit = 8) {
  const supabase = await createClient();
  // Postgres can't compare two columns of the same row through the
  // PostgREST query builder, so "genuinely discounted" isn't filterable
  // server-side without a raw SQL view. Convention instead: a flash deal is
  // a featured, variant-priced product — admins set compare_at_price on the
  // variant (shown as a strikethrough price) and feature the product to
  // surface it here.
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .eq("has_variants", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getBestSellers(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("is_published", true)
    .eq("is_best_seller", true)
    .is("deleted_at", null)
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getLatestProducts(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_RELATIONS_SELECT)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as Category | null;
}

export async function getGames(options: { popularOnly?: boolean; trendingOnly?: boolean; limit?: number } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("games")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null);

  if (options.popularOnly) query = query.eq("is_popular", true);
  if (options.trendingOnly) query = query.eq("is_trending", true);

  query = query.order("sort_order", { ascending: true });
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Game[];
}

export async function getGameBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as Game | null;
}

export async function getRegions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Region[];
}

export async function getFaqs(productId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  query = productId ? query.eq("product_id", productId) : query.is("product_id", null);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Faq[];
}
