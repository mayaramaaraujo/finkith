# shared/components

Design-system primitives shared across features, built on the tokens in `src/app/globals.css`. Import from `@/shared/components` (barrel in `index.ts`).

- **Avatar** — circular initials badge, cycles through the app's 6-color avatar palette (`colorIndex` 0–5)
- **Button** — `primary` / `secondary` / `outline` / `danger` variants, `sm` / `md` sizes
- **LinkButton** — a `next/link` that looks like a `Button`, sharing its variant/size classes. Use it for navigations (CTAs, "Sign in") instead of restyling a link by hand; `Button` is `"use client"` and renders a real `<button>`, so it can't be a link
- **Input** — text input with optional leading icon, `leadingText`, or `trailingText` (currency symbols follow the amount in some locales — ask `formatMoneyParts().symbolFirst` which side to use), `invalid` state
- **Select** — compact native `<select>` styled to match the design tokens (e.g. Settings' Language/Currency rows), value/onChange over a `{ value, label }[]` options list
- **DatePicker** — calendar-popup date field (built on `react-datepicker`), value/onChange in `YYYY-MM-DD`, opens a full-screen portal calendar instead of the native OS date input
- **Chip** — toggleable pill (category/filter selection), `selected` + `accent` props. Re-exports `ChipAccent`, `CHIP_ACCENTS` (the full list of accent tokens, e.g. for a color picker), and `CHIP_ACCENT_BG_CLASSES` (accent → solid `bg-*` class, for dots/swatches — Tailwind needs the full class name statically present, so don't build it via string interpolation) from `@/shared/lib/chip-accents`. **Import those three from `@/shared/lib/chip-accents` directly (not `./Chip`) in any Server Component or Server Action** — `Chip.tsx` is `"use client"`, so a server-side import of its *values* (not types) resolves to an opaque client reference instead of the real value
- **SegmentedControl** — equal-width multi-option track (e.g. Income/Bills/Left)
- **Sheet** — bottom sheet modal (portal, Escape-to-close, backdrop click, scroll lock)
- **BottomNav** — fixed app-shell nav with a center FAB
- **ProgressBar** — thin rounded track with a filled bar (`percent` 0-100, optional `color` override)
- **CategoryBreakdown** — colored dot + name + amount + `ProgressBar` per category, sorted rows with an empty state; feature passes in `title`, `emptyMessage`, `categoryLabel` translator, plus `currency` and `locale` for formatting. Used by History (income) and Bills (paid spend) pages.
- **Switch** — small toggle (track + sliding knob), e.g. the bill sheet's "Repeat every month" row
- **LanguageSwitcher** — `Select` over `LOCALES` (EN / PT-BR / ES-ES), backed by `useTranslation()` from `@/shared/lib/i18n/context`
- **LogoMark** — the Finkith brand mark (wallet + cash + bar chart), rendered from `src/app/icon.svg`. Used by `AuthShell`
- **LegalPageShell** — back link + title/last-updated + section list layout for long-form legal copy, locale-aware. Takes a `LegalPageContent` (`title`, `lastUpdated`, `intro`, `sections`) plus `locale`; used by `/privacy` and `/terms` pages, each sourcing content from their own `content.ts`

**Before adding a new component here or in a feature's `components/` folder, check this list (and the feature's own folder) for something that already does the job.** See the "Reuse before creating" rule in `AGENTS.md`.
