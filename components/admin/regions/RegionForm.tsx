"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Region } from "@/lib/types/catalog";

const initialState = { ok: false, message: "" };

export function RegionForm({
  region,
  action,
}: {
  region?: Region;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isActive, setIsActive] = useState(region?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" name="name" defaultValue={region?.name} placeholder="Bangladesh" required />
      </div>

      <div>
        <Label htmlFor="code" className="mb-2">
          Code
        </Label>
        <Input id="code" name="code" defaultValue={region?.code} placeholder="BD" required />
      </div>

      <div>
        <Label htmlFor="flagIconUrl" className="mb-2">
          Flag Icon URL
        </Label>
        <Input id="flagIconUrl" name="flagIconUrl" defaultValue={region?.flag_icon_url ?? ""} />
      </div>

      <div>
        <Label htmlFor="sortOrder" className="mb-2">
          Sort Order
        </Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={region?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Region"}
      </Button>
    </form>
  );
}
