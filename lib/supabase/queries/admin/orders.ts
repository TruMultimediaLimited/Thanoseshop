import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types/commerce";

const ADMIN_ORDER_SELECT = `
  *,
  items:order_items ( * ),
  payment_method:payment_methods ( id, name, type ),
  payment_submission:payment_submissions ( * ),
  customer:profiles!orders_user_id_fkey ( id, full_name, phone )
`;

export async function getAdminOrders(status?: OrderStatus) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(ADMIN_ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAdminOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ADMIN_ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Payment screenshots live in a private bucket — admins view them through a
 * short-lived signed URL generated with the service-role client rather than
 * a public URL, matching the Phase 1 storage design.
 */
export async function getSignedScreenshotUrl(path: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("payment-screenshots")
    .createSignedUrl(path, 60 * 10);

  if (error) return null;
  return data.signedUrl;
}
