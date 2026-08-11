"use client";

import { forwardRef } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar } from "lucide-react";
import { Input } from "@/shared/components/Input";
import type { Locale } from "@/shared/lib/i18n/config";
import { useTranslation } from "@/shared/lib/i18n/context";

// react-datepicker localizes its calendar through date-fns, and defaults to
// English when nothing is registered — so month and weekday names ignored the
// app's language entirely. Registration is global and idempotent, so doing it
// at module scope covers every instance.
registerLocale("en", enUS);
registerLocale("pt-BR", ptBR);
registerLocale("es-ES", es);

/**
 * Field order differs by locale even though every locale here uses the same
 * separator: en-US is month-first, es-ES and pt-BR are day-first. The stored
 * value is always ISO — this only affects what the read-only input displays.
 */
const DATE_FORMAT: Record<Locale, string> = {
  en: "MM/dd/yyyy",
  "pt-BR": "dd/MM/yyyy",
  "es-ES": "dd/MM/yyyy",
};

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { value, onChange, onBlur, invalid = false, placeholder },
  ref,
) {
  const { locale } = useTranslation();

  return (
    <ReactDatePicker
      selected={parseISODate(value)}
      onChange={(date: Date | null) => date && onChange(toISODate(date))}
      onBlur={onBlur}
      locale={locale}
      dateFormat={DATE_FORMAT[locale]}
      placeholderText={placeholder}
      showPopperArrow={false}
      withPortal
      portalId="date-picker-portal"
      customInput={<Input ref={ref} icon={Calendar} invalid={invalid} readOnly />}
      wrapperClassName="block w-full"
    />
  );
});
