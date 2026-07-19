import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteAnnouncement } from "@/lib/actions/admin/announcements";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Announcements | Admin" };

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("sort_order", { ascending: true });

  const announcements = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Announcements"
        newHref="/admin/announcements/new"
        newLabel="New Announcement"
      />

      {announcements.length === 0 ? (
        <EmptyState message="No announcements yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="max-w-md truncate font-medium">{announcement.message}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {announcement.starts_at ? new Date(announcement.starts_at).toLocaleDateString() : "—"}
                  {" → "}
                  {announcement.ends_at ? new Date(announcement.ends_at).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={announcement.is_active ? "default" : "secondary"}>
                    {announcement.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton
                    action={deleteAnnouncement.bind(null, announcement.id)}
                    label="announcement"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
