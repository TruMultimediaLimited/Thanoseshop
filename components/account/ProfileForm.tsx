"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/profile";

const initialState = { ok: false, message: "" };

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string | null;
  phone: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input id="email" value={email} disabled />
      </div>

      <div>
        <Label htmlFor="fullName" className="mb-2">
          Full Name
        </Label>
        <Input id="fullName" name="fullName" defaultValue={fullName ?? ""} required />
      </div>

      <div>
        <Label htmlFor="phone" className="mb-2">
          Phone
        </Label>
        <Input id="phone" name="phone" defaultValue={phone ?? ""} />
      </div>

      {state.message && (
        <p className={state.ok ? "text-sm text-emerald-400" : "text-destructive text-sm"}>
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
