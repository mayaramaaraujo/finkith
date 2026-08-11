import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalPageContent } from "@/app/privacy/content";
import type { Locale } from "@/shared/lib/i18n/config";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

interface LegalPageShellProps extends LegalPageContent {
  locale: Locale;
}

export function LegalPageShell({ title, lastUpdated, intro, sections, locale }: LegalPageShellProps) {
  return (
    <div
      className="flex flex-1 flex-col px-8 pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 2rem)" }}
    >
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-text-subtle transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="size-4" />
        {getDictionary(locale).common.back}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-text-primary">{title}</h1>
      <p className="mt-1 text-xs text-text-faintest">{lastUpdated}</p>
      <p className="mt-4 text-sm leading-relaxed text-text-subtle">{intro}</p>

      <div className="mt-8 flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-semibold text-text-primary">{section.heading}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-text-subtle">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
