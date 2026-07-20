import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { ProductWithRelations } from "@/lib/types/catalog";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Compact tile: image + name only, same fixed size as GameCard.
// Prices/packages live on the product page.
export function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="overflow-hidden gap-0 py-0 transition-colors group-hover:border-primary/50">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 20vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              No image
            </div>
          )}
        </div>

        <div className="flex h-9 items-center justify-center px-1.5">
          <p className="line-clamp-2 text-center text-[11px] leading-tight font-semibold">
            {product.name}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export { formatPrice };
