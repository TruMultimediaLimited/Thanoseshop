"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { setUserActive, setUserRole } from "@/lib/actions/admin/users";
import { ADMIN_ROLE_LABEL, type AdminRole } from "@/lib/types/admin";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "super_admin", label: ADMIN_ROLE_LABEL.super_admin },
  { value: "order_manager", label: ADMIN_ROLE_LABEL.order_manager },
  { value: "product_manager", label: ADMIN_ROLE_LABEL.product_manager },
  { value: "support", label: ADMIN_ROLE_LABEL.support },
];

export function UserRoleControls({
  userId,
  role,
  adminRole,
  isActive,
  isSelf,
}: {
  userId: string;
  role: "customer" | "admin";
  adminRole: AdminRole | null;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const currentValue = role === "admin" ? (adminRole ?? "support") : "customer";

  function handleRoleChange(value: string) {
    startTransition(async () => {
      const result =
        value === "customer"
          ? await setUserRole(userId, "customer", null)
          : await setUserRole(userId, "admin", value as AdminRole);

      if (!result.ok) {
        toast.error(result.message ?? "Could not update role");
        return;
      }
      toast.success("Role updated");
    });
  }

  function handleActiveChange(checked: boolean) {
    startTransition(async () => {
      const result = await setUserActive(userId, checked);
      if (!result.ok) {
        toast.error(result.message ?? "Could not update");
        return;
      }
      toast.success(checked ? "Account activated" : "Account deactivated");
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={currentValue} onValueChange={handleRoleChange} disabled={isPending || isSelf}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Switch checked={isActive} onCheckedChange={handleActiveChange} disabled={isPending || isSelf} />
    </div>
  );
}
