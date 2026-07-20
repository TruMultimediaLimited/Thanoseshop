"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VariantSelector } from "@/components/catalog/VariantSelector";
import { WishlistButton } from "@/components/catalog/WishlistButton";
import { formatPrice } from "@/components/catalog/ProductCard";
import { addToCart } from "@/lib/actions/cart";
import type { ProductWithRelations } from "@/lib/types/catalog";

// Deliberately image-free: the owner wants the purchase page to open
// straight to the packages (images live on the homepage tiles only).
export function ProductDetailClient({
  product,
  isWishlisted = false,
}: {
  product: ProductWithRelations;
  isWishlisted?: boolean;
}) {
  const publishedVariants = product.variants.filter((v) => v.is_published);
  const [variantId, setVariantId] = useState<string | null>(
    publishedVariants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [playerId, setPlayerId] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedVariant = publishedVariants.find((v) => v.id === variantId);
  const price = product.has_variants ? selectedVariant?.price : product.base_price;
  const compareAt = product.has_variants
    ? selectedVariant?.compare_at_price
    : product.compare_at_price;
  const hasDiscount = price != null && compareAt != null && compareAt > price;
  const canAddToCart =
    (!product.has_variants || Boolean(variantId)) &&
    (!product.requires_player_id || playerId.trim().length > 0);

  function handleAddToCart() {
    startTransition(async () => {
      const result = await addToCart({
        productId: product.id,
        variantId: product.has_variants ? variantId : null,
        quantity,
        playerIdNote: product.requires_player_id ? playerId.trim() : null,
      });

      if (result.ok) {
        toast.success("Added to cart");
      } else {
        toast.error(result.message ?? "Could not add to cart");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <div>
        {product.game?.name && (
          <p className="text-muted-foreground text-sm">{product.game.name}</p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <WishlistButton
            productId={product.id}
            initialWishlisted={isWishlisted}
            className="shrink-0"
          />
        </div>
        {product.short_description && (
          <p className="text-muted-foreground mt-2 text-sm">{product.short_description}</p>
        )}
      </div>

      {price != null && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-2xl font-semibold">{formatPrice(price)}</p>
          {hasDiscount && compareAt != null && (
            <>
              <p className="text-muted-foreground text-lg line-through">
                {formatPrice(compareAt)}
              </p>
              <span className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-xs font-semibold">
                -{Math.round(((compareAt - price) / compareAt) * 100)}%
              </span>
            </>
          )}
        </div>
      )}

      {product.has_variants && (
        <div>
          <Label className="mb-2">Select a package</Label>
          <VariantSelector
            variants={publishedVariants}
            selectedId={variantId}
            onSelect={setVariantId}
          />
        </div>
      )}

      {product.requires_player_id && (
        <div>
          <Label htmlFor="player-id" className="mb-2">
            Player ID / UID
          </Label>
          <Input
            id="player-id"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="Enter your in-game Player ID"
          />
          {product.delivery_instructions && (
            <p className="text-muted-foreground mt-1.5 text-xs">
              {product.delivery_instructions}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Label className="shrink-0">Quantity</Label>
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        disabled={!canAddToCart || isPending}
        onClick={handleAddToCart}
      >
        <ShoppingCart />
        {isPending ? "Adding…" : "Add to Cart"}
      </Button>

      {product.description && (
        <div className="prose prose-sm border-t pt-5">
          <p className="text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
