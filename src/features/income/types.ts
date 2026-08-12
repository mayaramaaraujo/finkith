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
 * NaN, and the message for that would be zod's built-in English one.
 *
 * The two ways an amount can be wrong are reported separately: text that isn't
 * a number at all can't be described as "greater than 0" without leaving the
 * reader to guess what's wrong with what they typed.
 */
export function createAddIncomeFormSchema(dict: Dictionary, locale: Locale) {
  return z.object({
    ...incomeFields(dict),
    amount: z
      .string()
      .transform((raw, ctx) => {
        const parsed = parseMoney(raw, locale);
        if (parsed === null) {
          ctx.addIssue({ code: "custom", message: dict.income.validation.amountInvalid });
          return z.NEVER;
        }
        return parsed;
      })
      .pipe(z.number().positive(dict.income.validation.amountPositive)),
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
