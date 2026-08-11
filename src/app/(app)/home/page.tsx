import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { GROUP_MEMBER_COLUMNS, mapGroupMemberRow } from "@/features/groups/lib";
import { CATEGORY_COLUMNS, mapCategoryRow } from "@/features/categories/lib";
import type { IncomeEntry } from "@/features/income/types";
import type { Bill } from "@/features/bills/types";
import {
  computeHero,
  computeMemberStrip,
  buildIncomeActivity,
  buildBillActivity,
} from "@/features/dashboard/lib";
import { HeroSection } from "@/features/dashboard/components/HeroSection";
import { MemberStrip } from "@/features/dashboard/components/MemberStrip";
import { ActivitySection } from "@/features/dashboard/components/ActivitySection";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";

function monthRange(month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

interface HomePageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
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

  const [membersRes, entriesRes, billsRes, anyEntriesRes, categoriesRes] = await Promise.all([
    supabase
      .from("group_members")
      .select(GROUP_MEMBER_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    supabase
      .from("income_entries")
      .select("id, group_id, member_id, category, amount, note, entry_date, created_at")
      .eq("group_id", currentGroup.groupId)
      .gte("entry_date", start)
      .lt("entry_date", end)
      .order("entry_date", { ascending: false }),
    supabase
      .from("bills")
      .select(
        "id, group_id, name, category, amount, due_day, fixed, paid, paid_at, repeat_monthly, cycle_month, created_at",
      )
      .eq("group_id", currentGroup.groupId)
      .or(`repeat_monthly.eq.true,cycle_month.eq.${month}`)
      .order("due_day", { ascending: true }),
    supabase
      .from("income_entries")
      .select("id", { count: "exact", head: true })
      .eq("group_id", currentGroup.groupId),
    supabase.from("categories").select(CATEGORY_COLUMNS).eq("group_id", currentGroup.groupId),
  ]);

  const members = (membersRes.data ?? []).map(mapGroupMemberRow);

  const entries: IncomeEntry[] = (entriesRes.data ?? []).map((row) => ({
    id: row.id,
    groupId: row.group_id,
    memberId: row.member_id,
    category: row.category,
    amount: Number(row.amount),
    note: row.note,
    entryDate: row.entry_date,
    createdAt: row.created_at,
  }));

  const bills: Bill[] = (billsRes.data ?? []).map((row) => ({
    id: row.id,
    groupId: row.group_id,
    name: row.name,
    category: row.category,
    amount: Number(row.amount),
    dueDay: row.due_day,
    fixed: row.fixed,
    paid: row.paid,
    paidAt: row.paid_at,
    repeatMonthly: row.repeat_monthly,
    cycleMonth: row.cycle_month,
    createdAt: row.created_at,
  }));

  const categories = (categoriesRes.data ?? []).map(mapCategoryRow);

  const hasAnyActivity = (anyEntriesRes.count ?? 0) > 0 || bills.length > 0;

  const hero = computeHero(entries, bills, members.length, dict, currentGroup.currency, locale);
  const memberStrip = computeMemberStrip(members, entries);
  const incomeItems = buildIncomeActivity(entries, members, dict, LOCALE_INTL_TAG[locale]);
  const billItems = buildBillActivity(bills, month, dict);

  return (
    <div>
      <HeroSection hero={hero} currency={currentGroup.currency} locale={locale} />
      <MemberStrip
        members={memberStrip}
        addLabel={dict.home.add}
        byPersonLabel={dict.home.byPerson}
        currency={currentGroup.currency}
        locale={locale}
      />

      {hasAnyActivity ? (
        <ActivitySection
          incomeItems={incomeItems}
          billItems={billItems}
          entries={entries}
          bills={bills}
          members={members}
          currentMemberId={currentGroup.memberId}
          currency={currentGroup.currency}
            categories={categories}
        />
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-surface-border bg-surface-1 p-6 text-center">
          <p className="text-sm text-text-subtle">{dict.home.noActivity}</p>
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
            <Plus className="size-5 text-primary-light" />
          </span>
        </div>
      )}
    </div>
  );
}
