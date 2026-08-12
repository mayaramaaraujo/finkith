import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/lib/site";
import { LOCALES } from "@/shared/lib/i18n/config";
import { landingPath } from "@/features/landing/metadata";

/** Only the pages a logged-out visitor can actually reach and read. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}${landingPath(locale)}`]),
  );

  return [
    // The landing page once per language, each pointing at all the others so a
    // crawler that finds one translation can reach the rest.
    ...LOCALES.map((locale) => ({
      url: `${SITE_URL}${landingPath(locale)}`,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: { languages: { ...languages, "x-default": `${SITE_URL}/` } },
    })),
    { url: `${SITE_URL}/signup`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
