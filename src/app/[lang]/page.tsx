import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "@/shared/lib/i18n/config";
import { landingMetadata, landingPath } from "@/features/landing/metadata";
import { LandingPage } from "@/features/landing/components/LandingPage";

interface LangPageProps {
  params: Promise<{ lang: string }>;
}

/**
 * The per-language landing URLs (`/en`, `/pt-BR`, `/es-ES`). Only these three
 * params exist — anything else 404s rather than falling through to this page,
 * so the segment can sit at the root without swallowing unknown paths.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return landingMetadata(lang, landingPath(lang));
}

/** Matches `/`: the marketing page has to stay zoomable. */
export const viewport: Viewport = {
  maximumScale: 5,
  userScalable: true,
};

export default async function LocalizedLandingPage({ params }: LangPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <LandingPage locale={lang} />;
}
