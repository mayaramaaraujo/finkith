import type { Metadata } from "next";
import { LOCALES, LOCALE_INTL_TAG, type Locale } from "@/shared/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/shared/lib/site";
import { landingContent } from "@/features/landing/content";

/** The indexable URL for each language. `/` itself negotiates and is x-default. */
export function landingPath(locale: Locale) {
  return `/${locale}`;
}

const LANGUAGE_ALTERNATES = {
  ...Object.fromEntries(LOCALES.map((locale) => [locale, landingPath(locale)])),
  "x-default": "/",
};

/**
 * Metadata for one language of the landing page. `canonical` differs per route:
 * `/` is the negotiated entry point, `/en`, `/pt-BR` and `/es-ES` are the stable
 * per-language URLs a crawler can index, and every one of them declares the
 * whole set as `hreflang` alternates so no translation is stranded.
 */
export function landingMetadata(locale: Locale, canonical: string): Metadata {
  const content = landingContent[locale];

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical, languages: LANGUAGE_ALTERNATES },
    openGraph: {
      type: "website",
      url: canonical === "/" ? SITE_URL : `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      title: content.metaTitle,
      description: content.metaDescription,
      locale: LOCALE_INTL_TAG[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}
