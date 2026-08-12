import {
  BellRing,
  Globe,
  HandCoins,
  PieChart,
  Receipt,
  Scale,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { FEATURE_IDS, type FeatureId, type LandingContent } from "@/features/landing/content";

interface FeaturesSectionProps {
  features: LandingContent["features"];
}

const ICONS: Record<FeatureId, LucideIcon> = {
  incomeByPerson: HandCoins,
  bills: Receipt,
  projectedBalance: Scale,
  reminders: BellRing,
  categories: PieChart,
  history: TrendingUp,
  language: Globe,
  install: Smartphone,
  privacy: ShieldCheck,
};

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="border-b border-surface-border">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {features.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-tertiary">
          {features.subtitle}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_IDS.map((id) => {
            const item = features.items[id];
            const Icon = ICONS[id];

            return (
              <article
                key={id}
                className="rounded-2xl border border-surface-border bg-surface-1 p-6 transition-colors hover:bg-surface-2"
              >
                <Icon className="size-5 text-primary-light" />
                <h3 className="mt-4 font-display text-base font-bold text-text-primary">
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
