import { SITE_NAME, SITE_URL } from "@/shared/lib/site";
import { LOCALE_INTL_TAG, type Locale } from "@/shared/lib/i18n/config";
import { CURRENCIES } from "@/shared/lib/money";
import { FEATURE_IDS, type LandingContent } from "@/features/landing/content";

interface StructuredDataProps {
  content: LandingContent;
  locale: Locale;
}

/**
 * Schema.org JSON-LD for the landing page: what the product is, that it's free,
 * and the FAQ answers as rich-result candidates. Kept as one `@graph` so the
 * nodes can reference each other by `@id` instead of repeating themselves.
 */
export function StructuredData({ content, locale }: StructuredDataProps) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: content.metaDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: LOCALE_INTL_TAG[locale],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        description: content.metaDescription,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web, iOS, Android",
        browserRequirements: "Requires JavaScript and a modern browser",
        inLanguage: Object.values(LOCALE_INTL_TAG),
        featureList: FEATURE_IDS.map((id) => content.features.items[id].title),
        screenshot: `${SITE_URL}/opengraph-image`,
        publisher: { "@id": `${SITE_URL}/#organization` },
        offers: CURRENCIES.map((currency) => ({
          "@type": "Offer",
          price: "0",
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: LOCALE_INTL_TAG[locale],
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The payload is our own static copy, but `<` still has to be escaped so a
      // future translation can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
