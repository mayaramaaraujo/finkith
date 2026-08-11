import * as z from "zod";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";
import type { Locale } from "@/shared/lib/i18n/config";
import { parseMoney } from "@/shared/lib/money";

export type IncomeEntry = {
  id: string;
  groupId: string;
  memberId: string;
  category: string;
  amount: number;
  note: string | null;
  entryDate: string;
  createdAt: string;
};

/**
 * The literal names seeded for every group (supabase/migrations/0008_custom_categories.sql)
 * — kept only so `dict.categories.income` can translate them. Not the source of truth for
 * what categories exist; that's the `categories` table (see `@/features/categories`).
 */
export type DefaultIncomeCategory = "Salary" | "Freelance" | "Bonus" | "Part-time" | "Gift" | "Other";

function incomeFields(dict: Dictionary) {
  return {
    memberId: z.uuid(),
    category: z.string().min(1, dict.income.validation.categoryRequired),
    entryDate: z.iso.date(dict.income.validation.dateRequired),
    note: z.string().optional(),
  };
}

/**
 * Form schema. `amount` arrives as whatever the user typed in their own number
 * format, so it's parsed here rather than coerced — `Number("1.234,56")` is
 * NaN, and the message for that would be zod's built-in English one. The
 * explicit `error` covers NaN so an unparseable amount reads the same as a
 * non-positive one.
 */
export function createAddIncomeFormSchema(dict: Dictionary, locale: Locale) {
  return z.object({
    ...incomeFields(dict),
    amount: z
      .string()
      .transform((raw) => parseMoney(raw, locale) ?? NaN)
      .pipe(
        z
          .number({ error: dict.income.validation.amountPositive })
          .positive(dict.income.validation.amountPositive),
      ),
  });
}

/**
 * What Server Actions re-validate: the form has already parsed the amount into
 * a number, so this side never sees a locale-formatted string.
 */
export const addIncomeSchema = z.object({
  ...incomeFields(en),
  amount: z.number().positive(),
});

export type AddIncomeValues = z.infer<typeof addIncomeSchema>;
