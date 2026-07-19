export type OrderStatus =
  | "pending"
  | "payment_review"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentSubmissionStatus = "pending" | "verified" | "rejected";
export type PaymentMethodType = "bkash" | "nagad" | "rocket" | "bank" | "other";
export type DiscountType = "percent" | "fixed";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  account_number: string | null;
  account_name: string | null;
  bank_name: string | null;
  branch: string | null;
  routing_number: string | null;
  instructions: string | null;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  player_id_note: string | null;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail_url: string | null;
    base_price: number | null;
    requires_player_id: boolean;
  };
  variant: {
    id: string;
    name: string;
    price: number;
  } | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name_snapshot: string;
  variant_name_snapshot: string | null;
  region_name_snapshot: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  player_id_note: string | null;
  delivered_payload: string | null;
  delivered_at: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  total: number;
  coupon_id: string | null;
  payment_method_id: string | null;
  customer_note: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  payment_method: Pick<PaymentMethod, "id" | "name" | "type"> | null;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  payment_review: "Payment Under Review",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
