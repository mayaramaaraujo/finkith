"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { isCurrency, type Currency } from "@/shared/lib/money";
import { createGroupSchema, type CreateGroupValues } from "@/features/groups/types";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { describeError } from "@/shared/lib/errors";

function deriveDisplayName(user: User) {
  const metaName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (typeof metaName === "string" && metaName.trim()) return metaName.trim();

  const localPart = user.email?.split("@")[0] ?? "Member";
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export async function createGroup(
  values: CreateGroupValues,
): Promise<{ error: string } | undefined> {
  const { name } = createGroupSchema.parse(values);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: getDictionary(await getLocale()).errors.notAuthenticated };
  }

  // A plain insert()+select() here would fail: groups_select requires an
  // active group_members row, which doesn't exist until the second insert
  // below runs, so Postgres rejects reading the just-inserted row back.
  // The RPC does both inserts atomically as security definer, sidestepping
  // that chicken-and-egg RLS check (and rolling back both on any failure).
  const { error: rpcError } = await supabase.rpc("create_group_with_owner", {
    p_name: name,
    p_display_name: deriveDisplayName(user),
  });

  if (rpcError) {
    return { error: describeError(rpcError, getDictionary(await getLocale())) };
  }

  // Not inside a try/catch in the caller: redirect() throws a special
  // NEXT_REDIRECT signal that must propagate, not be treated as an error.
  redirect("/home");
}

export async function joinGroupByCode(
  inviteCode: string,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: getDictionary(await getLocale()).errors.notAuthenticated };
  }

  const { error } = await supabase.rpc("join_group_by_code", {
    p_invite_code: inviteCode,
    p_display_name: deriveDisplayName(user),
  });

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  redirect("/home");
}

export async function updateGroupCurrency(currency: Currency): Promise<{ error: string } | undefined> {
  if (!isCurrency(currency)) {
    return { error: getDictionary(await getLocale()).errors.invalidData };
  }

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: getDictionary(await getLocale()).errors.notInGroup };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("groups")
    .update({ currency })
    .eq("id", currentGroup.groupId);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }

  revalidatePath("/", "layout");
}
