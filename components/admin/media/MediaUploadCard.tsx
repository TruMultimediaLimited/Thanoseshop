"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function MediaUploadCard() {
  const router = useRouter();
  const [value, setValue] = useState<string | null>(null);

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">Upload a new image</p>
      <ImageUploader
        value={value}
        onChange={(url) => {
          setValue(url);
          if (url) {
            router.refresh();
            setTimeout(() => setValue(null), 1500);
          }
        }}
        folder="library"
      />
    </Card>
  );
}
