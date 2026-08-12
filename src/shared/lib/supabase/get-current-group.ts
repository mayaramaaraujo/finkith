import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import { DEFAULT_CURRENCY, isCurrency, type Currency } from "@/shared/lib/money";

export type CurrentGroup = {
  groupId: string;
  groupName: string;
  memberId: string;
  role: "admin" | "member";
  currency: Currency;
};

/**
 * Pass `knownUser` when the caller has already resolved the session — every
 * `getUser()` is a round trip to the Auth server, and a page that redirects on
 * the result would otherwise pay for it twice.
 */
export async function getCurrentGroup(knownUser?: User): Promise<CurrentGroup | null> {
  const supabase = await createClient();

  const user = knownUser ?? (await supabase.auth.getUser()).data.user;

  if (!user) return null;

  const { data } = await supabase
    .from("group_members")
    .select("id, role, groups(id, name, currency)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!data || !data.groups) return null;

  return {
    groupId: data.groups.id,
    groupName: data.groups.name,
    memberId: data.id,
    role: data.role as "admin" | "member",
    currency: isCurrency(data.groups.currency) ? data.groups.currency : DEFAULT_CURRENCY,
  };
}
