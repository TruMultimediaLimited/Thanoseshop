import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCartItemCount } from "@/lib/supabase/queries/cart";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [settings, cartCount] = await Promise.all([getSiteSettings(), getCartItemCount()]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thanoseshop.vercel.app";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings?.site_name ?? "Thanos E-Shop",
          url: baseUrl,
          logo: settings?.logo_url ?? undefined,
          email: settings?.contact_email ?? undefined,
          telephone: settings?.contact_phone ?? undefined,
        }}
      />
      <AnnouncementBar />
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <div className="pb-16">
        <Footer />
      </div>
      <WhatsAppFloat digits={(settings?.whatsapp_number || "+8801833534123").replace(/\D/g, "")} />
      <BottomNav cartCount={cartCount} />
    </>
  );
}
