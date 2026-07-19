import { Fragment } from "react";

import { getHomepageSections } from "@/lib/supabase/queries/homepage";
import { getBanners } from "@/lib/supabase/queries/banners";
import {
  getBestSellers,
  getCategories,
  getFaqs,
  getFeaturedGiftCards,
  getFlashDeals,
  getGames,
  getLatestProducts,
} from "@/lib/supabase/queries/catalog";
import { FadeIn } from "@/components/common/FadeIn";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryPills } from "@/components/home/CategoryPills";
import { SearchBarSection } from "@/components/home/SearchBarSection";
import { GamesRow } from "@/components/home/GamesRow";
import { ProductRailSection } from "@/components/home/ProductRailSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { Newsletter } from "@/components/home/Newsletter";
import { getWishlistedProductIds } from "@/lib/supabase/queries/wishlist";
import { getPageMetadata } from "@/lib/seo";
import type { HomepageSection } from "@/lib/types/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

function limitOf(section: HomepageSection, fallback = 8) {
  const raw = section.config?.limit;
  return typeof raw === "number" ? raw : fallback;
}

async function renderSection(section: HomepageSection, wishlistedIds: Set<string>) {
  switch (section.section_type) {
    case "hero_banner": {
      const banners = await getBanners("hero");
      return <HeroBanner banners={banners} />;
    }
    case "search_bar":
      return <SearchBarSection title={section.title} subtitle={section.subtitle} />;
    case "popular_games": {
      const games = await getGames({ popularOnly: true, limit: limitOf(section) });
      return <GamesRow title={section.title} subtitle={section.subtitle} games={games} />;
    }
    case "trending_games": {
      const games = await getGames({ trendingOnly: true, limit: limitOf(section) });
      return <GamesRow title={section.title} subtitle={section.subtitle} games={games} />;
    }
    case "featured_gift_cards": {
      const products = await getFeaturedGiftCards(limitOf(section));
      return (
        <ProductRailSection
          title={section.title ?? "Gift Cards"}
          subtitle={section.subtitle}
          products={products}
          viewAllHref="/gift-cards"
          emptyMessage="No gift cards published yet."
          wishlistedIds={wishlistedIds}
        />
      );
    }
    case "featured_categories": {
      const categories = await getCategories();
      return (
        <FeaturedCategories
          title={section.title ?? "Shop by Category"}
          subtitle={section.subtitle}
          categories={categories.filter((c) => !c.parent_id).slice(0, limitOf(section))}
        />
      );
    }
    case "best_sellers": {
      const products = await getBestSellers(limitOf(section));
      return (
        <ProductRailSection
          title={section.title ?? "Best Sellers"}
          subtitle={section.subtitle}
          products={products}
          viewAllHref="/products?sort=best_selling"
          emptyMessage="No best sellers yet."
          wishlistedIds={wishlistedIds}
        />
      );
    }
    case "latest_products": {
      const products = await getLatestProducts(limitOf(section));
      return (
        <ProductRailSection
          title={section.title ?? "New Arrivals"}
          subtitle={section.subtitle}
          products={products}
          viewAllHref="/products"
          emptyMessage="No products published yet."
          wishlistedIds={wishlistedIds}
        />
      );
    }
    case "flash_deals": {
      const products = await getFlashDeals(limitOf(section));
      if (products.length === 0) return null;
      return (
        <ProductRailSection
          title={section.title ?? "Flash Deals"}
          subtitle={section.subtitle}
          products={products}
          emptyMessage="No deals right now."
          wishlistedIds={wishlistedIds}
        />
      );
    }
    case "why_choose_us": {
      const items = Array.isArray(section.config?.items)
        ? (section.config.items as { icon?: string; title: string; description?: string }[])
        : undefined;
      return <WhyChooseUs title={section.title} subtitle={section.subtitle} items={items} />;
    }
    case "testimonials": {
      const items = Array.isArray(section.config?.items)
        ? (section.config.items as { name: string; quote: string; rating?: number; avatar_url?: string }[])
        : [];
      return <Testimonials title={section.title} subtitle={section.subtitle} items={items} />;
    }
    case "faq": {
      const faqs = await getFaqs();
      return <FaqSection title={section.title} subtitle={section.subtitle} faqs={faqs} />;
    }
    case "newsletter":
      return <Newsletter title={section.title} subtitle={section.subtitle} />;
    default:
      return null;
  }
}

export default async function Home() {
  const sections = await getHomepageSections();

  if (sections.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Welcome to Thanos E-Shop</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          The homepage hasn&apos;t been configured yet. Add sections from the
          admin panel&apos;s Homepage Manager to build this page.
        </p>
      </div>
    );
  }

  const [wishlistedIds, categories] = await Promise.all([
    getWishlistedProductIds(),
    getCategories(),
  ]);
  const rendered = await Promise.all(
    sections.map((section) => renderSection(section, wishlistedIds)),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      {rendered.map((node, i) => (
        <Fragment key={sections[i].id}>
          {node && <FadeIn>{node}</FadeIn>}
          {sections[i].section_type === "hero_banner" && <CategoryPills categories={categories} />}
        </Fragment>
      ))}
    </div>
  );
}
