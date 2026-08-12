# Finkith — React Native App Specification

**Audience:** the developer building the native app.
**Source of truth for behaviour:** the existing Next.js web app in this repo (`src/`) and the Supabase migrations in `supabase/migrations/`.
**Scope:** a full rewrite of the client as a React Native app. **The backend does not change shape** — same Supabase project, same tables, same RLS policies, same RPCs. The one exception is push notifications (see §9), which must move off Web Push.

---

## 1. What the product is

Finkith is a **shared household budget tracker**. A user creates or joins exactly one **group**. Everyone in the group sees the same pooled data:

- **Income entries** — attributed to a specific group member, categorised, dated.
- **Bills** — group-level (not per-member), with a day-of-month due day, fixed/variable flag, optional monthly repeat, and a paid toggle.
- A **home dashboard** summarising income vs. bills for a selected month.
- A **history** view charting the last six months of income.
- **Settings** — invite link, member list, currency, language, custom categories, push notification toggle, logout, delete account.

Everything is scoped to one month at a time, chosen from a header month picker (current month plus the previous five).

### 1.1 Non-obvious domain rules

These are load-bearing and easy to get wrong. Read them before writing any feature code.

| Rule | Detail |
|---|---|
| **One group per user** | `join_group_by_code` raises if the user already has an active membership. `getCurrentGroup` assumes at most one row. There is no group switcher. |
| **Bill "paid" is per cycle** | For `repeat_monthly` bills, paid-ness is derived from whether `paid_at` falls in the month being viewed — there is no monthly reset job. `isPaidInCycle(bill, month)` in `src/features/bills/lib.ts` is the single source of truth; nothing may read the raw `paid` column to decide this. Port it verbatim. |
| **Bill month scoping** | A bill appears in month `M` if `repeat_monthly = true` **or** `cycle_month = M`. `cycle_month` is a `YYYY-MM` text column defaulting to the creation month. |
| **Due day is clamped** | `due_day` can be 31; the effective due date is `min(due_day, days_in_month)`. |
| **Due status** | `overdue` if unpaid and past due; `due-soon` if unpaid and within 3 days; else `upcoming`. Paid-this-cycle always renders as `upcoming`. |
| **Categories are per group, plain text on rows** | `bills.category` / `income_entries.category` store the category *name* as text with no FK, so deleting or renaming a category never rewrites history. The `categories` table only drives the picker and the colour. |
| **Default category names are English literals** | Seeded as `Housing`, `Salary`, etc. The UI translates them by lookup (`dict.categories.bill[name] ?? name`); user-created categories fall through untranslated. Keep this behaviour. |
| **Currency is per group** | `groups.currency`, constrained to `EUR` or `BRL`. |
| **Language is per user** | Stored in `auth.users.user_metadata.locale`, written at signup and refreshed by the language switcher. The cron job reads it to localise reminders. |
| **Money is parsed and formatted per locale** | `1.234,56` is valid input in pt-BR/es-ES and invalid in en. Port `src/shared/lib/money.ts` as-is; it has a test file (`money.test.ts`) — port that too. |
| **Security boundary is RLS, not app code** | The web server actions do not re-check group ownership on update/delete; Postgres policies do. The RN client talks to the same policies with the same anon key, so this holds — **do not** add a service-role key to the app. |

---

## 2. Findings from the review of the existing web codebase

The web app is largely AI-generated and mostly coherent. The review found eleven issues; **the defects and dead code have since been fixed on the web side**, so the RN app should port the corrected logic. They are listed here because each one is a trap worth knowing about while porting.

### Fixed — port the corrected behaviour

| # | Was | Now |
|---|---|---|
| 1 | `computeHero` counted "bills paid" from the raw `paid` column while the Bills screen used the per-cycle derivation, so a repeating bill paid in any past month inflated **Available today** every month after. `buildBillActivity` had the same mistake in its paid/pending label. | A single `isPaidInCycle(bill, month)` in `src/features/bills/lib.ts` is the only way any screen asks whether a bill is paid. Covered by `lib.test.ts`. |
| 2 | `toggleBillPaid` always wrote `paid_at = now()`, so ticking a bill while viewing August marked it paid for the current month; the edit sheet's Paid switch showed the raw flag, so a bill paid in June looked paid in July. | The viewed month is threaded into the sheet, the toggle and the actions. `paidAtFor(month)` writes a timestamp inside that month (midday on the 15th for past months, so it stays in-month in every timezone), and the switch reflects `isPaidInCycle` for the month on screen. |
| 3 | `addBill` never set `cycle_month`, so a one-off bill added while viewing another month landed in the current one and vanished from the screen that created it. | `addBill`/`updateBill` take the viewed month and set `cycle_month` explicitly, validated against the same `^\d{4}-\d{2}$` shape as the DB constraint. |
| 4 | Invite-by-email was half-built: `group_members.invited_email`, `status = 'invited'`, an RLS insert policy existing only for it, `resend.ts`, the `resend` dependency, and unreachable "Invited" branches in the members list. | Removed. Migration `0011_drop_email_invites.sql` drops the column, the dead status value and the insert policy — no insert policy replaces it, since both membership paths are security-definer RPCs that bypass RLS. Invites are link-only. |
| 5 | "Forgot password" was static text with no handler. | The dead affordance is gone. **The RN app should implement the real flow** (`auth.resetPasswordForEmail` + a deep-linked reset screen) rather than reinstate the text. |
| 9 | The cron inserted into `bill_reminders_sent` before sending, so a failed send — or a user with no subscription yet — suppressed that reminder for the rest of the cycle. | The row is still claimed first (it is what enforces at-most-once), but released again when nothing was delivered, so the next daily run retries. |

### Still open — decide before or during the port

| # | Finding |
|---|---|
| 6 | The History screen charts **income only** while its copy reads generically. Label it explicitly in RN, or extend it to bills. |
| 7 | `income_entries` RLS is `for all using (is_active_group_member(group_id))` — any member can edit or delete another member's income entry. Reasonable for a household, but confirm the intent; if it is not wanted, tighten the policy before launch. |
| 8 | `delete_own_account()` deletes every group the user *created*, cascading away all its members' data, with no ownership handoff. The RN confirmation dialog must say so in plain language. |
| 10 | No pagination anywhere. Fine at household scale; add `.range()` if a group ever grows. |
| 11 | **Blocker for RN:** the reminder cron sends Web Push via VAPID, which native apps cannot receive. See §9. |
| — | The Bills screen ignores the header month picker and always renders the current month, while Home and History honour it. Picking July leaves the Bills tab on August. Decide whether Bills becomes month-aware or the picker is hidden on that tab. |

---

## 3. Target stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Expo (SDK 54+) with expo-router** | File-based routing maps cleanly onto the web app's route structure. |
| Language | TypeScript, strict | |
| Backend client | `@supabase/supabase-js` v2 | With `AsyncStorage` (or `expo-secure-store`) as the auth storage adapter, `autoRefreshToken: true`, `detectSessionInUrl: false`. |
| Server data | **TanStack Query** | Replaces Next.js server components + `revalidatePath`. One query key per resource, invalidated on mutation. |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers/zod` | Same schemas as web — port `types.ts` from each feature unchanged. |
| Styling | **NativeWind v4** | Lets the Tailwind token names in §4 carry over. A plain `StyleSheet` theme object is an acceptable alternative; do not mix both. |
| Icons | `lucide-react-native` | Same icon names as web. |
| i18n | `i18n-js` or a plain dictionary module | Port `src/shared/lib/i18n/dictionaries/*` verbatim; they are plain TS objects with function-valued entries for interpolation. |
| Dates | `date-fns` | Already a dependency on web. |
| Push | `expo-notifications` + Expo Push Service | See §9. |
| Deep links | `expo-linking` | Scheme `finkith://` + universal/app links on `finkith.com`. |
| Build/release | EAS Build + EAS Submit | |

---

## 4. Design system

Port the tokens from `src/app/globals.css` exactly. The app is **dark-only** — there is no light theme; do not add one.

**Backgrounds:** `bg-base #131120`, `bg-elevated`/`bg-sheet #1a1726`. Hero gradient `#2a1d35 → #1c1628 → #181322`. Page gradient `#241a3a → #16121f → #0c0a12`.

**Text ramp:** `primary #ffffff`, `secondary #e7e4f0`, `tertiary #cfccdd`, `muted #9a97ad`, `subtle #8d8aa3`, `faint #7c7991`, `dim #6b6880`, `faintest #56536a`, `icon #b6b3c9`.

**Brand:** `primary #c264af`, `primary-dark #9c4f8f`, `primary-darker #8a3f7d`, `primary-light #d27cc0`, `primary-muted #c6a9d4`.

**Semantic:** `positive #6fd4ce`, `positive-dark #56c6c0`, `warning #e0a458`, `warning-dark #e0b85a`, `danger #e08a8a`, `violet #9b8cf0`, `violet-dark #7d7bd6`, `neutral-accent #7f8b95`.

**Avatar/category cycle (6):** `#e88aa0`, `#8ad6a0`, `#88b6e8`, `#e0b85a`, `#9b8cf0`, `#6fd4ce`. `group_members.color_index` is `0..5` and indexes this list.

**Surfaces:** white at 3% / 5% / 7% / 9% opacity; border at 8%.

**Radii:** xs 8, sm 11, md 13, lg 15, xl 18, 2xl 22, 3xl 26.

**Glow shadows:** primary `0 16px 34px -12px rgba(194,100,175,.7)`; positive `0 16px 34px -12px rgba(111,212,206,.5)`. On Android use `elevation` + a tinted background; the coloured glow will not reproduce exactly — approximate, don't fight it.

**Fonts:** display = Sora (bold/semibold headings, money figures), body = Manrope. Load via `expo-font`.

**Chip accents:** the 12 named accents in `src/shared/lib/chip-accents.ts` (`primary`, `positive`, `positive-dark`, `warning`, `violet`, `neutral-accent`, `avatar-1..5`, `neutral`). `categories.color` stores one of these names. Port the list as the single source of truth — a category's colour is *always* looked up from it, never hardcoded per screen.

**Motion:** sheets slide up 300ms `cubic-bezier(.2,.8,.2,1)`; backdrop fades in 250ms. Use a native bottom-sheet library (`@gorhom/bottom-sheet`) rather than reimplementing.

---

## 5. Database schema (unchanged)

All tables are in `public`, all have RLS enabled, all financial tables are scoped by `group_id` through `public.is_active_group_member(group_id)`.

### `groups`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `name` | text NOT NULL | |
| `invite_code` | text NOT NULL UNIQUE | 8 hex chars, generated server-side |
| `created_by` | uuid → `auth.users(id)` ON DELETE CASCADE | |
| `currency` | text NOT NULL DEFAULT `'EUR'` | CHECK in (`EUR`, `BRL`) |
| `created_at` | timestamptz | |

*RLS:* select/update require active membership; insert requires `created_by = auth.uid()`.

### `group_members`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | This is the id income entries reference — **not** `user_id` |
| `group_id` | uuid → `groups(id)` CASCADE | |
| `user_id` | uuid → `auth.users(id)` CASCADE, nullable | |
| `display_name` | text NOT NULL | |
| `role` | text | `admin` \| `member` |
| `color_index` | smallint 0–5 | `member_count % 6` at join time |
| `status` | text | `active` only, post-`0011`. Kept because the RLS helpers and every membership query filter on it |
| `created_at` | timestamptz | |
| | | UNIQUE `(group_id, user_id)` |

*RLS (post-`0011`):* **no insert policy** — memberships are only ever created by `create_group_with_owner` and `join_group_by_code`, which are security definer and bypass RLS, so a client insert is never legitimate. Update allowed for admins, or for your own row **provided `role` stays `member` and `status` stays `active`** (this is what stops self-promotion). Delete for admins or self.

### `income_entries`
`id` uuid PK · `group_id` → groups CASCADE · `member_id` → `group_members(id)` CASCADE · `category` text · `amount` numeric(10,2) CHECK > 0 · `note` text nullable · `entry_date` date DEFAULT current_date · `created_at`.

### `bills`
`id` uuid PK · `group_id` → groups CASCADE · `name` text · `category` text · `amount` numeric(10,2) CHECK > 0 · `due_day` smallint CHECK 1–31 · `fixed` bool DEFAULT true · `paid` bool DEFAULT false · `paid_at` timestamptz nullable · `repeat_monthly` bool DEFAULT true · `cycle_month` text NOT NULL DEFAULT `to_char(now(),'YYYY-MM')` CHECK `^\d{4}-\d{2}$` · `created_at`.

> Note there is **no `member_id` on bills** — bills belong to the group, not a person. There is no split/settle-up logic in the product.

### `categories`
`id` uuid PK · `group_id` → groups CASCADE · `type` text CHECK in (`bill`,`income`) · `name` text · `color` text (a chip accent name) · `created_at` · UNIQUE `(group_id, type, name)`.

Seeded per group by `create_group_with_owner`: bills = Housing/Utilities/Insurance/Subscriptions/Groceries/Fuel/Other; income = Salary/Freelance/Bonus/Part-time/Gift/Other.

### `push_subscriptions`
`id` uuid PK · `user_id` → auth.users CASCADE · `endpoint` text UNIQUE · `p256dh` text · `auth` text · `created_at`. RLS: own rows only.
**→ needs a migration for native tokens; see §9.**

### `bill_reminders_sent`
`id` uuid PK · `bill_id` → bills CASCADE · `user_id` → auth.users CASCADE · `cycle_month` date · `reminder_type` CHECK in (`due-soon`,`overdue`) · `sent_at` · UNIQUE `(bill_id, user_id, cycle_month, reminder_type)`. Written only by the cron via service-role; users can select their own.

### Postgres functions (all `security definer`)
| Function | Grant | Purpose |
|---|---|---|
| `is_active_group_member(uuid) → bool` | internal | RLS helper, avoids policy recursion |
| `is_group_admin(uuid) → bool` | internal | RLS helper |
| `create_group_with_owner(p_name, p_display_name) → groups` | authenticated | Atomically creates group + owner membership + 13 seed categories |
| `join_group_by_code(p_invite_code, p_display_name) → void` | authenticated | Validates code, rejects if already in a group, derives `color_index` |
| `get_group_by_invite_code(p_invite_code) → (id, name)` | **anon** + authenticated | The only unauthenticated read of `groups`; returns name only |
| `delete_own_account() → void` | authenticated | Deletes owned groups, memberships, then the auth user |

---

## 6. API surface

The web app has **no REST API of its own** except the cron route — it talks to Supabase directly via `supabase-js` and Next.js server actions. The RN app does the same, with the anon key and the user's JWT. Below, each operation is given both as the `supabase-js` call to write and as the underlying PostgREST/GoTrue request, for reference and for debugging with `curl`.

Base URL: `https://<project-ref>.supabase.co`. Every request carries `apikey: <anon key>` and `Authorization: Bearer <access_token>`.

### 6.1 Auth (GoTrue, `/auth/v1`)

| Operation | supabase-js | HTTP |
|---|---|---|
| Sign up | `auth.signUp({ email, password, options: { data: { full_name, locale }, emailRedirectTo } })` | `POST /auth/v1/signup` |
| Sign in | `auth.signInWithPassword({ email, password })` | `POST /auth/v1/token?grant_type=password` |
| Refresh | automatic | `POST /auth/v1/token?grant_type=refresh_token` |
| Sign out | `auth.signOut()` | `POST /auth/v1/logout` |
| Current user | `auth.getUser()` | `GET /auth/v1/user` |
| Update locale metadata | `auth.updateUser({ data: { locale } })` | `PUT /auth/v1/user` |
| Password reset *(new, finding #5)* | `auth.resetPasswordForEmail(email, { redirectTo })` | `POST /auth/v1/recover` |

Email confirmation is **required**: `signUp` returns no session. The confirmation link must deep-link back into the app (§7.3).

### 6.2 Data (PostgREST, `/rest/v1`)

`{gid}` = current group id. `{month}` = `YYYY-MM`. `{start}`/`{end}` = first day of month and first day of next month, ISO `YYYY-MM-DD`.

**Bootstrap — current group** (call once after auth; every screen depends on it):
```
GET /rest/v1/group_members?select=id,role,groups(id,name,currency)&user_id=eq.{uid}&status=eq.active
```
Returns `{ groupId, groupName, memberId, role, currency }` or null → route to onboarding.

**Group members**
```
GET  /rest/v1/group_members?select=id,group_id,user_id,invited_email,display_name,role,color_index,status,created_at
       &group_id=eq.{gid}&status=eq.active&order=created_at.asc
PATCH /rest/v1/group_members?id=eq.{id}          # display_name; role/status only if admin
DELETE /rest/v1/group_members?id=eq.{id}         # admin, or self (leave group)
```

**Group**
```
GET   /rest/v1/groups?select=invite_code&id=eq.{gid}
PATCH /rest/v1/groups?id=eq.{gid}                # { currency }
```

**Income entries**
```
GET    /rest/v1/income_entries?select=id,group_id,member_id,category,amount,note,entry_date,created_at
         &group_id=eq.{gid}&entry_date=gte.{start}&entry_date=lt.{end}&order=entry_date.desc
POST   /rest/v1/income_entries    # { group_id, member_id, category, amount, entry_date, note }
PATCH  /rest/v1/income_entries?id=eq.{id}
DELETE /rest/v1/income_entries?id=eq.{id}
```
History range query (6 months, aggregate client-side):
```
GET /rest/v1/income_entries?select=category,amount,entry_date&group_id=eq.{gid}
      &entry_date=gte.{sixMonthsStart}&entry_date=lt.{end}
```

**Bills**
```
GET    /rest/v1/bills?select=id,group_id,name,category,amount,due_day,fixed,paid,paid_at,repeat_monthly,cycle_month,created_at
         &group_id=eq.{gid}&or=(repeat_monthly.eq.true,cycle_month.eq.{month})&order=due_day.asc
POST   /rest/v1/bills   # { group_id, name, category, amount, due_day, fixed, repeat_monthly, cycle_month, paid, paid_at }
PATCH  /rest/v1/bills?id=eq.{id}
DELETE /rest/v1/bills?id=eq.{id}
```
`paid_at` is set to `now()` when `paid` flips true, and `null` when false.

**Categories**
```
GET    /rest/v1/categories?select=id,group_id,type,name,color,created_at&group_id=eq.{gid}
POST   /rest/v1/categories   # { group_id, type, name, color }
DELETE /rest/v1/categories?id=eq.{id}
```

**Push subscriptions** — see §9; shape changes for native.

### 6.3 RPC (`POST /rest/v1/rpc/<fn>`)

| Endpoint | Body | Auth |
|---|---|---|
| `/rpc/create_group_with_owner` | `{ p_name, p_display_name }` | authenticated |
| `/rpc/join_group_by_code` | `{ p_invite_code, p_display_name }` | authenticated |
| `/rpc/get_group_by_invite_code` | `{ p_invite_code }` | **anon** ok |
| `/rpc/delete_own_account` | `{}` | authenticated |

`p_display_name` is derived client-side from `user_metadata.full_name ?? name`, falling back to the capitalised email local-part (port `deriveDisplayName` from `src/features/groups/api/actions.ts`).

### 6.4 Server-side cron (unchanged path, changed transport)

`GET /api/cron/bill-reminders` on the Next.js deployment, scheduled `0 12 * * *` by `vercel.json`, authorised by `Authorization: Bearer $CRON_SECRET`. It uses the **service-role key**. Rewrite its send step for native push (§9); leave the scheduling, the `bill_reminders_sent` dedupe key, and the locale lookup as they are.

### 6.5 Error handling

PostgREST returns `{ code, message, details, hint }`. Two Postgres exceptions are surfaced to users verbatim by the web app and should be caught and **translated** in RN instead:
- `You're already in a group` (from `join_group_by_code`)
- `Invalid or expired invite link` (same)

A `23505` unique violation on `categories` means the category name already exists for that type.

---

## 7. Navigation & routing

```
app/
  (auth)/          login · signup · forgot-password · reset-password
  onboarding/      setup (create or join)
  join/[code]      invite landing (works signed-out)
  (tabs)/
    home           dashboard
    bills
    history
    settings
  _layout.tsx      session + current-group gate
```

**Gate logic** (mirrors `src/proxy.ts` + the layout redirects):

1. No session → `(auth)/login`, preserving a `next` target for invite links.
2. Session but `getCurrentGroup()` is null → `onboarding/setup`.
3. Otherwise → `(tabs)/home`.

**Tabs:** Home, Bills, `+` (centre FAB, not a route), History, Settings. The FAB opens an action sheet with "Add income" / "Add bill", which opens the corresponding form sheet. On web the sheet state lives in the URL (`?sheet=income`); in RN use local state or a modal route — do not replicate the query-param mechanism.

**Header** (persistent across tabs): month picker button (current + previous 5 months, `MMM yyyy` in the user's locale) on the left above the group name; a stack of up to 3 member avatars (+N overflow) on the right, tapping through to Settings.

**Deep links** — register scheme `finkith://` and universal/app links for `https://finkith.com`:
| Link | Behaviour |
|---|---|
| `/join/{code}` | Signed-out → invite screen showing the group name (via the anon RPC) with Sign in / Create account, both carrying `next`. Signed-in and already in a group → Home. Signed-in with no group → join confirmation card. |
| `/auth/callback?code=…` | Exchange the code for a session (`auth.exchangeCodeForSession`), then honour `next`, else Home. |
| password reset link | Route to `reset-password`. |

Only same-origin/relative `next` values are honoured (`startsWith("/") && !startsWith("//")`).

---

## 8. Milestones

Each milestone is independently demoable. Estimates assume one developer.

---

### M0 — Backend deltas & project setup · ~3 days

**Backend (do first, in `supabase/migrations/`):**
1. `0012_native_push_tokens.sql` — see §9. (`0011` is already taken by the invite-by-email removal.)
2. Decide findings #6, #7 and #8 above; migrate or adjust copy accordingly.

**App:**
- `npx create-expo-app` with expo-router + TypeScript; EAS project configured.
- Supabase client with AsyncStorage/SecureStore adapter, `detectSessionInUrl: false`.
- NativeWind configured with the §4 tokens; Sora + Manrope loaded.
- `expo-linking` scheme + AASA / assetlinks hosted on `finkith.com`.
- Env via `app.config.ts` `extra` + EAS secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`. **No service-role key in the app.**

**Done when:** the app boots, reaches Supabase, and a hardcoded `select` against `categories` returns rows for a signed-in test user.

---

### M1 — Foundations: design system, i18n, money · ~4 days

- Port `src/shared/lib/money.ts` **and** `money.test.ts`. Verify `parseMoney`/`formatAmountForInput` round-trip in all three locales on device (Hermes' `Intl` support differs from V8 — if `Intl.NumberFormat.formatToParts` or `Intl.DisplayNames` is missing, enable `expo-localization`'s ICU build or polyfill with `@formatjs/intl-*`; **this is the single most likely surprise in the port**).
- Port the three dictionaries (`en`, `pt-BR`, `es-ES`) and `LOCALE_INTL_TAG` / `matchLocale`. Initial locale = device locale matched against the supported list, then `user_metadata.locale` once signed in.
- Build the shared component set, mirroring `src/shared/components/`: `Button`, `Input`, `Select`, `Switch`, `SegmentedControl`, `Chip`, `Avatar`, `ProgressBar`, `Sheet`, `DatePicker`, `CategoryBreakdown`, `BottomNav`. Reuse before creating — the web repo's README lists every one.

**Done when:** a storybook-ish demo screen renders every primitive in all three languages and both currencies.

---

### M2 — Auth · ~4 days

- **Login:** email + password, zod schema from `src/features/auth/types.ts`. Inline field errors, root error from Supabase.
- **Signup:** name + email + password (min 8). Writes `{ full_name, locale }` into `user_metadata`. No session is returned — show the "confirmation sent to {email}" state.
- **Email confirmation:** deep link → `exchangeCodeForSession` → `next` or Home.
- **Forgot password** (finding #5): request screen + deep-linked reset screen.
- **Session persistence** across cold starts; auto-refresh; sign-out clears storage and query cache.
- **Delete account:** confirmation dialog spelling out that groups the user created are deleted with all their data (finding #8), then `rpc('delete_own_account')` → sign out → login.

**Done when:** a new account can be created, confirmed by email on a real device, signed out, and signed back in.

---

### M3 — Onboarding & groups · ~3 days

- **Setup screen:** create a group (name, required) → `rpc('create_group_with_owner')` → Home. Also an entry point to paste/scan an invite code.
- **Join screen** (`/join/{code}`): resolve the group name via the anon RPC; handle not-found; signed-out branch offering sign in / create account with `next`; signed-in branch showing a join confirmation → `rpc('join_group_by_code')` → Home.
- Translate the two Postgres error strings (§6.5).
- The setup screen also carries logout + delete account, since a user with no group is otherwise stuck.

**Done when:** two devices, two accounts, one group — the second joins via a tapped invite link.

---

### M4 — App shell · ~3 days

- Tab navigator with the centre FAB and the persistent header (§7).
- Month picker sheet; selected month held in a shared store (Zustand or context) and consumed by Home, Bills, History, Settings.
- `currentGroup` query with the gate/redirect logic; loading and error states.
- Add-choice action sheet wiring to the (still empty) income and bill sheets.

**Done when:** all four tabs render placeholders, the month picker changes a visible label, and the gate correctly bounces a group-less user to onboarding.

---

### M5 — Income · ~4 days

- **Add/edit income sheet:** member picker (defaults to the current user's `member_id`), category chips from `categories` where `type='income'`, amount (locale-parsed), date picker, optional note. Schema from `src/features/income/types.ts`.
- Create / update / delete against `income_entries`; invalidate the income and dashboard queries.
- Amount field seeded with `formatAmountForInput` when editing.

**Done when:** entries can be added, edited and deleted, and survive a restart.

---

### M6 — Bills · ~5 days

- **Bills screen:** summary card (paid total, pending total, % paid, progress bar), category breakdown of *paid-this-cycle* bills, and the bill list.
- **Filter:** All / Fixed / Variable segmented control.
- **Add/edit bill sheet:** name, amount, due day (1–31), fixed vs. variable segmented control, category chips (`type='bill'`), repeat-monthly switch, paid switch. Set `cycle_month` from the selected month (finding #3).
- **Paid toggle** in the list with optimistic update; writes `paid` + `paid_at` via `paidAtFor(month)`.
- Port `isPaidInCycle`, `paidAtFor`, `monthKey`, `getBillDueInfo`, `computeBillsSummary`, `computeCategoryBreakdown` and `filterBills` from `src/features/bills/lib.ts` unchanged — **and port `lib.test.ts` with them**; those tests pin the month-boundary behaviour that three separate bugs came out of.

**Done when:** due/due-soon/overdue badges are correct across a month boundary (test with a device clock change) and the summary matches the Home figures.

---

### M7 — Home dashboard · ~4 days

- **Hero card:** one card showing all four figures at once — Combined income as the headline (with the "N contributing" line under it), then Total bills and Projected after bills side by side, then Available today. The two signed figures render their absolute value and encode the sign in colour (`text-positive` / `text-danger`); keep that, and keep `computeHero`'s shape, which returns exactly the fields the card draws.
- **Member strip:** horizontal avatars with each member's income total for the month, plus an add shortcut.
- **Activity list:** income entries and bills merged, sorted by date descending, filterable All / Income / Bills. Tapping an item opens the corresponding edit sheet.
- **Empty state** when the group has no income entries and no bills — explicit "no activity yet" copy, never sample data.

**Done when:** the hero totals reconcile with the Bills screen for the same month.

---

### M8 — History · ~3 days

- Six-month income trend bar chart (`computeTrend`, bars scaled to the max, current month highlighted).
- Category breakdown for the selected month.
- "Earlier months" list, most recent first, year-qualified labels.
- Label the screen as **income** history (finding #6).

**Done when:** the chart matches a hand-computed total for a seeded account.

---

### M9 — Settings · ~4 days

- **Invite card:** shows the invite URL, with native share sheet and copy-to-clipboard.
- **Members list:** avatar, name, "You" marker, role, and this month's income total per member.
- **Language switcher:** updates local state *and* `user_metadata.locale` (the cron reads it).
- **Currency switcher:** EUR / BRL, patches `groups.currency`, invalidates everything money-shaped.
- **Manage categories:** list by type, add (name + accent colour picker, max 30 chars), delete. Deleting must warn that existing rows keep the plain-text category name and lose their colour.
- **Notification toggle** (wired in M10), logout, delete account.

**Done when:** switching currency and language updates every screen without a restart.

---

### M10 — Push notifications · ~4 days

See §9 for the design. Client work: permission prompt, token registration/deregistration on the toggle and on sign-out, foreground/background handlers, and tapping a reminder deep-links to the Bills screen scrolled to that bill.

**Done when:** a bill due tomorrow produces one localised push per group member per cycle on both platforms, and a second cron run sends nothing.

---

### M11 — Hardening & release · ~5 days

- Offline: TanStack Query persistence, an offline banner, mutation retry on reconnect.
- Error boundaries; Sentry (or equivalent) wired to EAS builds.
- Accessibility pass: labels on every icon-only button, min 44pt hit targets, dynamic-type sanity check.
- Safe-area handling on every screen (the web app already compensates for iOS insets).
- App icons, splash, store listings in all three languages, privacy policy and terms links (already live at `/privacy` and `/terms`).
- EAS Submit to TestFlight and Play internal testing.

---

**Total: roughly 9–10 weeks for one developer.** M0–M4 are strictly sequential; M5–M9 can be reordered or parallelised across two developers.

---

## 9. Push notifications — the one backend change

**Problem.** `src/app/api/cron/bill-reminders/route.ts` sends via `web-push` to a VAPID endpoint stored in `push_subscriptions (endpoint, p256dh, auth)`. Native apps have no such endpoint — they have an APNs/FCM device token, or an Expo push token.

**Recommended approach — Expo Push Service** (one API for both platforms, no APNs certificate handling in the cron):

1. **Migration `0011_native_push_tokens.sql`:**
   ```sql
   create table device_push_tokens (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references auth.users(id) on delete cascade,
     token text not null unique,          -- Expo push token
     platform text not null check (platform in ('ios','android')),
     created_at timestamptz not null default now()
   );
   alter table device_push_tokens enable row level security;
   create policy "device_push_tokens_own" on device_push_tokens
     for all using (user_id = auth.uid()) with check (user_id = auth.uid());
   ```
   Keep `push_subscriptions` for the web PWA; the cron fans out to both.

2. **Cron change:** after resolving recipients and the locale, look up `device_push_tokens` for the user and `POST https://exp.host/--/api/v2/push/send` with `{ to, title, body, data: { billId } }`, batched up to 100 per request. Handle `DeviceNotRegistered` in the receipt by deleting the token — the same lifecycle the existing code implements for web-push `404`/`410`.

3. **Everything else stays:** the `0 12 * * *` schedule, the `CRON_SECRET` bearer check, the `bill_reminders_sent` unique key `(bill_id, user_id, cycle_month, reminder_type)` for dedupe, the `getBillDueInfo` status filter (repeating bills only), and the per-user locale lookup from `user_metadata`.

**Copy:** title `"{bill name} · {Due soon|Overdue}"`, body from `dict.notifications.reminderDueSoonBody(name)` / `reminderOverdueBody(name)`, in the recipient's language.

**If you prefer not to depend on Expo's service,** send through FCM directly (with APNs configured in Firebase) and store raw FCM tokens instead — the table and cron shape are identical, only the send call changes.

---

## 10. What the RN app deliberately does *not* do

Do not build these; they do not exist in the product today and adding them expands the backend contract:

- Multiple groups per user, or a group switcher.
- Bill splitting, per-member bill attribution, or settle-up.
- Editing another member's role, or transferring group ownership.
- Bank/open-banking imports, receipts, or attachments.
- Budgets, goals, or forecasting beyond the "projected after bills" hero figure.
- Currencies beyond EUR and BRL (the `groups.currency` CHECK constraint would reject them).
- A light theme.
