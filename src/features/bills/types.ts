import * as z from "zod";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";
import type { Locale } from "@/shared/lib/i18n/config";
import { parseMoney } from "@/shared/lib/money";

export type Bill = {
  id: string;
  groupId: string;
  name: string;
  category: string;
  amount: number;
  dueDay: number;
  fixed: boolean;
  paid: boolean;
  paidAt: string | null;
  repeatMonthly: boolean;
  cycleMonth: string;
  createdAt: string;
};

/**
 * The literal names seeded for every group (supabase/migrations/0008_custom_categories.sql)
 * — kept only so `dict.categories.bill` can translate them. Not the source of truth for
 * what categories exist; that's the `categories` table (see `@/features/categories`).
 */
export type DefaultBillCategory =
  | "Housing"
  | "Utilities"
  | "Insurance"
  | "Subscriptions"
  | "Groceries"
  | "Fuel"
  | "Other";

function billFields(dict: Dictionary) {
  return {
    name: z.string().min(1, dict.bills.validation.nameRequired),
    dueDay: z.coerce.number().int().min(1).max(31),
    fixed: z.boolean(),
    category: z.string().min(1, dict.bills.validation.categoryRequired),
    repeatMonthly: z.boolean(),
    paid: z.boolean(),
  };
}

/** Form schema — see the note on `createAddIncomeFormSchema` for `amount`. */
export function createBillFormSchema(dict: Dictionary, locale: Locale) {
  return z.object({
    ...billFields(dict),
    amount: z
      .string()
      .transform((raw, ctx) => {
        const parsed = parseMoney(raw, locale);
        if (parsed === null) {
          ctx.addIssue({ code: "custom", message: dict.bills.validation.amountInvalid });
          return z.NEVER;
        }
        return parsed;
      })
      .pipe(z.number().positive(dict.bills.validation.amountPositive)),
  });
}

/** What Server Actions re-validate, with `amount` already parsed by the form. */
export const billSchema = z.object({
  ...billFields(en),
  amount: z.number().positive(),
});

/**
 * A `YYYY-MM` cycle, matching the `bills_cycle_month_format` check constraint.
 * Not part of the form — it comes from whichever month the user is viewing.
 */
export const cycleMonthSchema = z.string().regex(/^\d{4}-\d{2}$/);

export type BillValues = z.infer<typeof billSchema>;
