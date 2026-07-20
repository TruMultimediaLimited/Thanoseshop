"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Coupon } from "@/lib/types/commerce";

const initialState = { ok: false, message: "" };

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function CouponForm({
  coupon,
  action,
}: {
  coupon?: Coupon;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [discountType, setDiscountType] = useState(coupon?.discount_type ?? "percent");
  const [isActive, setIsActive] = useState(coupon?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="code" className="mb-2">
          Coupon Code
        </Label>
        <Input id="code" name="code" defaultValue={coupon?.code} placeholder="WELCOME10" required />
      </div>

      <div>
        <Label className="mb-2">Discount Type</Label>
        <input type="hidden" name="discountType" value={discountType} />
        <Select value={discountType} onValueChange={(v) => setDiscountType(v as typeof discountType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percent">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="discountValue" className="mb-2">
          Discount Value {discountType === "percent" ? "(%)" : "(৳)"}
        </Label>
        <Input
          id="discountValue"
          name="discountValue"
          type="number"
          step="0.01"
          defaultValue={coupon?.discount_value}
          required
        />
      </div>

      <div>
        <Label htmlFor="minOrderAmount" className="mb-2">
          Minimum Order Amount
        </Label>
        <Input
          id="minOrderAmount"
          name="minOrderAmount"
          type="number"
          step="0.01"
          defaultValue={coupon?.min_order_amount ?? 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxUses" className="mb-2">
            Max Total Uses
          </Label>
          <Input id="maxUses" name="maxUses" type="number" defaultValue={coupon?.max_uses ?? ""} placeholder="Unlimited" />
        </div>
        <div>
          <Label htmlFor="maxUsesPerUser" className="mb-2">
            Max Uses / Customer
          </Label>
          <Input
            id="maxUsesPerUser"
            name="maxUsesPerUser"
            type="number"
            defaultValue={coupon?.max_uses_per_user ?? ""}
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startsAt" className="mb-2">
            Starts
          </Label>
          <Input id="startsAt" name="startsAt" type="date" defaultValue={toDateInputValue(coupon?.starts_at ?? null)} />
        </div>
        <div>
          <Label htmlFor="expiresAt" className="mb-2">
            Expires
          </Label>
          <Input id="expiresAt" name="expiresAt" type="date" defaultValue={toDateInputValue(coupon?.expires_at ?? null)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Coupon"}
      </Button>
    </form>
  );
}
