import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/catalog/ProductCard";
import { computeCartTotal, getCurrentUserCartItems } from "@/lib/supabase/queries/cart";
import { getActivePaymentMethods } from "@/lib/supabase/queries/payments";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  const [items, paymentMethods] = await Promise.all([
    getCurrentUserCartItems(),
    getActivePaymentMethods(),
  ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  const total = computeCartTotal(items);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          {paymentMethods.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No payment methods are configured yet. Please contact support.
            </p>
          ) : (
            <CheckoutForm paymentMethods={paymentMethods} total={total} />
          )}
        </Card>

        <Card className="h-fit gap-3 p-6">
          <p className="text-sm font-medium">Order Summary</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground line-clamp-1">
                {item.product.name}
                {item.variant ? ` — ${item.variant.name}` : ""} × {item.quantity}
              </span>
              <span>
                {formatPrice((item.variant?.price ?? item.product.base_price ?? 0) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 text-sm font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
