import type { AvatarColorIndex } from "@/shared/components/Avatar";
import type { GroupMember } from "@/features/groups/types";
import type { IncomeEntry, DefaultIncomeCategory } from "@/features/income/types";
import type { Bill, DefaultBillCategory } from "@/features/bills/types";
import { isPaidInCycle } from "@/features/bills/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

/** A figure whose sign matters, so its color carries meaning. */
export interface HeroFigure {
  label: string;
  value: number;
  colorClass: string;
}

/**
 * Exactly what the hero card renders — see `HeroSection`. Income leads with a
 * contributor line under it; the two signed figures colour themselves.
 */
export interface Hero {
  income: { label: string; value: number; sub: string };
  bills: { label: string; value: number };
  left: HeroFigure;
  available: HeroFigure;
}

export function computeHero(
  entries: IncomeEntry[],
  bills: Bill[],
  month: string,
  activeMemberCount: number,
  dict: Dictionary,
): Hero {
  const incomeTotal = entries.reduce((sum, e) => sum + e.amount, 0);
  const billsTotal = bills.reduce((sum, b) => sum + b.amount, 0);
  // Not `b.paid`: that flag stays true for a repeating bill paid in any past
  // month, which would overstate "available today" every following month.
  const billsPaid = bills.filter((b) => isPaidInCycle(b, month)).reduce((sum, b) => sum + b.amount, 0);
  const left = incomeTotal - billsTotal;
  const leftPositive = left >= 0;
  const available = incomeTotal - billsPaid;
  const availablePositive = available >= 0;

  return {
    income: {
      label: dict.home.combinedIncome,
      value: incomeTotal,
      sub: dict.home.contributing(activeMemberCount),
    },
    bills: {
      label: dict.home.totalBills,
      value: billsTotal,
    },
    left: {
      label: dict.home.projectedAfterBills,
      value: Math.abs(left),
      colorClass: leftPositive ? "text-positive" : "text-danger",
    },
    available: {
      label: dict.home.availableToday,
      value: Math.abs(available),
      colorClass: availablePositive ? "text-positive" : "text-danger",
    },
  };
}

export interface MemberStripEntry {
  id: string;
  name: string;
  colorIndex: AvatarColorIndex;
  amount: number;
}

export function computeMemberStrip(
  members: GroupMember[],
  entries: IncomeEntry[],
): MemberStripEntry[] {
  const totalsByMember = new Map<string, number>();
  for (const entry of entries) {
    totalsByMember.set(entry.memberId, (totalsByMember.get(entry.memberId) ?? 0) + entry.amount);
  }

  return members.map((member) => ({
    id: member.id,
    name: member.displayName,
    colorIndex: member.colorIndex as AvatarColorIndex,
    amount: totalsByMember.get(member.id) ?? 0,
  }));
}

export type ActivityFilter = "all" | "income" | "bills";

export interface ActivityItem {
  id: string;
  isIncome: boolean;
  title: string;
  sub: string;
  amount: number;
  amountColorClass: string;
  date: string;
}

export function buildIncomeActivity(
  entries: IncomeEntry[],
  members: GroupMember[],
  dict: Dictionary,
  intlLocale: string,
): ActivityItem[] {
  const memberById = new Map(members.map((m) => [m.id, m]));

  return entries.map((entry) => {
    const member = memberById.get(entry.memberId);
    const dateLabel = new Date(entry.entryDate).toLocaleDateString(intlLocale, {
      month: "short",
      day: "numeric",
    });
    const parts = [member?.displayName ?? dict.home.member, dateLabel];
    if (entry.note) parts.push(entry.note);

    return {
      id: entry.id,
      isIncome: true,
      title: dict.categories.income[entry.category as DefaultIncomeCategory] ?? entry.category,
      sub: parts.join(" · "),
      amount: entry.amount,
      amountColorClass: "text-positive",
      date: entry.entryDate,
    };
  });
}

export function buildBillActivity(bills: Bill[], month: string, dict: Dictionary): ActivityItem[] {
  return bills.map((bill) => {
    const category = dict.categories.bill[bill.category as DefaultBillCategory] ?? bill.category;
    const status = isPaidInCycle(bill, month) ? dict.home.dueDayPaid : dict.home.dueDayPending;
    const sub = bill.repeatMonthly
      ? `${category} · ${dict.home.dueDayLabel(bill.dueDay)} · ${status}`
      : `${category} · ${status}`;
    return {
      id: bill.id,
      isIncome: false,
      title: bill.name,
      sub,
      amount: bill.amount,
      amountColorClass: isPaidInCycle(bill, month) ? "text-text-subtle" : "text-warning",
      date: `${month}-${String(bill.dueDay).padStart(2, "0")}`,
    };
  });
}

export function mergeActivity(income: ActivityItem[], bills: ActivityItem[]): ActivityItem[] {
  return [...income, ...bills].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
