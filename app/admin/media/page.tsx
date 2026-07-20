import type { Metadata } from "next";
import Image from "next/image";

import { EmptyState } from "@/components/common/EmptyState";
import { MediaUploadCard } from "@/components/admin/media/MediaUploadCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media Library | Admin" };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const media = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>

      <MediaUploadCard />

      {media.length === 0 ? (
        <EmptyState message="No uploads yet." />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {media.map((item) => (
            <a
              key={item.id}
              href={item.file_url}
              target="_blank"
              rel="noreferrer"
              className="bg-muted relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image src={item.file_url} alt={item.file_name} fill className="object-cover" unoptimized />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
