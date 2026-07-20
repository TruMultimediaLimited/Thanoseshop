import { ProductCard } from "@/components/catalog/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { ProductWithRelations } from "@/lib/types/catalog";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: {
  products: ProductWithRelations[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
