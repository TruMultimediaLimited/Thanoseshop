import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Banknote, Package, ShoppingCart, Star, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DashboardCharts } from "@/components/admin/analytics/DashboardCharts";
import { formatPrice } from "@/components/catalog/ProductCard";
import { getDashboardAnalytics } from "@/lib/supabase/queries/admin/analytics";
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
  const [kpis, analytics] = await Promise.all([getKpis(), getDashboardAnalytics()]);

  const cards = [
    {
      label: "Revenue (30 days)",
      value: formatPrice(analytics.totalRevenue),
      icon: Banknote,
      href: "/admin/orders",
    },
    {
      label: "Payments to Review",
      value: kpis.pendingReview,
      icon: AlertCircle,
      href: "/admin/orders?status=payment_review",
    },
    { label: "Orders Today", value: kpis.todaysOrders, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Customers", value: analytics.customerCount, icon: Users, href: "/admin/users" },
    { label: "Low Stock Variants", value: kpis.lowStock, icon: Package, href: "/admin/products" },
    { label: "Reviews to Moderate", value: kpis.pendingReviews, icon: Star, href: "/admin/reviews" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <DashboardCharts days={analytics.days} />

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-sm font-medium">Recent Orders</p>
          <Link href="/admin/orders" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>
        {analytics.recentOrders.length === 0 ? (
          <p className="text-muted-foreground border-t px-5 py-6 text-sm">
            No orders in the last 30 days.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="pl-5 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">
                      {order.order_number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">{formatPrice(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
