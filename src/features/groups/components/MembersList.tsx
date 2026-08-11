import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { getInitials } from "@/shared/lib/utils";
import { formatMoney, type Currency } from "@/shared/lib/money";
import type { Locale } from "@/shared/lib/i18n/config";
import type { GroupMember } from "@/features/groups/types";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export interface MemberRow {
  member: GroupMember;
  isYou: boolean;
  monthTotal: number;
}

interface MembersListProps {
  rows: MemberRow[];
  dict: Dictionary;
  currency: Currency;
  locale: Locale;
}

function roleLabel(member: GroupMember, dict: Dictionary) {
  if (member.status === "invited") return dict.settings.invited;
  return member.role === "admin" ? dict.settings.admin : dict.settings.member;
}

function roleColorClass(member: GroupMember, isYou: boolean) {
  if (member.status === "invited") return "text-text-subtle";
  if (isYou) return "text-primary-light";
  return "text-neutral-accent";
}

export function MembersList({ rows, dict, currency, locale }: MembersListProps) {
  return (
    <div>
      <p className="mb-3 font-display text-base font-semibold text-text-primary">{dict.settings.members}</p>
      <div className="flex flex-col gap-2">
        {rows.map(({ member, isYou, monthTotal }) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-1 p-3.5"
          >
            <Avatar
              initials={getInitials(member.displayName)}
              colorIndex={member.colorIndex as AvatarColorIndex}
              size="lg"
              className={member.status === "invited" ? "opacity-55" : ""}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-text-primary">
                  {member.displayName}
                </span>
                {isYou ? (
                  <span className="shrink-0 rounded bg-primary/16 px-1.5 py-0.5 text-xs font-bold text-primary-light">
                    {dict.settings.you}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-text-subtle">
                {member.status === "invited"
                  ? dict.settings.invitationSent
                  : dict.settings.thisMonth(formatMoney(monthTotal, currency, locale))}
              </p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${roleColorClass(member, isYou)}`}>
              {roleLabel(member, dict)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
