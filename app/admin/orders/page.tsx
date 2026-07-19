import type { Metadata } from "next";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/components/catalog/ProductCard";
import { getAdminOrders } from "@/lib/supabase/queries/admin/orders";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types/commerce";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders | Admin" };

const FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: ORDER_STATUS_LABEL.payment_review, value: "payment_review" },
  { label: ORDER_STATUS_LABEL.paid, value: "paid" },
  { label: ORDER_STATUS_LABEL.processing, value: "processing" },
  { label: ORDER_STATUS_LABEL.completed, value: "completed" },
  { label: ORDER_STATUS_LABEL.cancelled, value: "cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatus | undefined) ?? undefined;

  const orders = await getAdminOrders(activeStatus);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/admin/orders" : `/admin/orders?status=${filter.value}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              (filter.value === "all" && !activeStatus) || filter.value === activeStatus
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-secondary",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState message="No orders found." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>{order.customer?.full_name ?? "—"}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
