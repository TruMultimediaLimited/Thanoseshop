import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { AdminOrdersList, type AdminOrderRow } from "@/components/admin/orders/AdminOrdersList";
import { getAdminOrders } from "@/lib/supabase/queries/admin/orders";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types/commerce";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders | Admin" };

// Toggleable: tapping the active one clears it back to "all statuses".
const STATUS_FILTERS: { label: string; value: OrderStatus }[] = [
  { label: ORDER_STATUS_LABEL.completed, value: "completed" },
  { label: ORDER_STATUS_LABEL.cancelled, value: "cancelled" },
];

// Delivery differs per product type, so the list is split accordingly:
// top-ups (need in-game delivery) vs gift cards/codes.
const TYPE_FILTERS = [
  { label: "Game Top-Up", value: "topup" },
  { label: "Gift Cards", value: "giftcard" },
] as const;

type OrderTypeFilter = (typeof TYPE_FILTERS)[number]["value"];

function orderType(order: AdminOrderRow): Exclude<OrderTypeFilter, "all"> {
  return order.items.some((item) => item.product?.product_type === "topup")
    ? "topup"
    : "giftcard";
}

function filterHref(status: string | undefined, type: OrderTypeFilter) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("type", type);
  return `/admin/orders?${params.toString()}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status, type } = await searchParams;
  const activeStatus = (status as OrderStatus | undefined) ?? undefined;
  const activeType: OrderTypeFilter = type === "giftcard" ? "giftcard" : "topup";

  const orders = (await getAdminOrders(activeStatus)) as unknown as AdminOrderRow[];
  const visible = orders.filter((o) => orderType(o) === activeType);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Order List</h1>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={filterHref(activeStatus, filter.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium",
                filter.value === activeType
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-secondary",
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={filterHref(
                filter.value === activeStatus ? undefined : filter.value,
                activeType,
              )}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                filter.value === activeStatus
                  ? "bg-secondary border-primary/50 font-medium"
                  : "hover:bg-secondary",
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No orders found." />
      ) : (
        <AdminOrdersList orders={visible} />
      )}
    </div>
  );
}
