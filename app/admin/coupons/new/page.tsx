import type { Metadata } from "next";

import { CouponForm } from "@/components/admin/coupons/CouponForm";
import { createCoupon } from "@/lib/actions/admin/coupons";

export const metadata: Metadata = { title: "New Coupon | Admin" };

export default function NewCouponPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Coupon</h1>
      <CouponForm action={createCoupon} />
    </div>
  );
}
