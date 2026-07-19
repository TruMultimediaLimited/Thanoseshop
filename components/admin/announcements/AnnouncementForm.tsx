"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

function toLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function AnnouncementForm({
  announcement,
  action,
}: {
  announcement?: Announcement;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isActive, setIsActive] = useState(announcement?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <div>
        <Label htmlFor="message" className="mb-2">
          Message
        </Label>
        <Textarea id="message" name="message" rows={2} defaultValue={announcement?.message ?? ""} required />
      </div>
      <div>
        <Label htmlFor="linkUrl" className="mb-2">
          Link URL (optional)
        </Label>
        <Input id="linkUrl" name="linkUrl" defaultValue={announcement?.link_url ?? ""} placeholder="/products" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startsAt" className="mb-2">
            Starts At (optional)
          </Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toLocalInput(announcement?.starts_at ?? null)}
          />
        </div>
        <div>
          <Label htmlFor="endsAt" className="mb-2">
            Ends At (optional)
          </Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toLocalInput(announcement?.ends_at ?? null)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
          <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={announcement?.sort_order ?? 0}
            className="w-24"
          />
        </div>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Announcement"}
      </Button>
    </form>
  );
}
