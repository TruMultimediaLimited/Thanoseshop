import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types/commerce";

export async function getActivePaymentMethods() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PaymentMethod[];
}
