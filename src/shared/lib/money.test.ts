import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LOCALES } from "@/shared/lib/i18n/config";
import {
  formatAmountForInput,
  formatMoney,
  formatMoneyParts,
  parseMoney,
} from "@/shared/lib/money";

describe("formatMoney", () => {
  it("places the symbol where each locale puts it", () => {
    assert.equal(formatMoney(1234.5, "EUR", "en"), "€1,234.50");
    assert.equal(formatMoney(1234.5, "EUR", "pt-BR"), "€ 1.234,50");
    // Spanish puts the symbol after the amount — the reason formatMoneyParts exists.
    assert.equal(formatMoney(1234.5, "EUR", "es-ES"), "1.234,50 €");
  });

  it("uses the currency's symbol, not its code, in every locale", () => {
    assert.equal(formatMoney(1234.5, "BRL", "es-ES"), "1.234,50 R$");
    assert.equal(formatMoney(1234.5, "BRL", "pt-BR"), "R$ 1.234,50");
  });

  it("always shows both decimal places", () => {
    for (const locale of LOCALES) {
      for (const amount of [1234, 1234.5, 1234.56]) {
        assert.match(formatMoney(amount, "EUR", locale), /\d[.,]\d{2}(\D|$)/);
      }
    }
  });

  it("groups thousands even where the locale would omit them", () => {
    assert.equal(formatMoney(1234, "EUR", "es-ES"), "1.234,00 €");
  });
});

describe("formatMoneyParts", () => {
  it("reports which side the symbol belongs on", () => {
    assert.equal(formatMoneyParts(1234.5, "EUR", "en").symbolFirst, true);
    assert.equal(formatMoneyParts(1234.5, "EUR", "es-ES").symbolFirst, false);
  });

  it("splits the symbol out without dropping any digits", () => {
    const { symbol, number } = formatMoneyParts(1234.5, "EUR", "es-ES");
    assert.equal(symbol, "€");
    assert.equal(number, "1.234,50");
  });
});

describe("parseMoney", () => {
  it("reads what a user types in their own number format", () => {
    assert.equal(parseMoney("1.234,56", "es-ES"), 1234.56);
    assert.equal(parseMoney("1234,56", "es-ES"), 1234.56);
    assert.equal(parseMoney("1.234.567,89", "pt-BR"), 1234567.89);
    assert.equal(parseMoney("1,234.56", "en"), 1234.56);
    assert.equal(parseMoney("1234", "es-ES"), 1234);
  });

  it("returns null for anything that isn't a number", () => {
    assert.equal(parseMoney("", "en"), null);
    assert.equal(parseMoney("   ", "en"), null);
    assert.equal(parseMoney("abc", "es-ES"), null);
    assert.equal(parseMoney("12€", "es-ES"), null);
  });

  it("rejects misplaced group separators instead of silently rescaling", () => {
    // "1.234.56" is "1.234,56" with a mistyped decimal mark. Stripping every
    // separator would read it as 123456 — a 100x error, saved without warning.
    assert.equal(parseMoney("1.234.56", "es-ES"), null);
    assert.equal(parseMoney("12,34,56", "en"), null);
    assert.equal(parseMoney("1,23", "en"), null);
  });
});

describe("formatAmountForInput", () => {
  // The edit path: a stored amount seeds the field, and whatever the user
  // leaves there is parsed back. A mismatch would silently rescale the amount
  // — "1234.56" seeded for a Spanish user parses back as 123456.
  it("round-trips through parseMoney in every locale", () => {
    for (const locale of LOCALES) {
      for (const amount of [7, 1234, 1234.5, 1234.56, 0.05, 999999.99]) {
        const field = formatAmountForInput(amount, locale);
        assert.equal(parseMoney(field, locale), amount, `${locale} ${amount} via "${field}"`);
      }
    }
  });

  it("seeds the field in the locale's own format", () => {
    assert.equal(formatAmountForInput(1234.5, "en"), "1234.50");
    assert.equal(formatAmountForInput(1234.5, "es-ES"), "1234,50");
  });
});
