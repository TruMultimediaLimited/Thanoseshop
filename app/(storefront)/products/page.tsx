import type { Metadata } from "next";

import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/common/Pagination";
import { getCategories, getGames, getProducts, type ProductFilters as Filters } from "@/lib/supabase/queries/catalog";
import { getWishlistedProductIds } from "@/lib/supabase/queries/wishlist";
import type { ProductType } from "@/lib/types/catalog";

export const metadata: Metadata = {
  title: "All Products",
};

const VALID_TYPES = new Set(["topup", "giftcard", "subscription", "account"]);
const VALID_SORTS = new Set(["newest", "price_asc", "price_desc", "best_selling"]);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const filters: Filters = {
    search: params.q,
    categorySlug: params.category,
    gameSlug: params.game,
    productType: VALID_TYPES.has(params.type ?? "") ? (params.type as ProductType) : undefined,
    sort: VALID_SORTS.has(params.sort ?? "") ? (params.sort as Filters["sort"]) : "newest",
    page,
    pageSize: 24,
  };

  const [{ products, total, pageSize }, categories, games, wishlistedIds] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getGames(),
    getWishlistedProductIds(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {total} product{total === 1 ? "" : "s"} found
        </p>
      </div>

      <ProductFilters categories={categories} games={games} />

      <ProductGrid
        products={products}
        emptyMessage="No products match your filters."
        wishlistedIds={wishlistedIds}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/products"
        searchParams={params}
      />
    </div>
  );
}
