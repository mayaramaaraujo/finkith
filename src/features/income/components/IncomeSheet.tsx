"use client";

import { useEffect, useMemo } from "react";
import type * as z from "zod";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Sheet } from "@/shared/components/Sheet";
import { Input } from "@/shared/components/Input";
import { DatePicker } from "@/shared/components/DatePicker";
import { Button } from "@/shared/components/Button";
import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { Chip } from "@/shared/components/Chip";
import { getInitials } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";
import { addEntry, updateEntry, deleteEntry } from "@/features/income/api/actions";
import { createAddIncomeSchema, type IncomeEntry, type DefaultIncomeCategory } from "@/features/income/types";
import type { GroupMember } from "@/features/groups/types";
import type { Category } from "@/features/categories/types";
import { useTranslation } from "@/shared/lib/i18n/context";

interface IncomeSheetProps {
  open: boolean;
  onClose: () => void;
  members: GroupMember[];
  defaultMemberId: string;
  entry?: IncomeEntry;
  currency: Currency;
  categories: Category[];
}

type IncomeFormInput = z.input<ReturnType<typeof createAddIncomeSchema>>;
type IncomeFormValues = z.output<ReturnType<typeof createAddIncomeSchema>>;

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function entryToValues(entry: IncomeEntry): IncomeFormInput {
  return {
    memberId: entry.memberId,
    category: entry.category,
    amount: entry.amount,
    entryDate: entry.entryDate,
    note: entry.note ?? "",
  };
}

function defaultValues(defaultMemberId: string, categories: Category[]): IncomeFormInput {
  return {
    memberId: defaultMemberId,
    category: categories[0]?.name ?? "",
    // "" (not undefined) so `reset` actually clears the number input's DOM value
    amount: "",
    entryDate: todayDate(),
    note: "",
  };
}

export function IncomeSheet({
  open,
  onClose,
  members,
  defaultMemberId,
  entry,
  currency,
  categories,
}: IncomeSheetProps) {
  const { dict } = useTranslation();
  const addIncomeSchema = useMemo(() => createAddIncomeSchema(dict), [dict]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormInput, unknown, IncomeFormValues>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: entry ? entryToValues(entry) : defaultValues(defaultMemberId, categories),
  });

  useEffect(() => {
    if (open) {
      reset(entry ? entryToValues(entry) : defaultValues(defaultMemberId, categories));
    }
  }, [open, entry, defaultMemberId, categories, reset]);

  async function onSubmit(values: IncomeFormValues) {
    const result = entry ? await updateEntry(entry.id, values) : await addEntry(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    reset(defaultValues(defaultMemberId, categories));
    onClose();
  }

  async function onDelete() {
    if (!entry) return;
    const result = await deleteEntry(entry.id);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={entry ? dict.income.editTitle : dict.income.addTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <div>
          <Input
            leadingText={CURRENCY_SYMBOL[currency]}
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="0"
            invalid={!!errors.amount}
            className="font-display text-2xl font-bold"
            {...register("amount")}
          />
          {errors.amount ? (
            <p className="mt-2 text-xs font-medium text-danger">{errors.amount.message}</p>
          ) : null}
        </div>

        <Controller
          control={control}
          name="memberId"
          render={({ field }) => (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-subtle">{dict.income.whoEarned}</p>
              <div className="flex gap-2 overflow-x-auto pb-0.5">
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => field.onChange(member.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-md border py-2 pr-3.5 pl-2 text-sm font-semibold transition-colors ${
                      field.value === member.id
                        ? "border-primary bg-primary/15 text-text-primary"
                        : "border-surface-border bg-surface-2 text-text-muted"
                    }`}
                  >
                    <Avatar
                      initials={getInitials(member.displayName)}
                      colorIndex={member.colorIndex as AvatarColorIndex}
                      size="sm"
                    />
                    {member.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-subtle">{dict.income.category}</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    type="button"
                    accent={category.color}
                    selected={field.value === category.name}
                    onClick={() => field.onChange(category.name)}
                  >
                    {dict.categories.income[category.name as DefaultIncomeCategory] ?? category.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="entryDate"
          render={({ field }) => (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-subtle">{dict.income.date}</p>
              <DatePicker value={field.value} onChange={field.onChange} invalid={!!errors.entryDate} />
              {errors.entryDate ? (
                <p className="mt-2 text-xs font-medium text-danger">{errors.entryDate.message}</p>
              ) : null}
            </div>
          )}
        />

        <Input placeholder={dict.income.notePlaceholder} className="mt-3.5" {...register("note")} />

        <Button type="submit" fullWidth disabled={isSubmitting} className="mt-4">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {entry ? dict.income.saveChanges : dict.income.saveIncome}
        </Button>

        {entry ? (
          <Button
            type="button"
            variant="danger"
            fullWidth
            disabled={isSubmitting}
            onClick={onDelete}
            className="mt-2"
          >
            {dict.income.deleteEntry}
          </Button>
        ) : null}

        {errors.root ? (
          <p className="mt-2 text-center text-xs font-medium text-danger">{errors.root.message}</p>
        ) : null}
      </form>
    </Sheet>
  );
}
