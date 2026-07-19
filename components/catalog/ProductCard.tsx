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
    const prices = product.variants
      .filter((v) => v.is_published)
      .map((v) => v.price);
    if (prices.length === 0) return null;
    return { label: "From", amount: Math.min(...prices) };
  }
  if (product.base_price != null) {
    return { label: null, amount: product.base_price };
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
        <div className="bg-muted relative aspect-square w-full overflow-hidden">
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

        <div className="flex flex-col gap-1 p-3">
          {product.game?.name && (
            <p className="text-muted-foreground truncate text-xs">
              {product.game.name}
            </p>
          )}
          <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
          {price && (
            <p className="mt-1 text-sm font-semibold">
              {price.label && (
                <span className="text-muted-foreground mr-1 font-normal">
                  {price.label}
                </span>
              )}
              {formatPrice(price.amount)}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export { formatPrice };
