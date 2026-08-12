import { ArrowRight, Check } from "lucide-react";
import { LinkButton } from "@/shared/components/LinkButton";
import { AppPreview } from "@/features/landing/components/AppPreview";
import type { Locale } from "@/shared/lib/i18n/config";
import type { LandingContent } from "@/features/landing/content";

interface LandingHeroProps {
  hero: LandingContent["hero"];
  locale: Locale;
}

export function LandingHero({ hero, locale }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-surface-border">
      <div className="hero-glow pointer-events-none absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-28">
        <div>
          <p className="inline-flex items-center rounded-full border border-surface-border bg-surface-2 px-3 py-1 text-xs font-medium text-primary-muted">
            {hero.eyebrow}
          </p>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {hero.title}{" "}
            <span className="bg-gradient-to-br from-primary-light to-primary-dark bg-clip-text text-transparent">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-tertiary sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/signup">
              {hero.primaryCta}
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="#how-it-works" variant="outline">
              {hero.secondaryCta}
            </LinkButton>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {hero.reassurance.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm text-text-muted">
                <Check className="size-4 text-positive" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AppPreview preview={hero.preview} locale={locale} />
        </div>
      </div>
    </section>
  );
}
