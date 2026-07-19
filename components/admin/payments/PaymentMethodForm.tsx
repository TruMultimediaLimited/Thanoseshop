"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethod } from "@/lib/types/commerce";

const initialState = { ok: false, message: "" };

const TYPES = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "bank", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export function PaymentMethodForm({
  method,
  action,
}: {
  method?: PaymentMethod;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState(method?.type ?? "bkash");
  const [isActive, setIsActive] = useState(method?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="name" className="mb-2">
          Display Name
        </Label>
        <Input id="name" name="name" defaultValue={method?.name} placeholder="bKash" required />
      </div>

      <div>
        <Label className="mb-2">Type</Label>
        <input type="hidden" name="type" value={type} />
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="accountNumber" className="mb-2">
          Account / Wallet Number
        </Label>
        <Input id="accountNumber" name="accountNumber" defaultValue={method?.account_number ?? ""} />
      </div>

      <div>
        <Label htmlFor="accountName" className="mb-2">
          Account Name
        </Label>
        <Input id="accountName" name="accountName" defaultValue={method?.account_name ?? ""} />
      </div>

      {type === "bank" && (
        <>
          <div>
            <Label htmlFor="bankName" className="mb-2">
              Bank Name
            </Label>
            <Input id="bankName" name="bankName" defaultValue={method?.bank_name ?? ""} />
          </div>
          <div>
            <Label htmlFor="branch" className="mb-2">
              Branch
            </Label>
            <Input id="branch" name="branch" defaultValue={method?.branch ?? ""} />
          </div>
          <div>
            <Label htmlFor="routingNumber" className="mb-2">
              Routing Number
            </Label>
            <Input id="routingNumber" name="routingNumber" defaultValue={method?.routing_number ?? ""} />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="instructions" className="mb-2">
          Instructions (shown to customer at checkout)
        </Label>
        <Textarea id="instructions" name="instructions" defaultValue={method?.instructions ?? ""} />
      </div>

      <div>
        <Label htmlFor="sortOrder" className="mb-2">
          Sort Order
        </Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={method?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Payment Method"}
      </Button>
    </form>
  );
}
