import type { Metadata } from "next";
import { getLocale } from "@/shared/lib/i18n/server";
import { LegalPageShell } from "@/shared/components/LegalPageShell";
import { privacyContent } from "@/app/privacy/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${privacyContent[locale].title} — Finkith` };
}

export default async function PrivacyPage() {
  const locale = await getLocale();

  return <LegalPageShell {...privacyContent[locale]} locale={locale} />;
}
