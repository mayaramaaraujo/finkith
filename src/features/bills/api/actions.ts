"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { billSchema, cycleMonthSchema, type BillValues } from "@/features/bills/types";
import { paidAtFor } from "@/features/bills/lib";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { describeError } from "@/shared/lib/errors";

function revalidateBills() {
  revalidatePath("/bills");
  revalidatePath("/home");
}

/**
 * `cycleMonth` is the month the user is looking at, not today's. It decides
 * which month a non-repeating bill belongs to, and — through `paidAtFor` —
 * which cycle ticking "paid" applies to.
 */
export async function addBill(
  values: BillValues,
  cycleMonth: string,
): Promise<{ error: string } | undefined> {
  const parsed = billSchema.parse(values);
  const month = cycleMonthSchema.parse(cycleMonth);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: getDictionary(await getLocale()).errors.notInGroup };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("bills").insert({
    group_id: currentGroup.groupId,
    name: parsed.name,
    category: parsed.category,
    amount: parsed.amount,
    due_day: parsed.dueDay,
    fixed: parsed.fixed,
    repeat_monthly: parsed.repeatMonthly,
    cycle_month: month,
    paid: parsed.paid,
    paid_at: parsed.paid ? paidAtFor(month) : null,
  });

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateBills();
}

export async function updateBill(
  billId: string,
  values: BillValues,
  cycleMonth: string,
): Promise<{ error: string } | undefined> {
  const parsed = billSchema.parse(values);
  const month = cycleMonthSchema.parse(cycleMonth);

  const supabase = await createClient();
  const { error } = await supabase
    .from("bills")
    .update({
      name: parsed.name,
      category: parsed.category,
      amount: parsed.amount,
      due_day: parsed.dueDay,
      fixed: parsed.fixed,
      repeat_monthly: parsed.repeatMonthly,
      cycle_month: month,
      paid: parsed.paid,
      paid_at: parsed.paid ? paidAtFor(month) : null,
    })
    .eq("id", billId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateBills();
}

export async function deleteBill(billId: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("bills").delete().eq("id", billId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateBills();
}

export async function toggleBillPaid(
  billId: string,
  paid: boolean,
  cycleMonth: string,
): Promise<{ error: string } | undefined> {
  const month = cycleMonthSchema.parse(cycleMonth);

  const supabase = await createClient();
  const { error } = await supabase
    .from("bills")
    .update({ paid, paid_at: paid ? paidAtFor(month) : null })
    .eq("id", billId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateBills();
}
