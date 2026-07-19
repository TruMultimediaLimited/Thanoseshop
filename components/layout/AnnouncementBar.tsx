import Link from "next/link";

import { getActiveAnnouncements } from "@/lib/supabase/queries/announcements";

export async function AnnouncementBar() {
  const announcements = await getActiveAnnouncements();
  const announcement = announcements[0];
  if (!announcement) return null;

  const content = (
    <p className="truncate">
      {announcement.message}
      {announcement.link_url && <span className="ml-1 underline underline-offset-2">→</span>}
    </p>
  );

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium">
      {announcement.link_url ? (
        <Link href={announcement.link_url} className="hover:opacity-90">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
