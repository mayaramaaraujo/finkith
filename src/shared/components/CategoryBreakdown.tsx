import { ProgressBar } from "@/shared/components/ProgressBar";
import { CHIP_ACCENT_BG_CLASSES, type ChipAccent } from "@/shared/lib/chip-accents";
import { formatMoney, type Currency } from "@/shared/lib/money";
import type { Locale } from "@/shared/lib/i18n/config";

export interface CategoryBreakdownRow {
  category: string;
  accent: string;
  amount: number;
  percent: number;
}

interface CategoryBreakdownProps {
  title: string;
  rows: CategoryBreakdownRow[];
  emptyMessage: string;
  categoryLabel: (category: string) => string;
  currency: Currency;
  locale: Locale;
}

export function CategoryBreakdown({ title, rows, emptyMessage, categoryLabel, currency, locale }: CategoryBreakdownProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">{title}</p>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-col gap-3.5 rounded-xl border border-surface-border bg-surface-1 p-4">
          {rows.map((row) => (
            <div key={row.category}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <span className={`size-2 rounded ${CHIP_ACCENT_BG_CLASSES[row.accent as ChipAccent] ?? "bg-neutral-accent"}`} />
                  {categoryLabel(row.category)}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">
                  {formatMoney(row.amount, currency, locale)}
                </span>
              </div>
              <ProgressBar
                percent={row.percent}
                color={CHIP_ACCENT_BG_CLASSES[row.accent as ChipAccent] ?? "bg-neutral-accent"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
