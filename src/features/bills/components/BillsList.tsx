"use client";

import { useState } from "react";
import { Repeat } from "lucide-react";
import { Chip, CHIP_ACCENT_BG_CLASSES, type ChipAccent } from "@/shared/components/Chip";
import { formatMoney, type Currency } from "@/shared/lib/money";
import { filterBills, getBillDueInfo, type BillFilter } from "@/features/bills/lib";
import { type Bill, type DefaultBillCategory } from "@/features/bills/types";
import { colorsByCategoryName } from "@/features/categories/lib";
import type { Category } from "@/features/categories/types";
import { BillSheet } from "@/features/bills/components/BillSheet";
import { PaidToggle } from "@/features/bills/components/PaidToggle";
import { useTranslation } from "@/shared/lib/i18n/context";

interface BillsListProps {
  bills: Bill[];
  currency: Currency;
  categories: Category[];
}

export function BillsList({ bills, currency, categories }: BillsListProps) {
  const { dict, locale } = useTranslation();
  const [filter, setFilter] = useState<BillFilter>("all");
  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  const colorsByCategory = colorsByCategoryName(categories);
  function categoryDotClass(category: string) {
    return CHIP_ACCENT_BG_CLASSES[colorsByCategory[category] as ChipAccent] ?? "bg-neutral-accent";
  }

  const FILTERS: { value: BillFilter; label: string }[] = [
    { value: "all", label: dict.bills.filterAll },
    { value: "fixed", label: dict.bills.filterFixed },
    { value: "variable", label: dict.bills.filterVariable },
  ];

  const visible = filterBills(bills, filter);
  const editingBill = bills.find((b) => b.id === editingBillId);

  if (bills.length === 0) {
    return (
      <p className="mt-6 rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
        {dict.bills.noBillsYet}
      </p>
    );
  }

  return (
    <div>
      <div className="mt-6 flex gap-1.5">
        {FILTERS.map((f) => (
          <Chip key={f.value} accent="neutral" selected={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {visible.map((bill) => {
          const dueInfo = getBillDueInfo(bill);
          return (
            <div
              key={bill.id}
              className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-1 p-3.5"
            >
              <PaidToggle bill={bill} />
              <button
                type="button"
                onClick={() => setEditingBillId(bill.id)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                <span className={`size-1.5 shrink-0 rounded-full ${categoryDotClass(bill.category)}`} />
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-text-primary">{bill.name}</span>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-subtle">
                    {dict.categories.bill[bill.category as DefaultBillCategory] ?? bill.category}
                    {bill.repeatMonthly ? (
                      <>
                        {" "}· {dict.bills.due(bill.dueDay)}
                        <Repeat className="size-3" />
                      </>
                    ) : null}
                  </p>
                </div>
              </button>
              {dueInfo.status === "overdue" && (
                <Chip accent="warning" selected className="pointer-events-none py-1">
                  {dict.bills.overdue}
                </Chip>
              )}
              {dueInfo.status === "due-soon" && (
                <Chip accent="violet" selected className="pointer-events-none py-1">
                  {dict.bills.dueSoon}
                </Chip>
              )}
              <span
                className={`font-display text-sm font-bold ${dueInfo.isPaidThisCycle ? "text-positive" : "text-text-primary"}`}
              >
                {formatMoney(bill.amount, currency, locale)}
              </span>
            </div>
          );
        })}
      </div>

      <BillSheet
        open={!!editingBillId}
        bill={editingBill}
        currency={currency}
        categories={categories}
        onClose={() => setEditingBillId(null)}
      />
    </div>
  );
}
