"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types/catalog";
import { formatPrice } from "@/components/catalog/ProductCard";

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (variantId: string) => void;
}) {
  const published = variants.filter((v) => v.is_published);

  if (published.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {published.map((variant) => {
        const outOfStock =
          variant.stock_quantity !== null && variant.stock_quantity <= 0;
        const selected = variant.id === selectedId;

        return (
          <button
            key={variant.id}
            type="button"
            disabled={outOfStock}
            onClick={() => onSelect(variant.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              selected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
            )}
          >
            <p className="font-medium">{variant.name}</p>
            <p className="text-muted-foreground text-xs">
              {outOfStock ? "Out of stock" : formatPrice(variant.price)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
