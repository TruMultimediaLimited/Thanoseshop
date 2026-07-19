"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdvancedSection } from "@/components/admin/AdvancedSection";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category, Game } from "@/lib/types/catalog";

const initialState = { ok: false, message: "" };

export function GameForm({
  game,
  categories,
  action,
}: {
  game?: Game;
  categories: Category[];
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [logoUrl, setLogoUrl] = useState<string | null>(game?.logo_url ?? null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(game?.banner_url ?? null);
  const [categoryId, setCategoryId] = useState(game?.category_id ?? "");
  const [isPublished, setIsPublished] = useState(game?.is_published ?? true);
  const [isTrending, setIsTrending] = useState(game?.is_trending ?? false);
  const [isPopular, setIsPopular] = useState(game?.is_popular ?? false);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" name="name" defaultValue={game?.name} required />
      </div>
      <div>
        <Label htmlFor="slug" className="mb-2">
          Slug
        </Label>
        <Input id="slug" name="slug" defaultValue={game?.slug} required />
      </div>
      <div>
        <Label className="mb-2">Category</Label>
        <input type="hidden" name="categoryId" value={categoryId} />
        <Select value={categoryId || "none"} onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Logo</Label>
        <input type="hidden" name="logoUrl" value={logoUrl ?? ""} />
        <ImageUploader value={logoUrl} onChange={setLogoUrl} folder="games/logos" />
      </div>
      <div>
        <Label className="mb-2">Banner (used as the card art on the homepage)</Label>
        <input type="hidden" name="bannerUrl" value={bannerUrl ?? ""} />
        <ImageUploader value={bannerUrl} onChange={setBannerUrl} folder="games/banners" />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <AdvancedSection>
        <div>
          <Label htmlFor="publisher" className="mb-2">
            Publisher
          </Label>
          <Input id="publisher" name="publisher" defaultValue={game?.publisher ?? ""} />
        </div>
        <div>
          <Label htmlFor="description" className="mb-2">
            Description
          </Label>
          <Textarea id="description" name="description" defaultValue={game?.description ?? ""} />
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input type="hidden" name="isTrending" value={isTrending ? "on" : ""} />
            <Switch checked={isTrending} onCheckedChange={setIsTrending} id="isTrending" />
            <Label htmlFor="isTrending">Trending</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="hidden" name="isPopular" value={isPopular ? "on" : ""} />
            <Switch checked={isPopular} onCheckedChange={setIsPopular} id="isPopular" />
            <Label htmlFor="isPopular">Popular</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="metaTitle" className="mb-2">
            Meta Title
          </Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={game?.meta_title ?? ""} />
        </div>
        <div>
          <Label htmlFor="metaDescription" className="mb-2">
            Meta Description
          </Label>
          <Textarea id="metaDescription" name="metaDescription" defaultValue={game?.meta_description ?? ""} />
        </div>
      </AdvancedSection>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Game"}
      </Button>
    </form>
  );
}
