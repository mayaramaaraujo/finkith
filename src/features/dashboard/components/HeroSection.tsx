import { formatMoney, formatMoneyParts, type Currency } from "@/shared/lib/money";
import type { Locale } from "@/shared/lib/i18n/config";
import type { HeroData, SummaryMode } from "@/features/dashboard/lib";

interface HeroSectionProps {
  hero: Record<SummaryMode, HeroData>;
  currency: Currency;
  locale: Locale;
}

export function HeroSection({ hero, currency, locale }: HeroSectionProps) {
  // The headline amount styles its symbol apart from the digits, so it needs
  // the parts rather than the formatted string — including which side the
  // symbol goes on, which is after the number in Spanish.
  const income = formatMoneyParts(hero.income.value, currency, locale);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/22 bg-gradient-to-br from-bg-hero-from via-bg-hero-via to-bg-hero-to p-6">
      <div className="hero-glow absolute -top-16 -right-10 size-44 rounded-full" />

      <p className="relative text-xs font-semibold tracking-wide text-primary-muted">
        {hero.income.label}
      </p>
      <div className="relative mt-2 flex items-end gap-1.5">
        {income.symbolFirst ? (
          <span className="font-display text-2xl font-medium text-text-primary">{income.symbol}</span>
        ) : null}
        <span className="font-display text-5xl font-extrabold tracking-tighter text-text-primary">
          {income.number}
        </span>
        {income.symbolFirst ? null : (
          <span className="font-display text-2xl font-medium text-text-primary">{income.symbol}</span>
        )}
      </div>
      <p className="relative mt-3 text-sm text-text-muted">{hero.income.sub}</p>

      <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-surface-border pt-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary-muted">
            {hero.bills.label}
          </p>
          <p className="mt-1 font-display text-xl font-bold text-text-primary">
            {formatMoney(hero.bills.value, currency, locale)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary-muted">
            {hero.left.label}
          </p>
          <p className={`mt-1 font-display text-xl font-bold ${hero.left.colorClass}`}>
            {formatMoney(hero.left.value, currency, locale)}
          </p>
        </div>
      </div>

      <div className="relative mt-4 border-t border-surface-border pt-4">
        <p className="text-xs font-semibold tracking-wide text-primary-muted">
          {hero.available.label}
        </p>
        <p className={`mt-1 font-display text-xl font-bold ${hero.available.colorClass}`}>
          {formatMoney(hero.available.value, currency, locale)}
        </p>
      </div>
    </div>
  );
}
