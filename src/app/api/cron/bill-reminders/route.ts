import webpush from "web-push";
import { getAdminClient } from "@/shared/lib/supabase/admin";
import { BILL_COLUMNS, mapBillRow, getBillDueInfo } from "@/features/bills/lib";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/shared/lib/i18n/config";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

function reminderCopy(billName: string, status: "due-soon" | "overdue", locale: Locale) {
  const dict = getDictionary(locale);
  const label = status === "overdue" ? dict.bills.overdue : dict.bills.dueSoon;
  const body =
    status === "overdue"
      ? dict.notifications.reminderOverdueBody(billName)
      : dict.notifications.reminderDueSoonBody(billName);
  return { title: `${billName} · ${label}`, body };
}

/**
 * The recipient's language. There's no request here, so the locale cookie the
 * app renders from is out of reach — user_metadata is the only per-user copy,
 * written at signup and refreshed whenever the language switcher runs. Users
 * who predate that, or whose metadata holds something unrecognized, fall back
 * to DEFAULT_LOCALE. Cached per run so a user with several due bills is only
 * looked up once.
 */
async function getUserLocale(
  supabase: ReturnType<typeof getAdminClient>,
  userId: string,
  cache: Map<string, Locale>,
): Promise<Locale> {
  const cached = cache.get(userId);
  if (cached) return cached;

  const { data } = await supabase.auth.admin.getUserById(userId);
  const value = data.user?.user_metadata?.locale;
  const locale = typeof value === "string" && isLocale(value) ? value : DEFAULT_LOCALE;

  cache.set(userId, locale);
  return locale;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getAdminClient();

  // Only repeating bills have an ongoing due-date cycle to remind about —
  // a non-repeating bill is a one-off expense, not a recurring obligation.
  const { data: billRows, error: billsError } = await supabase
    .from("bills")
    .select(BILL_COLUMNS)
    .eq("repeat_monthly", true);

  if (billsError) {
    return Response.json({ error: billsError.message }, { status: 500 });
  }

  const bills = (billRows ?? []).map(mapBillRow);
  const localeCache = new Map<string, Locale>();
  let sent = 0;
  let skipped = 0;

  for (const bill of bills) {
    const dueInfo = getBillDueInfo(bill);
    if (dueInfo.status !== "due-soon" && dueInfo.status !== "overdue") continue;

    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", bill.groupId)
      .eq("status", "active")
      .not("user_id", "is", null);

    if (membersError) continue;

    const cycleMonth = `${dueInfo.nextDueDate.slice(0, 7)}-01`;

    for (const member of members ?? []) {
      const userId = member.user_id;
      if (!userId) continue;

      const { error: insertError } = await supabase.from("bill_reminders_sent").insert({
        bill_id: bill.id,
        user_id: userId,
        cycle_month: cycleMonth,
        reminder_type: dueInfo.status,
      });

      // A unique-constraint violation means this reminder was already sent
      // this cycle — skip without sending again.
      if (insertError) {
        skipped++;
        continue;
      }

      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("id, endpoint, p256dh, auth")
        .eq("user_id", userId);

      const locale = await getUserLocale(supabase, userId, localeCache);
      const { title, body } = reminderCopy(bill.name, dueInfo.status, locale);

      let delivered = 0;

      for (const subscription of subscriptions ?? []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            JSON.stringify({ title, body, billId: bill.id }),
          );
          delivered++;
          sent++;
        } catch (err) {
          if (err instanceof webpush.WebPushError && (err.statusCode === 404 || err.statusCode === 410)) {
            await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
          }
        }
      }

      // The row above is what stops a second send this cycle, so it's claimed
      // before sending — but leaving it behind after a total failure (or when
      // the user has no subscription yet) would suppress this reminder for the
      // rest of the cycle. Release the claim so tomorrow's run tries again.
      if (delivered === 0) {
        await supabase
          .from("bill_reminders_sent")
          .delete()
          .eq("bill_id", bill.id)
          .eq("user_id", userId)
          .eq("cycle_month", cycleMonth)
          .eq("reminder_type", dueInfo.status);
      }
    }
  }

  return Response.json({ sent, skipped });
}
