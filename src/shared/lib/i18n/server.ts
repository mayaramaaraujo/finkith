import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  matchLocale,
  type Locale,
} from "@/shared/lib/i18n/config";

/**
 * The active locale: the user's explicit choice if they've made one, otherwise
 * the closest language their browser asks for, otherwise the default.
 *
 * The cookie has to win — it's the only record of someone deliberately picking
 * a language that isn't their browser's, and it would be overridden on every
 * request otherwise.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && isLocale(value)) return value;

  const headerStore = await headers();
  return matchLocale(headerStore.get("accept-language")) ?? DEFAULT_LOCALE;
}
