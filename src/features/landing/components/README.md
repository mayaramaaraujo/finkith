# landing/components

Sections of the public marketing page, served both from `/` (language negotiated, `src/app/page.tsx`) and from the per-language URLs `/en`, `/pt-BR` and `/es-ES` (`src/app/[lang]/page.tsx`). All copy — including the page's `<title>`, meta description and keywords — lives in `src/features/landing/content.ts`, keyed by locale, so a section never hardcodes a string; the canonical/`hreflang` set is built in `src/features/landing/metadata.ts`.

- **LandingPage** — the whole page, composed for one locale: redirects signed-in visitors to `/home`/`/setup`, then renders every section below
- **LandingHeader** — sticky top bar: logo, section anchors, Sign in, Get started
- **LandingHero** — headline, sub-copy, CTAs, reassurance list, and the `AppPreview` beside them
- **AppPreview** — a still of the Home screen built from the app's own tokens, dictionary and `formatMoney`, so the mock reads correctly in each locale instead of being a screenshot that goes stale
- **AudienceSection** — couples / flatmates / families cards
- **HowItWorksSection** — the three numbered set-up steps
- **FeaturesSection** — the nine-feature grid
- **FaqSection** — `<details>`-based accordion; answers ship in the HTML so crawlers read them without JS
- **FinalCtaSection** — closing call to action
- **LandingFooter** — tagline, product/legal links, `LanguageSwitcher`, copyright
- **StructuredData** — the Schema.org JSON-LD `@graph` (Organization, WebSite, SoftwareApplication, FAQPage)

`AudienceSection` and `FeaturesSection` pair copy with an icon **by id** (`AUDIENCE_IDS` / `FEATURE_IDS` in `content.ts`): render order comes from those id lists, and TypeScript makes every locale supply exactly the same keys, so nothing can drift out of step.
