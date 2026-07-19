import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types/commerce";

export interface DailyPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

/** Statuses whose money is (or will be) collected — pending/cancelled excluded. */
const REVENUE_STATUSES = new Set(["paid", "processing", "completed"]);

export async function getDashboardAnalytics() {
  const supabase = await createClient();

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 29);

  const [{ data: orders, error }, customers] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
  ]);
  if (error) throw error;

  const days: DailyPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const day = new Date(since);
    day.setDate(since.getDate() + i);
    days.push({
      date: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      revenue: 0,
      orders: 0,
    });
  }
  const byDate = new Map(days.map((point) => [point.date, point]));

  let totalRevenue = 0;
  for (const order of orders ?? []) {
    const bucket = byDate.get(order.created_at.slice(0, 10));
    const counted = REVENUE_STATUSES.has(order.status);
    if (bucket) {
      bucket.orders += 1;
      if (counted) bucket.revenue += Number(order.total);
    }
    if (counted) totalRevenue += Number(order.total);
  }

  return {
    days,
    totalRevenue,
    totalOrders: (orders ?? []).length,
    customerCount: customers.count ?? 0,
    recentOrders: ((orders ?? []) as Pick<Order, "id" | "order_number" | "status" | "total" | "created_at">[]).slice(0, 8),
  };
}
