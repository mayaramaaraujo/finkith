import type { Metadata } from "next";
import { getLocale } from "@/shared/lib/i18n/server";
import { LegalPageShell } from "@/shared/components/LegalPageShell";
import { termsContent } from "@/app/terms/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${termsContent[locale].title} — Finkith` };
}

export default async function TermsPage() {
  const locale = await getLocale();

  return <LegalPageShell {...termsContent[locale]} locale={locale} />;
}
