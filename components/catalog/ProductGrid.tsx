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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
