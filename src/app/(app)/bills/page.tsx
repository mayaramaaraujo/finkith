import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { BILL_COLUMNS, mapBillRow, computeBillsSummary, computeCategoryBreakdown } from "@/features/bills/lib";
import { BillsSummary } from "@/features/bills/components/BillsSummary";
import { BillsList } from "@/features/bills/components/BillsList";
import { CategoryBreakdown } from "@/shared/components/CategoryBreakdown";
import type { DefaultBillCategory } from "@/features/bills/types";
import { CATEGORY_COLUMNS, mapCategoryRow, colorsByCategoryName } from "@/features/categories/lib";
import { monthLabel } from "@/features/history/lib";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";
import { unwrap } from "@/shared/lib/supabase/unwrap";

export default async function BillsPage() {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const supabase = await createClient();
  const [billsRes, categoriesRes] = await Promise.all([
    supabase
      .from("bills")
      .select(BILL_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .or(`repeat_monthly.eq.true,cycle_month.eq.${currentMonth}`)
      .order("due_day", { ascending: true }),
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .eq("type", "bill"),
  ]);

  const bills = (unwrap(billsRes, "bills") ?? []).map(mapBillRow);
  const categories = (unwrap(categoriesRes, "bill categories") ?? []).map(mapCategoryRow);
  const summary = computeBillsSummary(bills, currentMonth);
  const categoryBreakdown = computeCategoryBreakdown(bills, colorsByCategoryName(categories), currentMonth);

  return (
    <div>
      <BillsSummary summary={summary} dict={dict} currency={currentGroup.currency} locale={locale} />
      <CategoryBreakdown
        title={dict.bills.byCategory(monthLabel(currentMonth, true, LOCALE_INTL_TAG[locale]))}
        rows={categoryBreakdown}
        emptyMessage={dict.bills.noPaidBillsThisMonth}
        categoryLabel={(category) => dict.categories.bill[category as DefaultBillCategory] ?? category}
        currency={currentGroup.currency}
        locale={locale}
      />
      <BillsList
        bills={bills}
        currency={currentGroup.currency}
        categories={categories}
        month={currentMonth}
      />
    </div>
  );
}
