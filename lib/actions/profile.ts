"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/auth";

interface ActionResult {
  ok: boolean;
  message?: string;
}

export async function updateProfile(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Please log in." };

  // Deliberately only ever writes full_name/phone — role, admin_role, and
  // is_active are never accepted from this form (see the Phase 1 trigger
  // that blocks a non-admin from changing those columns at all).
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone || null })
    .eq("id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/account");
  return { ok: true, message: "Profile updated." };
}
