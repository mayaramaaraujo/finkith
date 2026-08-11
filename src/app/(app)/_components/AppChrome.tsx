"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Home, Receipt, History, Settings, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { Sheet } from "@/shared/components/Sheet";
import { BottomNav, type BottomNavItem } from "@/shared/components/BottomNav";
import type { GroupMember } from "@/features/groups/types";
import { BillSheet } from "@/features/bills/components/BillSheet";
import { IncomeSheet } from "@/features/income/components/IncomeSheet";
import { categoriesByType } from "@/features/categories/lib";
import type { Category } from "@/features/categories/types";
import type { Currency } from "@/shared/lib/money";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";
import { useTranslation } from "@/shared/lib/i18n/context";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

type Tab = "home" | "bills" | "history" | "settings";

function navItems(dict: Dictionary): BottomNavItem<Tab>[] {
  return [
    { value: "home", label: dict.nav.home, icon: Home },
    { value: "bills", label: dict.nav.bills, icon: Receipt },
    { value: "history", label: dict.nav.history, icon: History },
    { value: "settings", label: dict.nav.settings, icon: Settings },
  ];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getMonthOptions(intlLocale: string) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString(intlLocale, { month: "short", year: "numeric" });
    return { value, label };
  });
}

interface AppChromeProps {
  groupName: string;
  members: GroupMember[];
  currentMemberId: string;
  currency: Currency;
  categories: Category[];
  children: ReactNode;
}

export function AppChrome({
  groupName,
  members,
  currentMemberId,
  currency,
  categories,
  children,
}: AppChromeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict, locale } = useTranslation();
  const NAV_ITEMS = navItems(dict);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [, startTransition] = useTransition();
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  const activeTab = (NAV_ITEMS.find((item) => pathname.startsWith(`/${item.value}`))?.value ??
    "home") as Tab;

  // Once the new route has actually rendered, activeTab (derived from
  // pathname) already matches pendingTab, so it stops being shown as
  // pending here — no need to explicitly clear the state.
  const displayedPendingTab = pendingTab && pendingTab !== activeTab ? pendingTab : null;

  function navigateTab(tab: Tab) {
    if (tab === activeTab) return;
    setPendingTab(tab);
    startTransition(() => {
      router.push(`/${tab}`);
    });
  }

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const selectedMonth = searchParams.get("month") ?? defaultMonth;
  const monthOptions = getMonthOptions(LOCALE_INTL_TAG[locale]);
  const monthLabel =
    monthOptions.find((m) => m.value === selectedMonth)?.label ??
    monthOptions[0].label;

  function setMonth(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", value);
    router.push(`${pathname}?${params.toString()}`);
    setShowMonthPicker(false);
  }

  function openSheet(sheet: "income" | "bill") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sheet", sheet);
    router.push(`${pathname}?${params.toString()}`);
    setShowAddChoice(false);
  }

  function closeSheet() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sheet");
    router.push(`${pathname}?${params.toString()}`);
  }

  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-linear-to-b from-bg-base from-80% to-transparent px-5 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setShowMonthPicker(true)}
            className="flex items-center gap-1 text-xs text-text-subtle"
          >
            <span>{monthLabel}</span>
            <ChevronDown className="size-3" />
          </button>
          <h2 className="mt-0.5 truncate font-display text-xl font-bold text-text-primary">
            {groupName}
          </h2>
        </div>
        <Link href="/settings" className="flex shrink-0 items-center">
          {visibleMembers.map((member) => (
            <Avatar
              key={member.id}
              initials={getInitials(member.displayName)}
              colorIndex={member.colorIndex as AvatarColorIndex}
              className="not-first:-ml-2 border-2 border-bg-base"
            />
          ))}
          {overflowCount > 0 ? (
            <span className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-bg-base bg-surface-4 font-display text-xs font-bold text-text-primary">
              +{overflowCount}
            </span>
          ) : null}
        </Link>
      </div>

      <main
        className="px-5 pb-28"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
      >
        {children}
      </main>

      <BottomNav
        items={NAV_ITEMS}
        value={activeTab}
        pendingValue={displayedPendingTab}
        onChange={navigateTab}
        onAddClick={() => setShowAddChoice(true)}
        addLabel={dict.nav.add}
      />

      <Sheet open={showMonthPicker} onClose={() => setShowMonthPicker(false)} title={dict.monthPicker.title}>
        <div className="flex max-h-85 flex-col gap-1.5 overflow-y-auto">
          {monthOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMonth(option.value)}
              className={`flex items-center justify-between rounded-md px-3.5 py-3 text-sm font-semibold ${
                option.value === selectedMonth
                  ? "bg-primary/15 text-primary-light"
                  : "text-text-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={showAddChoice} onClose={() => setShowAddChoice(false)}>
        <button
          type="button"
          onClick={() => openSheet("income")}
          className="mb-2.5 flex w-full items-center gap-3.5 rounded-lg border border-surface-border bg-surface-3 p-3.5"
        >
          <span className="flex size-11 items-center justify-center rounded-md bg-primary/15">
            <ArrowUp className="size-5 text-primary-light" />
          </span>
          <span className="font-display text-base font-semibold text-text-primary">{dict.addChoice.addIncome}</span>
        </button>
        <button
          type="button"
          onClick={() => openSheet("bill")}
          className="flex w-full items-center gap-3.5 rounded-lg border border-surface-border bg-surface-3 p-3.5"
        >
          <span className="flex size-11 items-center justify-center rounded-md bg-positive/15">
            <ArrowDown className="size-5 text-positive" />
          </span>
          <span className="font-display text-base font-semibold text-text-primary">{dict.addChoice.addBill}</span>
        </button>
      </Sheet>

      <IncomeSheet
        open={searchParams.get("sheet") === "income"}
        onClose={closeSheet}
        members={members}
        defaultMemberId={currentMemberId}
        currency={currency}
        categories={categoriesByType(categories, "income")}
      />
      <BillSheet
        open={searchParams.get("sheet") === "bill"}
        onClose={closeSheet}
        currency={currency}
        categories={categoriesByType(categories, "bill")}
      />
    </div>
  );
}
