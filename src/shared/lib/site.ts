/**
 * The canonical origin of the deployed site. Every absolute URL search engines
 * and social crawlers see — canonical link, sitemap entries, OG image, JSON-LD
 * — is built from this, so it has to be the real production domain rather than
 * whatever preview URL the request happened to arrive on.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://finkith.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Finkith";
