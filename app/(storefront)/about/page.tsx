import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: `About Us | ${settings?.site_name ?? "Thanos E-Shop"}` };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">About {siteName}</h1>
      <div className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          {siteName} is Bangladesh&apos;s premium marketplace for game top-ups, gift cards, and
          digital products. We deliver fast, secure, and trusted top-ups for the games and
          services you love — from mobile battle royales to global streaming and gaming
          platforms.
        </p>
        <p>
          Every order is manually verified before delivery, so you can trust that your payment
          and your purchase are in safe hands. Our support team is on hand to help with any
          question about your order, any time.
        </p>
        <p>
          We&apos;re constantly adding new games, gift cards, and regions — if there&apos;s
          something you&apos;d like to see, get in touch.
        </p>
      </div>
    </div>
  );
}
