"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toggleBillPaid } from "@/features/bills/api/actions";
import { isPaidInCycle } from "@/features/bills/lib";
import type { Bill } from "@/features/bills/types";
import { useTranslation } from "@/shared/lib/i18n/context";

interface PaidToggleProps {
  bill: Bill;
  /** The `YYYY-MM` being viewed — the cycle this toggle marks paid. */
  month: string;
  /**
   * Reports a failed write to the row, which owns the space to show it — the
   * toggle itself is a 24px checkbox with nowhere to put a sentence.
   */
  onError: (message: string | null) => void;
}

export function PaidToggle({ bill, month, onError }: PaidToggleProps) {
  const { dict } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const isPaid = isPaidInCycle(bill, month);

  function toggle() {
    startTransition(async () => {
      onError(null);
      const result = await toggleBillPaid(bill.id, !isPaid, month);
      if (result?.error) onError(result.error);
    });
  }

  return (
    <button
      type="button"
      aria-label={isPaid ? dict.bills.markUnpaid : dict.bills.markPaid}
      disabled={isPending}
      onClick={toggle}
      className={`flex size-6 shrink-0 items-center justify-center rounded-xs border transition-colors disabled:opacity-50 ${
        isPaid ? "border-positive bg-positive text-white" : "border-surface-4 bg-transparent text-transparent"
      }`}
    >
      <Check className="size-3.5" />
    </button>
  );
}
