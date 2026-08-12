import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/shared/components/LinkButton";
import type { LandingContent } from "@/features/landing/content";

interface FinalCtaSectionProps {
  finalCta: LandingContent["finalCta"];
}

export function FinalCtaSection({ finalCta }: FinalCtaSectionProps) {
  return (
    <section className="border-b border-surface-border">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-br from-bg-hero-from via-bg-hero-via to-bg-hero-to px-6 py-14 text-center sm:px-12">
          <div className="hero-glow pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-tertiary">
              {finalCta.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href="/signup" fullWidthOnMobile>
                {finalCta.cta}
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/login" variant="outline" fullWidthOnMobile>
                {finalCta.secondary}
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
