import type { Metadata } from "next";

import { ProfileForm } from "@/components/account/ProfileForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
      <ProfileForm
        fullName={profile?.full_name ?? null}
        phone={profile?.phone ?? null}
        email={user!.email ?? ""}
      />
    </div>
  );
}
