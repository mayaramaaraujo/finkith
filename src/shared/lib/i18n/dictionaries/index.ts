import type { Locale } from "@/shared/lib/i18n/config";
import { en, type Dictionary } from "@/shared/lib/i18n/dictionaries/en";
import { esES } from "@/shared/lib/i18n/dictionaries/es-ES";
import { ptBR } from "@/shared/lib/i18n/dictionaries/pt-BR";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "pt-BR": ptBR,
  "es-ES": esES,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
