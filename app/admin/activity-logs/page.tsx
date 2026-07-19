import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Activity Logs | Admin" };

export default async function AdminActivityLogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const logs = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Activity Logs</h1>

      {logs.length === 0 ? (
        <EmptyState message="No activity yet." />
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map((log) => (
            <Card key={log.id} className="flex-row items-center justify-between p-3 text-sm">
              <div>
                <span className="font-medium">{log.actor?.full_name ?? "System"}</span>{" "}
                <span className="text-muted-foreground">{log.action.replace(/[._]/g, " ")}</span>{" "}
                <span className="text-muted-foreground">
                  ({log.entity_type}
                  {log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ""})
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
