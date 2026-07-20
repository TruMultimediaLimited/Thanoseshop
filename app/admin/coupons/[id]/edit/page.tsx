import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CouponForm } from "@/components/admin/coupons/CouponForm";
import { updateCoupon } from "@/lib/actions/admin/coupons";
import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "@/lib/types/commerce";

export const metadata: Metadata = { title: "Edit Coupon | Admin" };

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: coupon } = await supabase.from("coupons").select("*").eq("id", id).maybeSingle();

  if (!coupon) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Coupon</h1>
      <CouponForm coupon={coupon as Coupon} action={updateCoupon.bind(null, id)} />
    </div>
  );
}
