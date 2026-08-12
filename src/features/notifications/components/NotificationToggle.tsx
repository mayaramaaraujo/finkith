"use client";

import { useEffect, useState, useTransition } from "react";
import { Switch } from "@/shared/components/Switch";
import { describeError } from "@/shared/lib/errors";
import { subscribeToPush, unsubscribeFromPush } from "@/features/notifications/lib";
import { saveSubscription, deleteSubscription } from "@/features/notifications/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

export function NotificationToggle() {
  const { dict } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then(async (registration) => {
        const subscription = await registration?.pushManager.getSubscription();
        setChecked(!!subscription);
      })
      // Reading the existing state is best-effort: if the service worker
      // can't be reached the toggle simply starts off, which is what an
      // unsubscribed browser looks like anyway.
      .catch(() => {});
  }, []);

  function handleChange(next: boolean) {
    startTransition(async () => {
      setError(null);
      try {
        if (next) {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            setPermissionDenied(true);
            return;
          }
          setPermissionDenied(false);

          const subscription = await subscribeToPush(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          );
          const json = subscription.toJSON();
          const result = await saveSubscription({
            endpoint: subscription.endpoint,
            p256dh: json.keys?.p256dh ?? "",
            auth: json.keys?.auth ?? "",
          });
          if (result?.error) {
            setError(result.error);
            return;
          }
          setChecked(true);
        } else {
          const endpoint = await unsubscribeFromPush();
          const result = endpoint ? await deleteSubscription(endpoint) : undefined;
          if (result?.error) {
            setError(result.error);
            return;
          }
          setChecked(false);
        }
      } catch (cause) {
        // Registering a service worker or subscribing to a push service can
        // fail outright — an unsupported browser, a blocked worker, a VAPID
        // key the push service rejects. The toggle keeps its old state.
        setError(describeError(cause instanceof Error ? cause : null, dict));
      }
    });
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-semibold text-text-primary">{dict.notifications.title}</p>
        <p className="mt-0.5 text-xs text-text-subtle">{dict.notifications.description}</p>
        {permissionDenied && (
          <p className="mt-1 text-xs text-warning">{dict.notifications.permissionDenied}</p>
        )}
        {error ? (
          <p role="alert" className="mt-1 text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={handleChange} />
    </div>
  );
}
