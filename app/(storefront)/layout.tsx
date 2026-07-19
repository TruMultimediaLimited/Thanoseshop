import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
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
      <Footer />
    </>
  );
}
