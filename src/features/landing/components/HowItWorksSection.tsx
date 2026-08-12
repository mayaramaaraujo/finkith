import type { LandingContent } from "@/features/landing/content";

interface HowItWorksSectionProps {
  howItWorks: LandingContent["howItWorks"];
}

export function HowItWorksSection({ howItWorks }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="border-b border-surface-border bg-bg-elevated">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {howItWorks.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-tertiary">
          {howItWorks.subtitle}
        </p>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-surface-border bg-surface-2 p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark font-display text-sm font-bold text-text-primary">
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-subtle">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
