import Image from "next/image";
import Link from "next/link";

import { SearchButton } from "@/components/layout/SearchButton";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

const BOX_BTN =
  "border-border bg-card hover:border-primary hover:text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors";

export async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <header className="border-border bg-card border-b shadow-sm shadow-black/5">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <SearchButton className={BOX_BTN} />

        <Link href="/" aria-label={siteName} className="absolute left-1/2 -translate-x-1/2">
          <Image
            src={settings?.logo_url ?? "/logo.png"}
            alt={siteName}
            width={62}
            height={57}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
