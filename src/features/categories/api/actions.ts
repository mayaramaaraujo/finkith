"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { categorySchema, type CategoryValues } from "@/features/categories/types";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { describeError } from "@/shared/lib/errors";

function revalidateCategories() {
  revalidatePath("/settings");
  revalidatePath("/bills");
  revalidatePath("/history");
  revalidatePath("/home");
}

export async function addCategory(values: CategoryValues): Promise<{ error: string } | undefined> {
  const parsed = categorySchema.parse(values);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: getDictionary(await getLocale()).errors.notInGroup };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    group_id: currentGroup.groupId,
    type: parsed.type,
    name: parsed.name,
    color: parsed.color,
  });

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateCategories();
}

export async function deleteCategory(categoryId: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidateCategories();
}
