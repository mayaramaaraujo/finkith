"use server";

import { createClient } from "@/shared/lib/supabase/server";
import type { PushSubscriptionPayload } from "@/features/notifications/types";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { describeError } from "@/shared/lib/errors";

export async function saveSubscription(
  payload: PushSubscriptionPayload,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: getDictionary(await getLocale()).errors.notAuthenticated };
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: payload.endpoint,
      p256dh: payload.p256dh,
      auth: payload.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }
}

export async function deleteSubscription(
  endpoint: string,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);

  if (error) {
    return { error: describeError(error, getDictionary(await getLocale())) };
  }
}
