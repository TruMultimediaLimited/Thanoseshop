import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getActivePaymentMethods } from "@/lib/supabase/queries/payments";
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
  const [settings, paymentMethods] = await Promise.all([
    getSiteSettings(),
    getActivePaymentMethods(),
  ]);
  const siteName = settings?.site_name ?? "Thanos E-Shop";
  const year = new Date().getFullYear();
  const whatsappDigits = settings?.whatsapp_number?.replace(/\D/g, "");

  return (
    <footer className="border-border/60 bg-card/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src={settings?.logo_url ?? "/logo.png"}
                alt={siteName}
                width={35}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <p className="text-lg font-semibold tracking-tight">{siteName}</p>
            </div>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm">
              {settings?.footer_text ??
                "Premium game top-ups, gift cards, and digital products for Bangladeshi gamers."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
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

        {paymentMethods.length > 0 && (
          <div className="border-border/60 mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-muted-foreground mr-1 text-sm">We accept:</span>
            {paymentMethods.map((method) => (
              <Badge key={method.id} variant="secondary">
                {method.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="border-border/60 mt-6 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
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
