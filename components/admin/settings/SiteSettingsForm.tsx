"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "@/lib/actions/admin/settings";
import type { SiteSettings } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label htmlFor="siteName" className="mb-2">
          Site Name
        </Label>
        <Input id="siteName" name="siteName" defaultValue={settings?.site_name ?? ""} required />
      </div>
      <div>
        <Label htmlFor="logoUrl" className="mb-2">
          Logo URL
        </Label>
        <Input id="logoUrl" name="logoUrl" defaultValue={settings?.logo_url ?? ""} />
      </div>
      <div>
        <Label htmlFor="faviconUrl" className="mb-2">
          Favicon URL
        </Label>
        <Input id="faviconUrl" name="faviconUrl" defaultValue={settings?.favicon_url ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail" className="mb-2">
            Contact Email
          </Label>
          <Input id="contactEmail" name="contactEmail" defaultValue={settings?.contact_email ?? ""} />
        </div>
        <div>
          <Label htmlFor="contactPhone" className="mb-2">
            Contact Phone
          </Label>
          <Input id="contactPhone" name="contactPhone" defaultValue={settings?.contact_phone ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="whatsappNumber" className="mb-2">
            WhatsApp Number
          </Label>
          <Input id="whatsappNumber" name="whatsappNumber" defaultValue={settings?.whatsapp_number ?? ""} />
        </div>
        <div>
          <Label htmlFor="facebookUrl" className="mb-2">
            Facebook URL
          </Label>
          <Input id="facebookUrl" name="facebookUrl" defaultValue={settings?.facebook_url ?? ""} />
        </div>
      </div>
      <div>
        <Label htmlFor="footerText" className="mb-2">
          Footer Text
        </Label>
        <Textarea id="footerText" name="footerText" defaultValue={settings?.footer_text ?? ""} />
      </div>
      <div>
        <Label htmlFor="defaultMetaTitle" className="mb-2">
          Default Meta Title
        </Label>
        <Input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={settings?.default_meta_title ?? ""} />
      </div>
      <div>
        <Label htmlFor="defaultMetaDescription" className="mb-2">
          Default Meta Description
        </Label>
        <Textarea
          id="defaultMetaDescription"
          name="defaultMetaDescription"
          defaultValue={settings?.default_meta_description ?? ""}
        />
      </div>

      {state.message && (
        <p className={state.ok ? "text-sm text-emerald-400" : "text-destructive text-sm"}>{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
