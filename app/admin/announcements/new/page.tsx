import type { Metadata } from "next";

import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import { createAnnouncement } from "@/lib/actions/admin/announcements";

export const metadata: Metadata = { title: "New Announcement | Admin" };

export default function NewAnnouncementPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Announcement</h1>
      <AnnouncementForm action={createAnnouncement} />
    </div>
  );
}
