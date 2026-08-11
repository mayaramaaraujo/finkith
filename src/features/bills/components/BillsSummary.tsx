import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatMoney, type Currency } from "@/shared/lib/money";
import type { Locale } from "@/shared/lib/i18n/config";
import type { BillsSummary as BillsSummaryData } from "@/features/bills/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface BillsSummaryProps {
  summary: BillsSummaryData;
  dict: Dictionary;
  currency: Currency;
  locale: Locale;
}

export function BillsSummary({ summary, dict, currency, locale }: BillsSummaryProps) {
  const { paidTotal, pendingTotal, percentPaid } = summary;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-surface-border bg-surface-1 p-3.5">
          <p className="text-xs text-text-subtle">{dict.bills.paid}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-positive">
            {formatMoney(paidTotal, currency, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-1 p-3.5">
          <p className="text-xs text-text-subtle">{dict.bills.pending}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-warning">
            {formatMoney(pendingTotal, currency, locale)}
          </p>
        </div>
      </div>

      <div className="mt-2.5">
        <ProgressBar percent={percentPaid} color="bg-gradient-to-r from-positive to-positive-dark" />
        <p className="mt-2 text-xs text-text-subtle">{dict.bills.percentPaid(percentPaid)}</p>
      </div>
    </div>
  );
}
