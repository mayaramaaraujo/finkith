import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeBillsSummary,
  getBillDueInfo,
  isPaidInCycle,
  monthKey,
  paidAtFor,
} from "@/features/bills/lib";
import type { Bill } from "@/features/bills/types";

function bill(overrides: Partial<Bill> = {}): Bill {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    groupId: "00000000-0000-0000-0000-000000000001",
    name: "Rent",
    category: "Housing",
    amount: 100,
    dueDay: 10,
    fixed: true,
    paid: false,
    paidAt: null,
    repeatMonthly: true,
    cycleMonth: "2026-08",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Local midday, so the instant lands in the intended month in any timezone. */
function midday(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12);
}

describe("isPaidInCycle", () => {
  it("counts a repeating bill only for the month it was paid in", () => {
    const paidInJuly = bill({ paid: true, paidAt: midday(2026, 7, 10).toISOString() });

    assert.equal(isPaidInCycle(paidInJuly, "2026-07"), true);
    // The regression this guards: `paid` alone stays true forever, which used
    // to overstate the paid total on every later month's dashboard.
    assert.equal(isPaidInCycle(paidInJuly, "2026-08"), false);
  });

  it("treats a non-repeating bill as paid in whichever month it belongs to", () => {
    const oneOff = bill({ repeatMonthly: false, paid: true, paidAt: null });

    assert.equal(isPaidInCycle(oneOff, "2026-08"), true);
  });

  it("is never paid while the flag is off", () => {
    assert.equal(isPaidInCycle(bill({ paidAt: midday(2026, 8, 1).toISOString() }), "2026-08"), false);
  });
});

describe("paidAtFor", () => {
  it("uses the real timestamp when the viewed month is the current one", () => {
    const now = midday(2026, 8, 20);

    assert.equal(paidAtFor("2026-08", now), now.toISOString());
  });

  it("lands inside an earlier month rather than today", () => {
    const paidAt = paidAtFor("2026-06", midday(2026, 8, 20));

    assert.equal(monthKey(new Date(paidAt)), "2026-06");
  });

  it("round-trips through isPaidInCycle for every month of the year", () => {
    const now = midday(2026, 8, 20);

    for (let month = 1; month <= 12; month++) {
      const key = `2026-${String(month).padStart(2, "0")}`;
      const marked = bill({ paid: true, paidAt: paidAtFor(key, now) });

      assert.equal(isPaidInCycle(marked, key), true, `expected paid for ${key}`);
    }
  });
});

describe("getBillDueInfo", () => {
  it("clamps a due day past the end of a short month", () => {
    const info = getBillDueInfo(bill({ dueDay: 31 }), midday(2026, 2, 10));

    assert.equal(info.nextDueDate, "2026-02-28");
  });

  it("reports overdue once the due day has passed unpaid", () => {
    const info = getBillDueInfo(bill({ dueDay: 5 }), midday(2026, 8, 20));

    assert.equal(info.status, "overdue");
    assert.equal(info.daysUntilDue, -15);
  });

  it("reports due-soon inside the threshold", () => {
    assert.equal(getBillDueInfo(bill({ dueDay: 22 }), midday(2026, 8, 20)).status, "due-soon");
    assert.equal(getBillDueInfo(bill({ dueDay: 26 }), midday(2026, 8, 20)).status, "upcoming");
  });

  it("stays upcoming once paid for the cycle, even past the due day", () => {
    const paid = bill({ dueDay: 5, paid: true, paidAt: midday(2026, 8, 5).toISOString() });

    assert.equal(getBillDueInfo(paid, midday(2026, 8, 20)).status, "upcoming");
  });
});

describe("computeBillsSummary", () => {
  it("splits paid from pending by cycle, not by the raw flag", () => {
    const bills = [
      bill({ id: "a", amount: 300, paid: true, paidAt: midday(2026, 8, 3).toISOString() }),
      bill({ id: "b", amount: 100, paid: true, paidAt: midday(2026, 7, 3).toISOString() }),
    ];

    assert.deepEqual(computeBillsSummary(bills, "2026-08"), {
      paidTotal: 300,
      pendingTotal: 100,
      percentPaid: 75,
    });
  });

  it("reports zero percent for an empty month rather than dividing by zero", () => {
    assert.deepEqual(computeBillsSummary([], "2026-08"), {
      paidTotal: 0,
      pendingTotal: 0,
      percentPaid: 0,
    });
  });
});
