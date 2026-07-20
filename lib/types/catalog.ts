export type ProductType = "topup" | "giftcard" | "subscription" | "account";
export type DeliveryType = "instant_code" | "manual_topup" | "account_credentials";

export interface Region {
  id: string;
  name: string;
  code: string;
  flag_icon_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  publisher: string | null;
  is_published: boolean;
  is_trending: boolean;
  is_popular: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number | null;
  is_published: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  product_type: ProductType;
  game_id: string | null;
  category_id: string | null;
  region_id: string | null;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  gallery: string[];
  base_price: number | null;
  compare_at_price: number | null;
  has_variants: boolean;
  delivery_type: DeliveryType;
  delivery_instructions: string | null;
  requires_player_id: boolean;
  stock_quantity: number | null;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
}

export interface ProductWithRelations extends Product {
  game: Pick<Game, "id" | "name" | "slug" | "logo_url"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  region: Pick<Region, "id" | "name" | "code" | "flag_icon_url"> | null;
  variants: ProductVariant[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  product_id: string | null;
  sort_order: number;
  is_published: boolean;
}
