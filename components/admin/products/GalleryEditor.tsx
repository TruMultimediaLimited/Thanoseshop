"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

/**
 * Multi-image gallery editor backed by products.gallery (jsonb string[]).
 * The uploader slot always shows empty; each successful upload appends to
 * the list, and existing images render as thumbnails with a remove button.
 */
export function GalleryEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="bg-muted relative aspect-video w-40 overflow-hidden rounded-lg border"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-1 right-1 size-7"
                aria-label="Remove image"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ImageUploader
        value={null}
        onChange={(url) => {
          if (url) onChange([...images, url]);
        }}
        folder="products/gallery"
      />
    </div>
  );
}
