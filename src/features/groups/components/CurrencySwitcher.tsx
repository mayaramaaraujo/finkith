"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Select } from "@/shared/components/Select";
import { Sheet } from "@/shared/components/Sheet";
import { updateGroupCurrency } from "@/features/groups/api/actions";
import { CURRENCIES, currencyLabel, type Currency } from "@/shared/lib/money";
import { useTranslation } from "@/shared/lib/i18n/context";

interface CurrencySwitcherProps {
  currency: Currency;
}

export function CurrencySwitcher({ currency }: CurrencySwitcherProps) {
  const { dict, locale } = useTranslation();
  const [isPending, startTransition] = useTransition();
  // Nothing converts the amounts already stored, so switching silently changes
  // what every number in the group means. Confirm before that happens.
  const [pendingCurrency, setPendingCurrency] = useState<Currency | null>(null);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!pendingCurrency) return;
    startTransition(async () => {
      setError(null);
      const result = await updateGroupCurrency(pendingCurrency);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setPendingCurrency(null);
    });
  }

  return (
    <>
      <Select<Currency>
        value={currency}
        onChange={(next) => next !== currency && setPendingCurrency(next)}
        options={CURRENCIES.map((value) => ({ value, label: currencyLabel(value, locale) }))}
        className={isPending ? "opacity-60" : ""}
      />

      <Sheet
        open={pendingCurrency !== null}
        onClose={() => {
          setPendingCurrency(null);
          setError(null);
        }}
        title={dict.settings.currencyChangeTitle}
      >
        <p className="text-sm text-text-subtle">
          {dict.settings.currencyChangeBody(currency, pendingCurrency ?? currency)}
        </p>
        <Button fullWidth disabled={isPending} onClick={confirm} className="mt-5">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {dict.settings.currencyChangeConfirm}
        </Button>
        {error ? (
          <p role="alert" className="mt-3 text-center text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </Sheet>
    </>
  );
}
