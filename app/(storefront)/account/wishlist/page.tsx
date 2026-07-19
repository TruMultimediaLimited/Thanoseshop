import type { Metadata } from "next";
import { Heart } from "lucide-react";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { getWishlistProducts } from "@/lib/supabase/queries/wishlist";

export const metadata: Metadata = {
  title: "My Wishlist",
};

export default async function WishlistPage() {
  const products = await getWishlistProducts();
  const wishlistedIds = new Set(products.map((p) => p.id));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">My Wishlist</h1>

      {products.length === 0 ? (
        <EmptyState icon={<Heart className="size-8" />} message="Your wishlist is empty." />
      ) : (
        <ProductGrid products={products} wishlistedIds={wishlistedIds} />
      )}
    </div>
  );
}
