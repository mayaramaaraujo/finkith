import { LOCALE_INTL_TAG, type Locale } from "@/shared/lib/i18n/config";

/**
 * Supported currencies, as ISO 4217 codes. Intl knows every currency there is
 * — this list only decides which ones the picker offers, so opening a new
 * market is one entry here plus a `groups.currency` migration.
 */
export const CURRENCIES = ["EUR", "BRL"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}

// Built once per locale+currency pair. Constructing an Intl formatter is the
// expensive part, and lists format the same pair for every row.
const formatterCache = new Map<string, Intl.NumberFormat>();

function formatter(currency: Currency, locale: Locale): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let cached = formatterCache.get(key);

  if (!cached) {
    cached = new Intl.NumberFormat(LOCALE_INTL_TAG[locale], {
      style: "currency",
      currency,
      // Without this, BRL read in Spanish prints as the code "BRL", not "R$".
      currencyDisplay: "narrowSymbol",
      // es-ES omits the group separator below 10.000 by default. Money reads
      // better grouped consistently, and it keeps columns aligned.
      useGrouping: "always",
    });
    formatterCache.set(key, cached);
  }

  return cached;
}

/**
 * Money as the reader expects it: "€1,234.50" in English, "R$ 1.234,50" in
 * Brazil, "1.234,50 €" in Spain. Symbol placement, spacing, grouping and the
 * number of decimals all come from the locale/currency pair — never assume a
 * leading symbol.
 */
export function formatMoney(amount: number, currency: Currency, locale: Locale): string {
  return formatter(currency, locale).format(amount);
}

export interface MoneyParts {
  symbol: string;
  number: string;
  /** Whether the symbol belongs before the digits in this locale. */
  symbolFirst: boolean;
}

/**
 * The same formatting, split so the symbol can be styled apart from the digits
 * (the hero renders it smaller and lighter). Prefer `formatMoney` unless the
 * two really are styled differently.
 */
export function formatMoneyParts(amount: number, currency: Currency, locale: Locale): MoneyParts {
  const parts = formatter(currency, locale).formatToParts(amount);
  const symbolAt = parts.findIndex((part) => part.type === "currency");

  return {
    symbol: parts[symbolAt]?.value ?? "",
    // "literal" is the spacing around the symbol, which the layout owns here.
    number: parts
      .filter((part, index) => index !== symbolAt && part.type !== "literal")
      .map((part) => part.value)
      .join(""),
    symbolFirst: symbolAt === 0,
  };
}

/** Localized currency name for the picker, e.g. "Real brasileño (R$)". */
export function currencyLabel(currency: Currency, locale: Locale): string {
  const intlTag = LOCALE_INTL_TAG[locale];
  const name = new Intl.DisplayNames(intlTag, { type: "currency" }).of(currency) ?? currency;
  const { symbol } = formatMoneyParts(0, currency, locale);

  // Spanish lowercases currency names; they read better capitalized in a list.
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} (${symbol})`;
}

/**
 * A stored amount as the text to seed the amount field with when editing.
 * Must round-trip through `parseMoney` in the same locale — seeding "1234.56"
 * for a Spanish user would parse back as 123456, since "." is their group
 * separator. Ungrouped, so the field stays clean and the round-trip is exact.
 */
export function formatAmountForInput(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_INTL_TAG[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(amount);
}

/**
 * Reads an amount the user typed in their own number format — "1.234,56" in
 * Spain and Brazil, "1,234.56" in English. Returns null when it isn't a
 * number, so the caller can raise a translated error.
 *
 * Separators are read back out of Intl rather than hardcoded, so this keeps
 * working for locales that group with a non-breaking space (French, Polish).
 */
export function parseMoney(input: string, locale: Locale): number | null {
  const parts = new Intl.NumberFormat(LOCALE_INTL_TAG[locale]).formatToParts(12345.6);
  // Locales that group with a non-breaking space are typed with a plain one.
  const normalizeSpaces = (value: string) => value.replace(/[  \s]/g, " ");
  const group = normalizeSpaces(parts.find((part) => part.type === "group")?.value ?? ",");
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";

  const trimmed = normalizeSpaces(input).trim();
  if (trimmed === "") return null;

  const negative = trimmed.startsWith("-");
  const unsigned = negative ? trimmed.slice(1) : trimmed;

  const [integer, fraction, ...extra] = unsigned.split(decimal);
  if (extra.length > 0) return null;
  if (fraction !== undefined && !/^\d+$/.test(fraction)) return null;

  // Group separators must actually group, so a mistyped decimal ("1.234.56"
  // where "1.234,56" was meant) is rejected rather than read as 123456.
  const grouped = integer.split(group);
  const digits = grouped.join("");
  if (!/^\d+$/.test(digits)) return null;
  if (grouped.length > 1) {
    const [first, ...rest] = grouped;
    if (first.length < 1 || first.length > 3) return null;
    if (rest.some((chunk) => chunk.length !== 3)) return null;
  }

  const value = Number(`${negative ? "-" : ""}${digits}.${fraction ?? "0"}`);
  return Number.isFinite(value) ? value : null;
}
