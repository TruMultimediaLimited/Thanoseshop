"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AdvancedSection } from "@/components/admin/AdvancedSection";
import type { StaticPage } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

export function StaticPageForm({
  page,
  action,
}: {
  page?: StaticPage;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isPublished, setIsPublished] = useState(page?.is_published ?? true);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <div>
        <Label htmlFor="title" className="mb-2">
          Title
        </Label>
        <Input id="title" name="title" defaultValue={page?.title ?? ""} required />
      </div>
      <div>
        <Label htmlFor="slug" className="mb-2">
          Slug (page will live at /pages/slug)
        </Label>
        <Input id="slug" name="slug" defaultValue={page?.slug ?? ""} required placeholder="how-to-top-up" />
      </div>
      <div>
        <Label htmlFor="content" className="mb-2">
          Content
        </Label>
        <Textarea id="content" name="content" rows={12} defaultValue={page?.content ?? ""} required />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <AdvancedSection title="SEO settings">
        <div>
          <Label htmlFor="metaTitle" className="mb-2">
            Meta Title
          </Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={page?.meta_title ?? ""} />
        </div>
        <div>
          <Label htmlFor="metaDescription" className="mb-2">
            Meta Description
          </Label>
          <Textarea id="metaDescription" name="metaDescription" defaultValue={page?.meta_description ?? ""} />
        </div>
      </AdvancedSection>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Page"}
      </Button>
    </form>
  );
}
