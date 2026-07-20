import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: `Contact Us | ${settings?.site_name ?? "Thanos E-Shop"}` };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Have a question about an order or a game we don&apos;t carry yet? Reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {settings?.contact_email && (
          <Card className="items-center gap-2 p-5 text-center">
            <Mail className="text-primary size-5" />
            <p className="text-sm font-medium">Email</p>
            <a href={`mailto:${settings.contact_email}`} className="text-muted-foreground text-sm hover:underline">
              {settings.contact_email}
            </a>
          </Card>
        )}
        {settings?.contact_phone && (
          <Card className="items-center gap-2 p-5 text-center">
            <Phone className="text-primary size-5" />
            <p className="text-sm font-medium">Phone</p>
            <a href={`tel:${settings.contact_phone}`} className="text-muted-foreground text-sm hover:underline">
              {settings.contact_phone}
            </a>
          </Card>
        )}
        {settings?.whatsapp_number && (
          <Card className="items-center gap-2 p-5 text-center">
            <MessageCircle className="text-primary size-5" />
            <p className="text-sm font-medium">WhatsApp</p>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground text-sm hover:underline"
            >
              {settings.whatsapp_number}
            </a>
          </Card>
        )}
      </div>

      {!settings?.contact_email && !settings?.contact_phone && !settings?.whatsapp_number && (
        <p className="text-muted-foreground text-sm">
          Contact details haven&apos;t been added yet — an admin can set these under Website
          Settings.
        </p>
      )}
    </div>
  );
}
