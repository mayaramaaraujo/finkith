"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { CHIP_ACCENT_BG_CLASSES } from "@/shared/components/Chip";
import { deleteCategory } from "@/features/categories/api/actions";
import { categoriesByType } from "@/features/categories/lib";
import type { Category, CategoryType } from "@/features/categories/types";
import type { DefaultBillCategory } from "@/features/bills/types";
import type { DefaultIncomeCategory } from "@/features/income/types";
import { AddCategoryForm } from "@/features/categories/components/AddCategoryForm";
import { useTranslation } from "@/shared/lib/i18n/context";

interface ManageCategoriesSectionProps {
  categories: Category[];
}

export function ManageCategoriesSection({ categories }: ManageCategoriesSectionProps) {
  const { dict } = useTranslation();
  const [type, setType] = useState<CategoryType>("bill");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [, startTransition] = useTransition();

  const visible = categoriesByType(categories, type);

  function categoryLabel(category: Category) {
    if (category.type === "bill") {
      return dict.categories.bill[category.name as DefaultBillCategory] ?? category.name;
    }
    return dict.categories.income[category.name as DefaultIncomeCategory] ?? category.name;
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) setError(result.error);
      setDeletingId(null);
    });
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-text-primary">{dict.settings.categories}</p>
        <button
          type="button"
          aria-label={dict.settings.addCategory}
          onClick={() => setAddOpen(true)}
          className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-text-icon transition-colors hover:text-text-primary"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <SegmentedControl<CategoryType>
        value={type}
        onChange={setType}
        options={[
          { value: "bill", label: dict.settings.billCategories },
          { value: "income", label: dict.settings.incomeCategories },
        ]}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {visible.length === 0 ? (
          <p className="text-xs text-text-subtle">{dict.settings.noCategoriesYet}</p>
        ) : (
          visible.map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-1.5 rounded-sm border border-surface-border bg-surface-2 py-2 pr-2 pl-3 text-xs font-semibold text-text-muted"
            >
              <span className={`size-2 shrink-0 rounded-full ${CHIP_ACCENT_BG_CLASSES[category.color]}`} />
              {categoryLabel(category)}
              <button
                type="button"
                aria-label={dict.settings.deleteCategory}
                disabled={deletingId === category.id}
                onClick={() => handleDelete(category.id)}
                className="text-text-faint transition-colors hover:text-danger disabled:opacity-40"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}

      <AddCategoryForm
        type={type}
        usedColors={visible.map((category) => category.color)}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
