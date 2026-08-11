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

/**
 * Best supported locale for an `Accept-Language` header, or undefined if none
 * matches. Tags are tried in the browser's own quality order, first as exact
 * matches ("pt-BR") and then by base language ("pt" → "pt-BR"), so a visitor
 * running es-MX or pt-PT still lands on the closest language we ship rather
 * than on English.
 */
export function matchLocale(acceptLanguage: string | null): Locale | undefined {
  if (!acceptLanguage) return undefined;

  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params.find((p) => p.startsWith("q="))?.slice(2);
      return { tag, quality: quality === undefined ? 1 : Number(quality) };
    })
    .filter(({ tag, quality }) => tag && !Number.isNaN(quality) && quality > 0)
    .sort((a, b) => b.quality - a.quality)
    .map(({ tag }) => tag);

  for (const tag of tags) {
    const exact = LOCALES.find((locale) => locale.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;

    const base = tag.split("-")[0].toLowerCase();
    const byLanguage = LOCALES.find((locale) => locale.split("-")[0].toLowerCase() === base);
    if (byLanguage) return byLanguage;
  }

  return undefined;
}
