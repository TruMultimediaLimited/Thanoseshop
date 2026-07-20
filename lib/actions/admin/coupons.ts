"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { couponSchema } from "@/lib/validation/admin/coupon";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return couponSchema.safeParse({
    code: formString(formData, "code"),
    discountType: formString(formData, "discountType"),
    discountValue: formString(formData, "discountValue"),
    minOrderAmount: formString(formData, "minOrderAmount"),
    maxUses: formString(formData, "maxUses"),
    maxUsesPerUser: formString(formData, "maxUsesPerUser"),
    startsAt: formString(formData, "startsAt"),
    expiresAt: formString(formData, "expiresAt"),
    isActive: formData.get("isActive") === "on",
  });
}

function toRow(data: ReturnType<typeof couponSchema.parse>) {
  return {
    code: data.code,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    min_order_amount: data.minOrderAmount,
    max_uses: data.maxUses ? parseInt(data.maxUses, 10) : null,
    max_uses_per_user: data.maxUsesPerUser ? parseInt(data.maxUsesPerUser, 10) : null,
    starts_at: data.startsAt || null,
    expires_at: data.expiresAt || null,
    is_active: data.isActive,
  };
}

export async function createCoupon(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager", "order_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert(toRow(parsed.data));
  if (error) {
    return { ok: false, message: error.code === "23505" ? "That coupon code already exists." : error.message };
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager", "order_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager", "order_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/coupons");
  return { ok: true };
}
