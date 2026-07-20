import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/catalog/ProductCard";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/account/orders/${id}`);

  const order = await getOrderById(id);
  if (!order || order.user_id !== user.id) notFound();

  const hasGiftCard = order.items.some(
    (item) =>
      item.product?.product_type === "giftcard" ||
      item.product?.product_type === "subscription",
  );
  const settings = hasGiftCard ? await getSiteSettings() : null;
  const whatsappDigits =
    (settings?.whatsapp_number ?? "+8801833534123").replace(/\D/g, "");
  const showGiftCardNotice =
    hasGiftCard && order.status !== "completed" && order.status !== "cancelled";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.order_number}</h1>
          <p className="text-muted-foreground text-sm">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {showGiftCardNotice && (
        <Card className="border-primary/40 gap-2 p-4">
          <p className="text-sm font-semibold">
            Gift card orders: message us on WhatsApp
          </p>
          <p className="text-muted-foreground text-sm">
            After placing a gift card order, you must message us on WhatsApp with
            your order number so we can confirm and deliver it. If you don&apos;t
            use WhatsApp, message us on Facebook instead.
          </p>
          <a
            href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
              `Order ${order.order_number}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Message on WhatsApp
          </a>
        </Card>
      )}

      <Card className="gap-0 divide-y p-0">
        {order.items.map((item) => (
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
            </p>

            {order.status === "completed" && item.delivered_payload && (
              <div className="bg-muted mt-2 rounded-md p-3 text-sm">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Delivered
                </p>
                <p className="whitespace-pre-line">{item.delivered_payload}</p>
              </div>
            )}
          </div>
        ))}
      </Card>

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
        {order.payment_method && (
          <p className="text-muted-foreground pt-2 text-xs">
            Paid via {order.payment_method.name}
          </p>
        )}
      </Card>

      {order.status === "payment_review" && (
        <p className="text-muted-foreground text-sm">
          We&apos;re verifying your payment. This usually takes a few minutes.
        </p>
      )}
    </div>
  );
}
