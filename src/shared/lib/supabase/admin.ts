import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let adminClient: ReturnType<typeof createSupabaseClient<Database>> | undefined;

// Service-role client for code that runs outside any user session (the
// bill-reminders cron) and must read/write across every group, bypassing
// RLS. Built lazily so a missing SUPABASE_SERVICE_ROLE_KEY only breaks the
// cron route that actually needs it, not every server action sharing this
// module.
export function getAdminClient() {
  adminClient ??= createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  return adminClient;
}
