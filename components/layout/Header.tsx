import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  // Dark navy bar (matches the page): the flame emblem was drawn on black —
  // its interior blacks are transparent and read as navy here.
  return (
    <header className="border-b border-white/10 bg-[#161a28]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={siteName} className="flex items-center">
          <Image
            src={settings?.logo_url ?? "/logo.png"}
            alt={siteName}
            width={52}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
