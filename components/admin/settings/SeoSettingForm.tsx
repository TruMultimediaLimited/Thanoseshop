"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSeoSetting } from "@/lib/actions/admin/settings";
import type { SeoSettings } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

export function SeoSettingForm({ pageKey, setting }: { pageKey: string; setting: SeoSettings | null }) {
  const [state, formAction, pending] = useActionState(upsertSeoSetting, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="pageKey" value={pageKey} />
      <div>
        <Label className="mb-1 text-xs">Meta Title</Label>
        <Input name="metaTitle" defaultValue={setting?.meta_title ?? ""} />
      </div>
      <div>
        <Label className="mb-1 text-xs">Meta Description</Label>
        <Textarea name="metaDescription" rows={2} defaultValue={setting?.meta_description ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1 text-xs">OG Image URL</Label>
          <Input name="ogImageUrl" defaultValue={setting?.og_image_url ?? ""} />
        </div>
        <div>
          <Label className="mb-1 text-xs">Canonical URL</Label>
          <Input name="canonicalUrl" defaultValue={setting?.canonical_url ?? ""} />
        </div>
      </div>
      {state.message && (
        <p className={state.ok ? "text-xs text-emerald-400" : "text-destructive text-xs"}>{state.message}</p>
      )}
      <Button type="submit" size="sm" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
