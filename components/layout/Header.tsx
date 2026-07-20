import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

// The header IS the cover image — logo + banner in one, per the owner.
// Full-bleed, uncropped: height follows the image's aspect ratio.
export async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <header className="border-b border-white/10 bg-[#161a28]">
      <Link href="/" aria-label={siteName} className="block">
        <Image
          src="/cover.webp"
          alt={siteName}
          width={2112}
          height={585}
          sizes="100vw"
          className="h-auto w-full"
          priority
        />
      </Link>
    </header>
  );
}
