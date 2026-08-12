import { Plus } from "lucide-react";
import type { LandingContent } from "@/features/landing/content";

interface FaqSectionProps {
  faq: LandingContent["faq"];
}

/**
 * Built on `<details>` so every answer is in the HTML a crawler receives —
 * collapsed, but never behind client-side JavaScript — and matches the
 * FAQPage structured data emitted alongside it.
 */
export function FaqSection({ faq }: FaqSectionProps) {
  return (
    <section id="faq" className="border-b border-surface-border bg-bg-elevated">
      <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {faq.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-tertiary">{faq.subtitle}</p>

        <div className="mt-10 flex flex-col gap-3">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-surface-border bg-surface-2 px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary marker:hidden">
                <h3 className="text-base font-semibold">{item.question}</h3>
                <Plus className="size-4 shrink-0 text-text-icon transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-text-subtle">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
