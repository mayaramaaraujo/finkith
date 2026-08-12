"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Chip } from "@/shared/components/Chip";
import { formatMoney, type Currency } from "@/shared/lib/money";
import { mergeActivity, type ActivityItem, type ActivityFilter } from "@/features/dashboard/lib";
import { useTranslation } from "@/shared/lib/i18n/context";
import { IncomeSheet } from "@/features/income/components/IncomeSheet";
import { BillSheet } from "@/features/bills/components/BillSheet";
import type { IncomeEntry } from "@/features/income/types";
import type { Bill } from "@/features/bills/types";
import type { GroupMember } from "@/features/groups/types";
import { categoriesByType } from "@/features/categories/lib";
import type { Category } from "@/features/categories/types";

interface ActivitySectionProps {
  incomeItems: ActivityItem[];
  billItems: ActivityItem[];
  entries: IncomeEntry[];
  bills: Bill[];
  members: GroupMember[];
  currentMemberId: string;
  currency: Currency;
  categories: Category[];
  month: string;
}

export function ActivitySection({
  incomeItems,
  billItems,
  entries,
  bills,
  members,
  currentMemberId,
  currency,
  categories,
  month,
}: ActivitySectionProps) {
  const { dict, locale } = useTranslation();
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const FILTERS: { value: ActivityFilter; label: string }[] = [
    { value: "all", label: dict.home.filterAll },
    { value: "income", label: dict.home.filterIncome },
    { value: "bills", label: dict.home.filterBills },
  ];

  const visible =
    filter === "income" ? incomeItems : filter === "bills" ? billItems : mergeActivity(incomeItems, billItems);
  const editingEntry = entries.find((e) => e.id === editingEntryId);
  const editingBill = bills.find((b) => b.id === editingBillId);

  return (
    <div>
      <div className="mt-6 mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-text-primary">{dict.home.activity}</p>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-4 text-center text-sm text-text-subtle">
          {dict.home.nothingForFilter}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                item.isIncome ? setEditingEntryId(item.id) : setEditingBillId(item.id)
              }
              className="flex w-full items-center gap-3 rounded-lg border border-surface-border bg-surface-1 p-3 text-left"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-sm ${
                  item.isIncome ? "bg-positive/14" : "bg-warning/14"
                }`}
              >
                {item.isIncome ? (
                  <ArrowUp className="size-4 text-positive" />
                ) : (
                  <ArrowDown className="size-4 text-warning" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                <p className="mt-0.5 truncate text-xs text-text-subtle">{item.sub}</p>
              </div>
              <span className={`font-display text-sm font-bold ${item.amountColorClass}`}>
                {item.isIncome ? "+" : "−"}{formatMoney(item.amount, currency, locale)}
              </span>
            </button>
          ))}
        </div>
      )}

      <IncomeSheet
        open={!!editingEntryId}
        entry={editingEntry}
        members={members}
        defaultMemberId={currentMemberId}
        currency={currency}
        categories={categoriesByType(categories, "income")}
        onClose={() => setEditingEntryId(null)}
      />
      <BillSheet
        open={!!editingBillId}
        bill={editingBill}
        currency={currency}
        categories={categoriesByType(categories, "bill")}
        month={month}
        onClose={() => setEditingBillId(null)}
      />
    </div>
  );
}
