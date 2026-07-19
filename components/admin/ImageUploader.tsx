"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toWebp } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    try {
      const file = await toWebp(rawFile);
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("public-assets")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
      onChange(data.publicUrl);

      await supabase.from("media").insert({
        file_url: data.publicUrl,
        file_type: file.type,
        file_name: file.name,
        file_size: file.size,
        folder,
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (value) {
    return (
      <div className="bg-muted relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
        <Image src={value} alt="" fill className="object-cover" unoptimized />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => onChange(null)}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <label className="hover:border-primary/50 flex w-full max-w-xs cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
      <Upload className="text-muted-foreground size-6" />
      <span className="text-muted-foreground text-sm">
        {isUploading ? "Uploading…" : "Click to upload an image"}
      </span>
      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
    </label>
  );
}
