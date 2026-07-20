import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Notifications | Admin" };

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .is("user_id", null)
    .order("created_at", { ascending: false })
    .limit(100);

  const notifications = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>

      {notifications.length === 0 ? (
        <EmptyState message="No notifications yet." />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <Card key={notification.id} className="flex-row items-center justify-between p-4">
              <div>
                <p className="font-medium">{notification.title}</p>
                {notification.message && (
                  <p className="text-muted-foreground text-sm">{notification.message}</p>
                )}
                <p className="text-muted-foreground mt-1 text-xs">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.is_read && <Badge variant="accent">New</Badge>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
