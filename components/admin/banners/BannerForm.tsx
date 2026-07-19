"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Banner } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

const PLACEMENTS = [
  { value: "hero", label: "Hero (Homepage)" },
  { value: "promo", label: "Promo" },
  { value: "category", label: "Category Page" },
  { value: "gift_card", label: "Gift Card Page" },
];

export function BannerForm({
  banner,
  action,
}: {
  banner?: Banner;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState<string | null>(banner?.image_url ?? null);
  const [placement, setPlacement] = useState(banner?.placement ?? "hero");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label className="mb-2">Image</Label>
        <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="banners" />
        {!imageUrl && state.message === "Upload an image." && (
          <p className="text-destructive mt-1 text-xs">Upload an image.</p>
        )}
      </div>

      <div>
        <Label htmlFor="title" className="mb-2">
          Title
        </Label>
        <Input id="title" name="title" defaultValue={banner?.title ?? ""} />
      </div>

      <div>
        <Label htmlFor="subtitle" className="mb-2">
          Subtitle
        </Label>
        <Input id="subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />
      </div>

      <div>
        <Label htmlFor="linkUrl" className="mb-2">
          Link URL
        </Label>
        <Input id="linkUrl" name="linkUrl" defaultValue={banner?.link_url ?? ""} placeholder="/products" />
      </div>

      <div>
        <Label className="mb-2">Placement</Label>
        <input type="hidden" name="placement" value={placement} />
        <Select value={placement} onValueChange={(v) => setPlacement(v as typeof placement)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLACEMENTS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sortOrder" className="mb-2">
          Sort Order
        </Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={banner?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Banner"}
      </Button>
    </form>
  );
}
