import { createClient } from "./server";
import { DEFAULT_CURRENCY, isCurrency, type Currency } from "@/shared/lib/money";

export type CurrentGroup = {
  groupId: string;
  groupName: string;
  memberId: string;
  role: "admin" | "member";
  currency: Currency;
};

export async function getCurrentGroup(): Promise<CurrentGroup | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
