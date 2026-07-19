"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/components/catalog/ProductCard";
import { removeCartItem, updateCartItemQuantity } from "@/lib/actions/cart";
import type { CartItemWithProduct } from "@/lib/types/commerce";

export function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const [isPending, startTransition] = useTransition();
  const price = item.variant?.price ?? item.product.base_price ?? 0;

  function changeQuantity(delta: number) {
    const next = item.quantity + delta;
    if (next < 1) return;
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, next);
      if (!result.ok) toast.error(result.message ?? "Could not update quantity");
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (!result.ok) toast.error(result.message ?? "Could not remove item");
    });
  }

  return (
    <div className="flex items-center gap-4 border-b py-4 last:border-b-0">
      <Link href={`/products/${item.product.slug}`} className="shrink-0">
        <div className="bg-muted relative size-16 overflow-hidden rounded-lg">
          {item.product.thumbnail_url && (
            <Image
              src={item.product.thumbnail_url}
              alt={item.product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.product.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
          {item.product.name}
        </Link>
        {item.variant && (
          <p className="text-muted-foreground text-xs">{item.variant.name}</p>
        )}
        {item.player_id_note && (
          <p className="text-muted-foreground text-xs">Player ID: {item.player_id_note}</p>
        )}
        <p className="mt-1 text-sm font-semibold">{formatPrice(price)}</p>
      </div>

      <div className="flex items-center rounded-md border">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => changeQuantity(-1)}
        >
          <Minus />
        </Button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => changeQuantity(1)}
        >
          <Plus />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <X />
      </Button>
    </div>
  );
}
