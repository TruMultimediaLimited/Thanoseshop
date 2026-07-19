import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { CartItemRow } from "@/components/checkout/CartItemRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/components/catalog/ProductCard";
import { computeCartTotal, getCurrentUserCartItems } from "@/lib/supabase/queries/cart";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/cart");
  }

  const items = await getCurrentUserCartItems();
  const total = computeCartTotal(items);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-8" />}
          message="Your cart is empty."
          action={
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="px-6">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </Card>

          <Card className="h-fit gap-4 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Coupons and final total are calculated at checkout.
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
