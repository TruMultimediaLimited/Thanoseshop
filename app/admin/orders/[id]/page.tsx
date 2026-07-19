import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatPrice } from "@/components/catalog/ProductCard";
import { OrderActions } from "@/components/admin/orders/OrderActions";
import { DeliverItemForm } from "@/components/admin/orders/DeliverItemForm";
import { getAdminOrderById, getSignedScreenshotUrl } from "@/lib/supabase/queries/admin/orders";
import type { OrderItem } from "@/lib/types/commerce";

export const metadata: Metadata = { title: "Order Detail | Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const submission = order.payment_submission?.[0] ?? order.payment_submission ?? null;
  const screenshotUrl = submission?.screenshot_path
    ? await getSignedScreenshotUrl(submission.screenshot_path)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.order_number}</h1>
          <p className="text-muted-foreground text-sm">
            {new Date(order.created_at).toLocaleString()} · {order.customer?.full_name ?? "Unknown customer"}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <OrderActions orderId={order.id} status={order.status} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="gap-0 divide-y p-0">
            {(order.items as OrderItem[]).map((item) => (
              <div key={item.id} className="flex flex-col gap-1 p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {item.product_name_snapshot}
                    {item.variant_name_snapshot ? ` — ${item.variant_name_snapshot}` : ""}
                  </span>
                  <span>{formatPrice(item.line_total)}</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {item.quantity} × {formatPrice(item.unit_price)}
                  {item.player_id_note ? ` · Player ID: ${item.player_id_note}` : ""}
                  {item.region_name_snapshot ? ` · Region: ${item.region_name_snapshot}` : ""}
                </p>

                {(order.status === "paid" || order.status === "processing" || order.status === "completed") && (
                  <DeliverItemForm
                    orderItemId={item.id}
                    orderId={order.id}
                    existingPayload={item.delivered_payload}
                  />
                )}
              </div>
            ))}
          </Card>

          {order.customer_note && (
            <Card className="p-4 text-sm">
              <p className="text-muted-foreground text-xs font-medium uppercase">Customer Note</p>
              <p className="mt-1">{order.customer_note}</p>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="gap-2 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </Card>

          {submission && (
            <Card className="gap-3 p-4 text-sm">
              <p className="font-medium">Payment Proof</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{order.payment_method?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{submission.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Claimed</span>
                <span>{submission.amount_claimed ? formatPrice(submission.amount_claimed) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{submission.status}</Badge>
              </div>
              {submission.rejection_reason && (
                <p className="text-destructive text-xs">{submission.rejection_reason}</p>
              )}
              {screenshotUrl && (
                <div className="bg-muted relative mt-1 aspect-video w-full overflow-hidden rounded-md">
                  <Image src={screenshotUrl} alt="Payment screenshot" fill className="object-contain" unoptimized />
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
