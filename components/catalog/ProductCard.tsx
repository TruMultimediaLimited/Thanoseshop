import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WishlistButton } from "@/components/catalog/WishlistButton";
import type { ProductWithRelations } from "@/lib/types/catalog";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function displayPrice(product: ProductWithRelations) {
  if (product.has_variants) {
    const published = product.variants.filter((v) => v.is_published);
    if (published.length === 0) return null;
    const cheapest = published.reduce((min, v) => (v.price < min.price ? v : min));
    return {
      label: "From",
      amount: cheapest.price,
      compareAt:
        cheapest.compare_at_price != null && cheapest.compare_at_price > cheapest.price
          ? cheapest.compare_at_price
          : null,
    };
  }
  if (product.base_price != null) {
    return {
      label: null,
      amount: product.base_price,
      compareAt:
        product.compare_at_price != null && product.compare_at_price > product.base_price
          ? product.compare_at_price
          : null,
    };
  }
  return null;
}

export function ProductCard({
  product,
  isWishlisted = false,
}: {
  product: ProductWithRelations;
  isWishlisted?: boolean;
}) {
  const price = displayPrice(product);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="overflow-hidden gap-0 py-0 transition-colors group-hover:border-primary/50">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              No image
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {price?.compareAt != null && (
              <Badge className="font-semibold shadow-sm">
                -{Math.round(((price.compareAt - price.amount) / price.compareAt) * 100)}%
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge variant="accent" className="font-semibold shadow-sm">
                Best Seller
              </Badge>
            )}
            {product.is_trending && !product.is_best_seller && (
              <Badge variant="secondary" className="font-semibold shadow-sm">
                Trending
              </Badge>
            )}
          </div>

          <WishlistButton
            productId={product.id}
            initialWishlisted={isWishlisted}
            className="absolute top-2 right-2 size-8"
          />

          {product.region && (
            <Badge
              variant="outline"
              className="bg-background/80 absolute right-2 bottom-2 backdrop-blur"
            >
              {product.region.name}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-0.5 p-2">
          <p className="text-xs leading-tight font-semibold">{product.name}</p>
          {price && (
            <p className="text-xs font-semibold">
              {price.label && (
                <span className="text-muted-foreground mr-1 font-normal">
                  {price.label}
                </span>
              )}
              {formatPrice(price.amount)}
              {price.compareAt != null && (
                <span className="text-muted-foreground ml-1 font-normal line-through">
                  {formatPrice(price.compareAt)}
                </span>
              )}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export { formatPrice };
