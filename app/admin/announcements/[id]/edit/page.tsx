import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import { updateAnnouncement } from "@/lib/actions/admin/announcements";
import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/lib/types/content";

export const metadata: Metadata = { title: "Edit Announcement | Admin" };

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!announcement) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Announcement</h1>
      <AnnouncementForm
        announcement={announcement as Announcement}
        action={updateAnnouncement.bind(null, id)}
      />
    </div>
  );
}
