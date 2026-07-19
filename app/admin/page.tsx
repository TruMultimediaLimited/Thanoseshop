import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Package, ShoppingCart, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard | Admin" };

async function getKpis() {
  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pendingReview, todaysOrders, lowStock, pendingReviews] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "payment_review"),
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
    supabase.from("product_variants").select("id", { count: "exact", head: true }).not("stock_quantity", "is", null).lte("stock_quantity", 5),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    pendingReview: pendingReview.count ?? 0,
    todaysOrders: todaysOrders.count ?? 0,
    lowStock: lowStock.count ?? 0,
    pendingReviews: pendingReviews.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const kpis = await getKpis();

  const cards = [
    {
      label: "Payments to Review",
      value: kpis.pendingReview,
      icon: AlertCircle,
      href: "/admin/orders?status=payment_review",
    },
    { label: "Orders Today", value: kpis.todaysOrders, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Low Stock Variants", value: kpis.lowStock, icon: Package, href: "/admin/products" },
    { label: "Reviews to Moderate", value: kpis.pendingReviews, icon: Star, href: "/admin/reviews" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="gap-2 p-5 transition-colors hover:border-primary/50">
              <card.icon className="text-primary size-5" />
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-muted-foreground text-sm">{card.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
