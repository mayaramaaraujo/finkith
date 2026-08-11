export const LOCALES = ["en", "pt-BR", "es-ES"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "locale";

/** BCP 47 tag used for Intl.* calls (toLocaleDateString, etc). */
export const LOCALE_INTL_TAG: Record<Locale, string> = {
  en: "en-US",
  "pt-BR": "pt-BR",
  "es-ES": "es-ES",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Português",
  "es-ES": "Español",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
