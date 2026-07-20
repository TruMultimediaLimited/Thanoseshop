import { ProductCard } from "@/components/catalog/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { ProductWithRelations } from "@/lib/types/catalog";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  wishlistedIds,
}: {
  products: ProductWithRelations[];
  emptyMessage?: string;
  wishlistedIds?: Set<string>;
}) {
  if (products.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistedIds?.has(product.id) ?? false}
        />
      ))}
    </div>
  );
}
