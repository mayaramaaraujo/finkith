"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

/**
 * Last resort: this replaces the root layout, so the I18nProvider that every
 * other screen reads its language from is gone by definition.
 *
 * It stays in the default language on purpose. The alternatives are reading
 * the locale cookie during render, which mismatches between the server and
 * client copies of this page, or reading it after mount, which flashes. Both
 * add a way for the page that handles a crash to crash — and this is the one
 * screen with nothing behind it.
 */
export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  const dict = getDictionary(DEFAULT_LOCALE);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={LOCALE_INTL_TAG[DEFAULT_LOCALE]} className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center gap-3 bg-bg-base px-8 text-center text-text-primary">
        <title>{dict.errorBoundary.title}</title>
        <h1 className="font-display text-xl font-bold">{dict.errorBoundary.title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-text-subtle">{dict.errorBoundary.body}</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-2 flex h-11 items-center justify-center rounded-lg border border-surface-border bg-surface-2 px-5 font-display text-sm font-semibold text-text-primary"
        >
          {dict.errorBoundary.retry}
        </button>
      </body>
    </html>
  );
}
