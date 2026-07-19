import Link from "next/link";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/button";
import type { ProductWithRelations } from "@/lib/types/catalog";

export function ProductRailSection({
  title,
  subtitle,
  products,
  viewAllHref,
  emptyMessage,
}: {
  title?: string | null;
  subtitle?: string | null;
  products: ProductWithRelations[];
  viewAllHref?: string;
  emptyMessage: string;
}) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <SectionHeading title={title} subtitle={subtitle} />
        {viewAllHref && products.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={viewAllHref}>View all</Link>
          </Button>
        )}
      </div>
      <ProductGrid products={products} emptyMessage={emptyMessage} />
    </section>
  );
}
