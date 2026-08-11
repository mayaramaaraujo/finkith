import Link from "next/link";
import { Plus } from "lucide-react";
import { Avatar } from "@/shared/components/Avatar";
import { formatMoney, type Currency } from "@/shared/lib/money";
import type { Locale } from "@/shared/lib/i18n/config";
import type { MemberStripEntry } from "@/features/dashboard/lib";

interface MemberStripProps {
  members: MemberStripEntry[];
  byPersonLabel: string;
  addLabel: string;
  currency: Currency;
  locale: Locale;
}

export function MemberStrip({ members, byPersonLabel, addLabel, currency, locale }: MemberStripProps) {
  return (
    <div>
      <p className="mb-3 mt-6 font-display text-base font-semibold text-text-primary">
        {byPersonLabel}
      </p>
      <div className="flex gap-2.5 overflow-x-auto pb-0.5">
        {members.map((member) => (
          <div
            key={member.id}
            className="w-32 shrink-0 rounded-xl border border-surface-border bg-surface-2 p-3.5"
          >
            <Avatar initials={member.name.charAt(0).toUpperCase()} colorIndex={member.colorIndex} size="sm" />
            <p className="mt-2.5 truncate text-xs text-text-muted">{member.name}</p>
            <p className="mt-0.5 font-display text-lg font-bold text-text-primary">
              {formatMoney(member.amount, currency, locale)}
            </p>
          </div>
        ))}
        <Link
          href="/settings"
          className="flex w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-surface-4 bg-surface-1"
        >
          <Plus className="size-4 text-primary-light" />
          <span className="text-xs font-semibold text-text-tertiary">{addLabel}</span>
        </Link>
      </div>
    </div>
  );
}
