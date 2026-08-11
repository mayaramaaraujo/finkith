"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/shared/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/shared/lib/i18n/dictionaries";
import { createClient } from "@/shared/lib/supabase/client";

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const router = useRouter();

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dict: getDictionary(locale),
      setLocale: (next: Locale) => {
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;

        // The cookie renders the app, but anything running without a request
        // — the bill-reminder cron, the confirmation email template — can only
        // see user_metadata, which SignupForm seeds. Mirror the change there so
        // those keep speaking the user's current language. Fire-and-forget:
        // this fails for logged-out visitors (the language switcher also lives
        // on /login), and their cookie is all that matters until they sign up.
        void createClient()
          .auth.updateUser({ data: { locale: next } })
          .catch(() => {});

        router.refresh();
      },
    }),
    [locale, router],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within an I18nProvider");
  return context;
}
