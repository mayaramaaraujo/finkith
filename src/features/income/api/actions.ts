"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { addIncomeSchema, type AddIncomeValues } from "@/features/income/types";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { describeError } from "@/shared/lib/errors";

function revalidateIncome() {
  revalidatePath("/home");
  revalidatePath("/history");
}

export async function addEntry(values: AddIncomeValues): Promise<{ error: string } | undefined> {
  const parsed = addIncomeSchema.parse(values);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: getDictionary(await getLocale()).errors.notInGroup };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("income_entries").insert({
    group_id: currentGroup.groupId,
    member_id: parsed.memberId,
    category: parsed.category,
    amount: parsed.amount,
    entry_date: parsed.entryDate,
    note: parsed.note || null,
  });

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateIncome();
}

export async function updateEntry(
  entryId: string,
  values: AddIncomeValues,
): Promise<{ error: string } | undefined> {
  const parsed = addIncomeSchema.parse(values);

  const supabase = await createClient();
  const { error } = await supabase
    .from("income_entries")
    .update({
      member_id: parsed.memberId,
      category: parsed.category,
      amount: parsed.amount,
      entry_date: parsed.entryDate,
      note: parsed.note || null,
    })
    .eq("id", entryId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateIncome();
}

export async function deleteEntry(entryId: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("income_entries").delete().eq("id", entryId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateIncome();
}
