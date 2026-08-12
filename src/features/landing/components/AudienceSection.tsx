import { Heart, Home, Users, type LucideIcon } from "lucide-react";
import { AUDIENCE_IDS, type AudienceId, type LandingContent } from "@/features/landing/content";

interface AudienceSectionProps {
  audience: LandingContent["audience"];
}

const ICONS: Record<AudienceId, LucideIcon> = {
  couples: Heart,
  flatmates: Home,
  families: Users,
};

export function AudienceSection({ audience }: AudienceSectionProps) {
  return (
    <section id="who-its-for" className="border-b border-surface-border">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {audience.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-tertiary">
          {audience.subtitle}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {AUDIENCE_IDS.map((id) => {
            const item = audience.items[id];
            const Icon = ICONS[id];

            return (
              <article
                key={id}
                className="rounded-2xl border border-surface-border bg-surface-1 p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="size-5 text-primary-light" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-subtle">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
