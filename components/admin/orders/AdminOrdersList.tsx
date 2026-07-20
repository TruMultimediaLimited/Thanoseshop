"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatPrice } from "@/components/catalog/ProductCard";
import { cancelOrder, markOrderCompleted } from "@/lib/actions/admin/orders";
import type { OrderStatus } from "@/lib/types/commerce";
import { cn } from "@/lib/utils";

export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  customer: { full_name: string | null; phone: string | null } | null;
  payment_method: { name: string } | null;
  payment_submission:
    | { transaction_id: string | null; amount_claimed: number | null }[]
    | { transaction_id: string | null; amount_claimed: number | null }
    | null;
  items: {
    id: string;
    product_name_snapshot: string;
    variant_name_snapshot: string | null;
    quantity: number;
    line_total: number;
    player_id_note: string | null;
    product?: { product_type: string } | null;
  }[];
}

function submissionOf(order: AdminOrderRow) {
  const s = order.payment_submission;
  return Array.isArray(s) ? s[0] ?? null : s;
}

const CLOSED_STATUSES: OrderStatus[] = ["completed", "cancelled", "refunded"];

export function AdminOrdersList({ orders }: { orders: AdminOrderRow[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: (id: string) => Promise<{ ok: boolean; message?: string }>, id: string) {
    startTransition(async () => {
      const result = await action(id);
      if (result.ok) {
        toast.success("Order updated");
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not update the order");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {orders.map((order) => {
        const open = openId === order.id;
        const submission = submissionOf(order);
        const closed = CLOSED_STATUSES.includes(order.status);

        return (
          <Card key={order.id} className="gap-0 p-0">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : order.id)}
              className="flex w-full items-center gap-3 p-3 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{order.order_number}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {order.customer?.full_name ?? "—"} ·{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
              <StatusBadge status={order.status} />
              <ChevronDown
                className={cn("text-muted-foreground size-4 transition-transform", open && "rotate-180")}
              />
            </button>

            {open && (
              <div className="flex flex-col gap-3 border-t p-3 text-sm">
                <div className="flex flex-col gap-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.product_name_snapshot}
                        {item.variant_name_snapshot ? ` — ${item.variant_name_snapshot}` : ""}
                        {" "}× {item.quantity}
                        {item.player_id_note && (
                          <span className="text-muted-foreground block text-xs">
                            Player: {item.player_id_note}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0">{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-muted-foreground grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                  <p>Payment: {order.payment_method?.name ?? "—"}</p>
                  <p>Trx ID: {submission?.transaction_id ?? "—"}</p>
                  {submission?.amount_claimed != null && (
                    <p>Amount claimed: {formatPrice(submission.amount_claimed)}</p>
                  )}
                  {order.customer?.phone && <p>Phone: {order.customer.phone}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    disabled={closed || isPending}
                    onClick={() => run(markOrderCompleted, order.id)}
                  >
                    <Check /> Done
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={closed || isPending}
                    onClick={() => {
                      if (window.confirm(`Cancel order ${order.order_number}?`)) {
                        run(cancelOrder, order.id);
                      }
                    }}
                  >
                    <X /> Cancel
                  </Button>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary ml-auto text-xs font-medium hover:underline"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
