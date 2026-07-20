"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { DailyPoint } from "@/lib/supabase/queries/admin/analytics";

const compactBdt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  notation: "compact",
  maximumFractionDigits: 1,
});
const fullBdt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  fontSize: "0.75rem",
  color: "var(--foreground)",
} as const;

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 11 } as const;

export function DashboardCharts({ days }: { days: DailyPoint[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="gap-3 p-5">
        <p className="text-sm font-medium">Revenue — last 30 days</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(value: number) => compactBdt.format(value)}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [fullBdt.format(Number(value)), "Revenue"]}
                cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="var(--chart-1)"
                fillOpacity={0.12}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="gap-3 p-5">
        <p className="text-sm font-medium">Orders — last 30 days</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barCategoryGap={2}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [String(value), "Orders"]}
                cursor={{ fill: "var(--secondary)" }}
              />
              <Bar dataKey="orders" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
