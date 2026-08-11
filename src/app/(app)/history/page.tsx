import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import {
  lastSixMonths,
  monthLabel,
  computeTrend,
  computeCategoryBreakdown,
  earlierMonths,
  type MonthEntry,
} from "@/features/history/lib";
import { TrendChart } from "@/features/history/components/TrendChart";
import { CategoryBreakdown } from "@/shared/components/CategoryBreakdown";
import { EarlierMonths } from "@/features/history/components/EarlierMonths";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";
import type { DefaultIncomeCategory } from "@/features/income/types";
import { CATEGORY_COLUMNS, mapCategoryRow, colorsByCategoryName } from "@/features/categories/lib";

interface HistoryPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const { month: monthParam } = await searchParams;
  const now = new Date();
  const month = monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const intlLocale = LOCALE_INTL_TAG[locale];

  const months = lastSixMonths(month);
  const rangeStart = `${months[0]}-01`;
  const [rangeEndYear, rangeEndMonth] = month.split("-").map(Number);
  const rangeEnd = new Date(Date.UTC(rangeEndYear, rangeEndMonth, 1)).toISOString().slice(0, 10);

  const supabase = await createClient();
  const [{ data }, { data: categoryRows }] = await Promise.all([
    supabase
      .from("income_entries")
      .select("category, amount, entry_date")
      .eq("group_id", currentGroup.groupId)
      .gte("entry_date", rangeStart)
      .lt("entry_date", rangeEnd),
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .eq("type", "income"),
  ]);

  const entries: MonthEntry[] = (data ?? []).map((row) => ({
    category: row.category,
    amount: Number(row.amount),
    entryDate: row.entry_date,
  }));
  const categories = (categoryRows ?? []).map(mapCategoryRow);

  const trend = computeTrend(entries, months, month, intlLocale);
  const categoryBreakdown = computeCategoryBreakdown(entries, month, colorsByCategoryName(categories));

  return (
    <div>
      <TrendChart trend={trend} dict={dict} />
      <CategoryBreakdown
        title={dict.history.byCategory(monthLabel(month, true, intlLocale))}
        rows={categoryBreakdown}
        emptyMessage={dict.history.noIncomeThisMonth}
        categoryLabel={(category) => dict.categories.income[category as DefaultIncomeCategory] ?? category}
        currency={currentGroup.currency}
        locale={locale}
      />
      <EarlierMonths
        months={earlierMonths(trend, intlLocale)}
        dict={dict}
        currency={currentGroup.currency}
        locale={locale}
      />
    </div>
  );
}
