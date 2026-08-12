import { Avatar, AVATAR_COLOR_COUNT, type AvatarColorIndex } from "@/shared/components/Avatar";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatMoney, DEFAULT_CURRENCY } from "@/shared/lib/money";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import type { Locale } from "@/shared/lib/i18n/config";
import type { LandingContent } from "@/features/landing/content";

interface AppPreviewProps {
  preview: LandingContent["hero"]["preview"];
  locale: Locale;
}

/**
 * A still of the Home screen, rendered with the app's own tokens, dictionary
 * and money formatter rather than a screenshot — so the numbers read correctly
 * in each locale and the marketing shot can never drift from the real UI.
 */
export function AppPreview({ preview, locale }: AppPreviewProps) {
  const dict = getDictionary(locale);
  const money = (amount: number) => formatMoney(amount, DEFAULT_CURRENCY, locale);

  const income = preview.members.reduce((sum, member) => sum + member.income, 0);
  const bills = preview.bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paid = preview.bills
    .filter((bill) => bill.paid)
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-3xl border border-surface-border bg-gradient-to-b from-bg-page-from via-bg-page-via to-bg-page-to p-4 shadow-glow-primary"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold text-text-primary">
          {preview.groupName}
        </span>
        <span className="text-xs text-text-faint">{preview.month}</span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-bg-hero-from via-bg-hero-via to-bg-hero-to p-5">
        <div className="hero-glow absolute -right-10 -top-10 size-32 rounded-full" />

        <p className="text-xs font-semibold tracking-widest text-text-faint">
          {dict.home.combinedIncome}
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-text-primary">
          {money(income)}
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-text-faint">
              {dict.home.totalBills}
            </p>
            <p className="mt-0.5 font-display text-base font-bold text-text-primary">
              {money(bills)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold tracking-widest text-text-faint">
              {dict.home.projectedAfterBills}
            </p>
            <p className="mt-0.5 font-display text-base font-bold text-positive">
              {money(income - bills)}
            </p>
          </div>
        </div>

        <ProgressBar percent={(paid / bills) * 100} className="mt-4" />
        <p className="mt-2 text-xs text-text-muted">
          {dict.home.billsPaidPending(money(paid), money(bills - paid))}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {preview.members.map((member, index) => (
          <div
            key={member.name}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-surface-2 px-2 py-3"
          >
            <Avatar
              initials={member.name.slice(0, 1)}
              colorIndex={(index % AVATAR_COLOR_COUNT) as AvatarColorIndex}
              size="sm"
            />
            <span className="text-xs text-text-muted">{member.name}</span>
            <span className="font-display text-xs font-bold text-text-primary">
              {money(member.income)}
            </span>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {preview.bills.map((bill) => (
          <li
            key={bill.name}
            className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary">{bill.name}</span>
              <span
                className={`text-xs ${bill.paid ? "text-positive" : "text-warning"}`}
              >
                {bill.paid ? preview.paidLabel : preview.pendingLabel}
              </span>
            </div>
            <span className="font-display text-sm font-bold text-text-primary">
              {money(bill.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
