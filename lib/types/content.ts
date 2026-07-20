export type HomepageSectionType =
  | "hero_banner"
  | "search_bar"
  | "popular_games"
  | "trending_games"
  | "featured_gift_cards"
  | "featured_categories"
  | "best_sellers"
  | "latest_products"
  | "flash_deals"
  | "why_choose_us"
  | "testimonials"
  | "faq"
  | "newsletter";

export type BannerPlacement = "hero" | "promo" | "category" | "gift_card";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type BlogStatus = "draft" | "published";

export interface HomepageSection {
  id: string;
  section_type: HomepageSectionType;
  title: string | null;
  subtitle: string | null;
  config: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string | null;
  placement: BannerPlacement;
  sort_order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id: string | null;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  created_at: string;
  reviewer_name?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string | null;
  status: BlogStatus;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface SiteSettings {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  facebook_url: string | null;
  footer_text: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
}

export interface SeoSettings {
  page_key: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
}
