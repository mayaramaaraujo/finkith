import Link from "next/link";
import { LogoMark } from "@/shared/components/LogoMark";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { SITE_NAME } from "@/shared/lib/site";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import type { Locale } from "@/shared/lib/i18n/config";
import type { LandingContent } from "@/features/landing/content";

interface LandingFooterProps {
  footer: LandingContent["footer"];
  nav: LandingContent["nav"];
  locale: Locale;
}

export function LandingFooter({ footer, nav, locale }: LandingFooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8 rounded-lg" />
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              {SITE_NAME}
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-subtle">{footer.tagline}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-text-primary">
            {footer.productHeading}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-text-subtle">
            <li>
              <a href="#features" className="transition-colors hover:text-text-primary">
                {nav.features}
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="transition-colors hover:text-text-primary">
                {nav.howItWorks}
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-text-primary">
                {nav.faq}
              </a>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-text-primary">
                {nav.signIn}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-text-primary">
            {footer.legalHeading}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-text-subtle">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text-primary">
                {dict.auth.termsNotice.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-text-primary">
                {dict.auth.termsNotice.terms}
              </Link>
            </li>
          </ul>

          <h2 className="mt-6 font-display text-sm font-semibold text-text-primary">
            {footer.languageHeading}
          </h2>
          <div className="mt-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <p className="mt-12 border-t border-surface-border pt-6 text-xs text-text-faintest">
        © {new Date().getFullYear()} {SITE_NAME}. {footer.rights}
      </p>
    </footer>
  );
}
