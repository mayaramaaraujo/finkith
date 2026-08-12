import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { GROUP_MEMBER_COLUMNS, mapGroupMemberRow } from "@/features/groups/lib";
import type { MemberRow } from "@/features/groups/components/MembersList";
import { InviteLinkCard } from "@/features/groups/components/InviteLinkCard";
import { MembersList } from "@/features/groups/components/MembersList";
import { CurrencySwitcher } from "@/features/groups/components/CurrencySwitcher";
import { CATEGORY_COLUMNS, mapCategoryRow } from "@/features/categories/lib";
import { ManageCategoriesSection } from "@/features/categories/components/ManageCategoriesSection";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DeleteAccountButton } from "@/features/auth/components/DeleteAccountButton";
import { NotificationToggle } from "@/features/notifications/components/NotificationToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { unwrap } from "@/shared/lib/supabase/unwrap";

function monthRange(month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

interface SettingsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const { month: monthParam } = await searchParams;
  const now = new Date();
  const month = monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { start, end } = monthRange(month);

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  const [groupRes, membersRes, entriesRes, categoriesRes] = await Promise.all([
    supabase.from("groups").select("invite_code").eq("id", currentGroup.groupId).single(),
    supabase
      .from("group_members")
      .select(GROUP_MEMBER_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .order("created_at", { ascending: true }),
    supabase
      .from("income_entries")
      .select("member_id, amount")
      .eq("group_id", currentGroup.groupId)
      .gte("entry_date", start)
      .lt("entry_date", end),
    supabase.from("categories").select(CATEGORY_COLUMNS).eq("group_id", currentGroup.groupId),
  ]);

  const members = (unwrap(membersRes, "settings members") ?? []).map(mapGroupMemberRow);
  const categories = (unwrap(categoriesRes, "settings categories") ?? []).map(mapCategoryRow);
  const group = unwrap(groupRes, "settings group");

  const totalsByMember = new Map<string, number>();
  for (const entry of (unwrap(entriesRes, "settings income") ?? [])) {
    totalsByMember.set(entry.member_id, (totalsByMember.get(entry.member_id) ?? 0) + Number(entry.amount));
  }

  const rows: MemberRow[] = members.map((member) => ({
    member,
    isYou: member.id === currentGroup.memberId,
    monthTotal: totalsByMember.get(member.id) ?? 0,
  }));

  const inviteUrl = `${protocol}://${host}/join/${group?.invite_code ?? ""}`;

  return (
    <div className="flex flex-col gap-8">
      <InviteLinkCard inviteUrl={inviteUrl} />

      <MembersList rows={rows} dict={dict} currency={currentGroup.currency} locale={locale} />

      <div className="divide-y divide-surface-border rounded-xl border border-surface-border bg-surface-1">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-semibold text-text-primary">{dict.settings.language}</p>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-semibold text-text-primary">{dict.settings.currency}</p>
          <CurrencySwitcher currency={currentGroup.currency} />
        </div>
        <NotificationToggle />
      </div>

      <ManageCategoriesSection categories={categories} />

      <div className="grid grid-cols-2 gap-3 border-t border-surface-border pt-6">
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
