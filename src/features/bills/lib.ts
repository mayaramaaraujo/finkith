import type { Database } from "@/shared/lib/supabase/database.types";
import type { Bill } from "@/features/bills/types";
import type { CategoryBreakdownRow } from "@/shared/components/CategoryBreakdown";

export const BILL_COLUMNS =
  "id, group_id, name, category, amount, due_day, fixed, paid, paid_at, repeat_monthly, cycle_month, created_at" as const;

type BillRow = Database["public"]["Tables"]["bills"]["Row"];

export function mapBillRow(row: BillRow): Bill {
  return {
    id: row.id,
    groupId: row.group_id,
    name: row.name,
    category: row.category,
    amount: Number(row.amount),
    dueDay: row.due_day,
    fixed: row.fixed,
    paid: row.paid,
    paidAt: row.paid_at,
    repeatMonthly: row.repeat_monthly,
    cycleMonth: row.cycle_month,
    createdAt: row.created_at,
  };
}

export type BillDueStatus = "upcoming" | "due-soon" | "overdue";

export interface BillDueInfo {
  status: BillDueStatus;
  nextDueDate: string; // ISO yyyy-mm-dd, clamped to the month's last day
  daysUntilDue: number; // negative once overdue
  isPaidThisCycle: boolean;
}

/** The `YYYY-MM` cycle a date falls in, read in the reader's own timezone. */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Whether a bill counts as paid for `month` (`YYYY-MM`).
 *
 * `paid_at` is the only record of *when* a bill was paid, so a repeating bill
 * counts for a cycle only when its `paid_at` falls inside that cycle — that's
 * what makes "paid" reset every month without a scheduled job. A non-repeating
 * bill belongs to exactly one month (`cycle_month`), so its `paid` flag stands
 * on its own.
 *
 * Every screen that shows a paid/pending figure must read it from here: the
 * raw `paid` column is true for a repeating bill paid in *any* past month.
 */
export function isPaidInCycle(
  bill: Pick<Bill, "paid" | "paidAt" | "repeatMonthly">,
  month: string,
): boolean {
  if (!bill.paid) return false;
  if (!bill.repeatMonthly) return true;
  return bill.paidAt != null && monthKey(new Date(bill.paidAt)) === month;
}

/**
 * The `paid_at` to write when marking a bill paid for `month`. Writing `now()`
 * unconditionally would file a bill ticked off while viewing an earlier month
 * under the current one instead, and `isPaidInCycle` would read it back as
 * unpaid for the month the user was actually looking at. Midday on the 15th
 * keeps the instant inside `month` in every timezone the app is read in.
 */
export function paidAtFor(month: string, now: Date = new Date()): string {
  if (month === monthKey(now)) return now.toISOString();

  const [year, monthNum] = month.split("-").map(Number);
  return new Date(year, monthNum - 1, 15, 12).toISOString();
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getBillDueInfo(
  bill: Pick<Bill, "dueDay" | "paid" | "paidAt" | "repeatMonthly">,
  today: Date = new Date(),
  dueSoonThresholdDays = 3,
): BillDueInfo {
  const todayStart = startOfDay(today);

  const isPaidThisCycle = isPaidInCycle(bill, monthKey(todayStart));

  const daysInMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0).getDate();
  const effectiveDay = Math.min(bill.dueDay, daysInMonth);
  const nextDueDate = new Date(todayStart.getFullYear(), todayStart.getMonth(), effectiveDay);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.round((nextDueDate.getTime() - todayStart.getTime()) / msPerDay);

  let status: BillDueStatus = "upcoming";
  if (!isPaidThisCycle) {
    if (daysUntilDue < 0) status = "overdue";
    else if (daysUntilDue <= dueSoonThresholdDays) status = "due-soon";
  }

  return {
    status: isPaidThisCycle ? "upcoming" : status,
    nextDueDate: toIsoDate(nextDueDate),
    daysUntilDue,
    isPaidThisCycle,
  };
}

export interface BillsSummary {
  paidTotal: number;
  pendingTotal: number;
  percentPaid: number;
}

export function computeBillsSummary(bills: Bill[], month: string): BillsSummary {
  const total = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = bills
    .filter((b) => isPaidInCycle(b, month))
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingTotal = total - paidTotal;
  const percentPaid = total === 0 ? 0 : Math.round((paidTotal / total) * 100);

  return { paidTotal, pendingTotal, percentPaid };
}

/** Bills paid for `month`, grouped by category, sorted descending. */
export function computeCategoryBreakdown(
  bills: Bill[],
  colorsByCategory: Record<string, string>,
  month: string,
): CategoryBreakdownRow[] {
  const paidBills = bills.filter((b) => isPaidInCycle(b, month));
  const total = paidBills.reduce((sum, b) => sum + b.amount, 0);

  const totalsByCategory = new Map<string, number>();
  for (const bill of paidBills) {
    totalsByCategory.set(bill.category, (totalsByCategory.get(bill.category) ?? 0) + bill.amount);
  }

  return Array.from(totalsByCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      accent: colorsByCategory[category] ?? "neutral-accent",
      amount,
      percent: total === 0 ? 0 : Math.round((amount / total) * 100),
    }));
}

export type BillFilter = "all" | "fixed" | "variable";

export function filterBills(bills: Bill[], filter: BillFilter): Bill[] {
  if (filter === "fixed") return bills.filter((b) => b.fixed);
  if (filter === "variable") return bills.filter((b) => !b.fixed);
  return bills;
}
