# Finkith — Product Overview

Shared income/bills tracker for couples and roommates. Group members log what they bring in each month, track shared bills (fixed/variable, paid/pending), and see a combined picture of income, bills, and what's left.

## Status

Design tokens, feature-based architecture skeleton, and the shared design-system primitives (Avatar, Button, Input, Chip, SegmentedControl, Sheet, BottomNav, ProgressBar, Switch — `src/shared/components/`) are in place. See `docs/DESIGN_SYSTEM.md`. Supabase is wired up and the Login/Signup screens + auth session handling are done — see `docs/AUTH.md`. The full data model (groups, group_members, income_entries, bills, RLS) and all four app screens (Home, Bills, History, People) plus the Add Income/Add Bill sheets are built. The app is installable as a PWA on iOS/Android (manifest + generated icons). Known scope gaps: no join-via-invite-link flow yet, and bills' "paid" state is a single flag with no per-month history.

## Implementation docs

Each major implementation has its own writeup in `docs/`:

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — design tokens, feature-based architecture, shared UI primitives.
- [`AUTH.md`](./AUTH.md) — Supabase auth, Login/Signup UI, session handling, route protection.

## Architecture

- **Framework**: Next.js (App Router), React, TypeScript, Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Icons**: [lucide-react](https://lucide.dev/icons/) exclusively — no inline SVG or custom icon components
- **Forms**: `react-hook-form` + `zod` (via `@hookform/resolvers/zod`) — schemas live in each feature's `types.ts`
- **Structure**: feature-based under `src/features/*` (`auth`, `groups`, `income`, `bills`, `dashboard`, `history`), each with `components/`, `hooks/`, `api/`, and a shared constants/types file. Cross-feature primitives live in `src/shared/*`.
- **Backend**: Supabase — auth wired up (`src/shared/lib/supabase/`, `proxy.ts`, `src/app/auth/callback/`); data model (`groups`, `group_members`, `income_entries`, `bills`, all RLS-scoped to group membership) built, see `supabase/migrations/`
- **Deploy**: Vercel (planned)
- **Marketing/SEO**: `/` is the public landing page (`src/app/page.tsx` + `src/features/landing/`), serving whichever of the three languages the visitor asks for and redirecting signed-in visitors to `/home` or `/setup`. Each language also has its own indexable URL — `/en`, `/pt-BR`, `/es-ES` (`src/app/[lang]/page.tsx`) — cross-linked with `hreflang` alternates and listed in the sitemap, with `/` as `x-default`. It ships Schema.org JSON-LD, a generated Open Graph card (`src/app/opengraph-image.tsx`), `robots.ts` and `sitemap.ts`. All absolute URLs come from `NEXT_PUBLIC_SITE_URL` via `src/shared/lib/site.ts`, so that env var has to be set in production.
- **PWA**: manifest (`src/app/manifest.ts`) + generated icons (`src/app/icon.tsx`, `apple-icon.tsx`, `icon-192/`, `icon-512/`, built via `next/og` from the shared `src/shared/lib/logo.tsx` mark) + `appleWebApp`/`viewport` metadata in the root layout

## Roadmap

1. ~~Design tokens + architecture skeleton~~ (done)
2. ~~Shared design-system primitives (Button, Input, Sheet, Chip, Avatar, SegmentedControl, BottomNav, ProgressBar, Switch)~~ (done)
3. ~~Login/Signup screens + Supabase auth (session handling, route protection)~~ (done — Google OAuth was tried and removed, see `docs/AUTH.md`)
4. ~~Screens: Group setup → Home / Bills / History / People~~ (done)
5. ~~Supabase data model (groups, members, income, bills)~~ (done)
6. ~~PWA manifest + installable icons~~ (done)
7. ~~Public landing page at `/` with SEO metadata, JSON-LD, sitemap and robots~~ (done)
8. Vercel deploy
9. Join-via-invite-link flow (accepting an `invited_email` member row once that person signs up)

Update this file whenever a branch changes architecture, features, or this roadmap.
