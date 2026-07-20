import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <header className="border-border/60 bg-card/70 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={siteName} className="flex items-center">
          <Image
            src={settings?.logo_url ?? "/logo.png"}
            alt={siteName}
            width={102}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
