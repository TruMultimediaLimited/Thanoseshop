import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types/commerce";

const ORDER_SELECT = `
  *,
  items:order_items ( * ),
  payment_method:payment_methods ( id, name, type )
`;

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as OrderWithItems | null;
}

export async function getOrdersForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as OrderWithItems[];
}
