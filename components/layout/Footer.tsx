import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/supabase/queries/settings";

const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Games", href: "/products?type=topup" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Thanos E-Shop";
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 bg-card/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src={settings?.logo_url ?? "/logo.png"}
                alt={siteName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-cover"
              />
              <p className="text-lg font-semibold tracking-tight">{siteName}</p>
            </div>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm">
              {settings?.footer_text ??
                "Premium game top-ups, gift cards, and digital products for Bangladeshi gamers."}
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border/60 mt-10 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © {year} {siteName}. All rights reserved.
          </p>
          {(settings?.contact_email || settings?.contact_phone) && (
            <p className="text-muted-foreground">
              {settings?.contact_email}
              {settings?.contact_email && settings?.contact_phone ? " · " : ""}
              {settings?.contact_phone}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
