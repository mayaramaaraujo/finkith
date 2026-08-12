import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything below is either behind auth, a one-off invite, or a machine
      // endpoint — nothing a search result should ever point at.
      disallow: ["/home", "/bills", "/history", "/settings", "/setup", "/join/", "/auth/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
