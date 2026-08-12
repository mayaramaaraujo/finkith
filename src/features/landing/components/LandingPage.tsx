import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import type { Locale } from "@/shared/lib/i18n/config";
import { landingContent } from "@/features/landing/content";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { AudienceSection } from "@/features/landing/components/AudienceSection";
import { HowItWorksSection } from "@/features/landing/components/HowItWorksSection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { FaqSection } from "@/features/landing/components/FaqSection";
import { FinalCtaSection } from "@/features/landing/components/FinalCtaSection";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { StructuredData } from "@/features/landing/components/StructuredData";

interface LandingPageProps {
  locale: Locale;
}

/** The whole marketing page, shared by `/` and the per-language `/{locale}` URLs. */
export async function LandingPage({ locale }: LandingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-in visitors have no use for the pitch — send them where they left off.
  if (user) {
    redirect((await getCurrentGroup(user)) ? "/home" : "/setup");
  }

  const content = landingContent[locale];

  return (
    <>
      <StructuredData content={content} locale={locale} />
      <LandingHeader nav={content.nav} />
      <main className="flex-1">
        <LandingHero hero={content.hero} locale={locale} />
        <AudienceSection audience={content.audience} />
        <HowItWorksSection howItWorks={content.howItWorks} />
        <FeaturesSection features={content.features} />
        <FaqSection faq={content.faq} />
        <FinalCtaSection finalCta={content.finalCta} />
      </main>
      <LandingFooter footer={content.footer} nav={content.nav} locale={locale} />
    </>
  );
}
