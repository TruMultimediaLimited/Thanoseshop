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
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/types/catalog";

const initialState = { ok: false, message: "" };

export function CategoryForm({
  category,
  categories,
  action,
}: {
  category?: Category;
  categories: Category[];
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState<string | null>(category?.image_url ?? null);
  const [isPublished, setIsPublished] = useState(category?.is_published ?? true);
  const [parentId, setParentId] = useState(category?.parent_id ?? "");

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </div>

      <div>
        <Label htmlFor="slug" className="mb-2">
          Slug
        </Label>
        <Input id="slug" name="slug" defaultValue={category?.slug} required />
      </div>

      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
        <Textarea id="description" name="description" defaultValue={category?.description ?? ""} />
      </div>

      <div>
        <Label className="mb-2">Parent Category</Label>
        <input type="hidden" name="parentId" value={parentId} />
        <Select value={parentId || "none"} onValueChange={(v) => setParentId(v === "none" ? "" : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (top-level)</SelectItem>
            {categories
              .filter((c) => c.id !== category?.id)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Image</Label>
        <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="categories" />
      </div>

      <div>
        <Label htmlFor="sortOrder" className="mb-2">
          Sort Order
        </Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={category?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Category"}
      </Button>
    </form>
  );
}
