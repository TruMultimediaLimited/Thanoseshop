import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <header className="border-border bg-card border-b shadow-sm shadow-black/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4">
        {/* The flame emblem was drawn for a black field — the dark pill keeps
            it crisp on the light theme. */}
        <Link
          href="/"
          aria-label={siteName}
          className="rounded-lg bg-[#0d0d0f] px-4 py-1.5"
        >
          <Image
            src={settings?.logo_url ?? "/logo.png"}
            alt={siteName}
            width={50}
            height={46}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
