"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email() });

export async function subscribeToNewsletter(_prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });

  if (error) {
    // Unique violation just means they're already subscribed — treat as success.
    if (error.code === "23505") {
      return { ok: true, message: "You're already subscribed!" };
    }
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, message: "Subscribed! Watch your inbox for deals." };
}
