import type { Metadata, Viewport } from "next";
import { getLocale } from "@/shared/lib/i18n/server";
import { landingMetadata } from "@/features/landing/metadata";
import { LandingPage } from "@/features/landing/components/LandingPage";

export async function generateMetadata(): Promise<Metadata> {
  return landingMetadata(await getLocale(), "/");
}

/**
 * The app's own layout locks zoom for a native-app feel; a public page that
 * search engines and screen readers visit has to allow it.
 */
export const viewport: Viewport = {
  maximumScale: 5,
  userScalable: true,
};

/** `/` shows whichever language the visitor asked for; `/{locale}` pins one. */
export default async function RootLandingPage() {
  return <LandingPage locale={await getLocale()} />;
}
