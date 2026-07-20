import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/components/catalog/ProductCard";
import { getOrdersForCurrentUser } from "@/lib/supabase/queries/orders";

export const metadata: Metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon={<Package className="size-8" />} message="You haven't placed any orders yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="flex-row items-center justify-between p-4 transition-colors hover:border-primary/50">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString()} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
