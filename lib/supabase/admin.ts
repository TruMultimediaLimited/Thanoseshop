import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

/**
 * Service-role Supabase client. Bypasses RLS entirely — never import this
 * into a Client Component and never expose SUPABASE_SERVICE_ROLE_KEY to the
 * browser. Reserved for trusted server-only operations such as generating
 * signed URLs for private storage objects (e.g. payment screenshots).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
