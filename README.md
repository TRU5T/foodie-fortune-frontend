# Redeemr

> Digital loyalty and rewards for restaurants. Customers collect stamps or points by scanning a QR code at participating venues and redeem them for free items, discounts, and perks.

**Production domain:** [redeemr.app](https://redeemr.app/)

**Lovable project:** [lovable.dev/projects/80aab20c-c5fc-4a34-93bb-4dd565cbec3a](https://lovable.dev/projects/80aab20c-c5fc-4a34-93bb-4dd565cbec3a)

Redeemr replaces paper punch cards with a phone-based stamp and points system. Restaurants run their loyalty programme from a vendor dashboard; customers track every card from one wallet view.

---

## Table of Contents

- [Overview](#overview)
- [Target Audiences](#target-audiences)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Key Features](#key-features)
- [What's Working Well](#whats-working-well)
- [Strategic Direction](#strategic-direction)
- [Critical Fixes Before Launch (P0)](#critical-fixes-before-launch-p0)
- [Product Recommendations](#product-recommendations)
- [Growth & Go-to-Market](#growth--go-to-market)
- [Technical Roadmap](#technical-roadmap)
- [UX Quick Wins](#ux-quick-wins)
- [Success Metrics](#success-metrics)
- [Known Gaps & Incomplete Areas](#known-gaps--incomplete-areas)
- [Development Setup](#development-setup)
- [Deployment](#deployment)

---

## Overview

Redeemr is a digital loyalty and rewards platform for restaurants. It replaces paper punch cards with phone-based **stamp cards** and **points** systems. Customers scan a QR code at participating venues; restaurants manage loyalty, scanning, menus, and analytics from a vendor portal; admins oversee the platform.

The core **loyalty loop** (customer QR → vendor scan → stamps/points → rewards) is substantially built with a real Supabase backend, multi-role architecture, QR scanning, vendor analytics, and mobile-ready Capacitor setup.

The biggest risk to success is not missing features — it is **split focus** and **demo/mock surfaces** that undermine trust before real restaurant density exists.

---

## Target Audiences

| Audience | Purpose |
|----------|---------|
| **Customers** | Browse restaurants, collect stamps/points, view rewards, show QR at checkout |
| **Restaurant vendors** | Scan customers, award loyalty, manage rewards/menus/promotions, view analytics, subscribe |
| **Platform admins** | User/vendor management, tier upgrades, billing oversight |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | React 18.3 + TypeScript 5.5 |
| **Build** | Vite 5.4 (`@vitejs/plugin-react-swc`) |
| **Routing** | React Router DOM 6.26 |
| **UI** | shadcn/ui (Radix primitives), Tailwind CSS 3.4 |
| **Animation** | Framer Motion 12 |
| **Charts** | Recharts 2 |
| **Forms / validation** | React Hook Form 7 + Zod 3 |
| **Server state** | TanStack React Query 5 |
| **Client state** | React Context (`AuthContext`, `CartContext`) |
| **Backend** | Supabase (Auth, PostgreSQL, RLS, Edge Functions) |
| **Mobile** | Capacitor 8 (iOS/Android) + push notifications |
| **SEO** | react-helmet-async, JSON-LD, sitemap.xml, llms.txt |

---

## Project Structure

```
/workspace/
├── src/
│   ├── App.tsx                 # Routes + providers
│   ├── main.tsx                # Entry (HelmetProvider)
│   ├── index.css               # Design tokens + brand utilities
│   ├── pages/                  # Route pages
│   ├── components/
│   │   ├── layouts/            # Customer, Vendor, Admin layouts
│   │   ├── vendor/             # Vendor dashboard sub-components
│   │   ├── admin/              # Admin billing tab
│   │   └── ui/                 # shadcn components
│   ├── context/                # Auth, Cart
│   ├── hooks/                  # Custom hooks
│   ├── integrations/supabase/  # Client + generated types
│   └── lib/                    # utils, sanitizeError
├── public/                     # robots.txt, sitemap.xml, llms.txt
├── supabase/
│   ├── config.toml
│   ├── migrations/             # SQL migrations (RLS, tables, RPCs)
│   └── functions/              # Edge functions + email templates
├── capacitor.config.ts
├── vite.config.ts
└── tailwind.config.ts
```

---

## Routes & Pages

### Customer layout (`CustomerLayout` — navbar + footer)

| Route | Page | Notes |
|-------|------|-------|
| `/` | `Index` | Landing for guests; dashboard/wallet for logged-in customers |
| `/rewards` | `Rewards` | Stamp/point progress + redeemed rewards |
| `/restaurants` | `Restaurants` | Live Supabase data + filters |
| `/restaurant/:id` | `RestaurantDetails` | **Mock data only** (Burger King id `"1"`) — needs wiring to Supabase |
| `/cart` | `Cart` | Demo checkout (no real payment) |
| `/profile` | `Profile` | Profile edit, order history |
| `/my-stamp-cards` | `MyStampCards` | All stamp cards |
| `/my-qr-code` | `MyQRCode` | Rotating QR token |
| `/auth` | `Auth` | Login / register tabs |
| `/forgot-password` | `ForgotPassword` | |
| `/reset-password` | `ResetPassword` | |
| `/business` | `BusinessSubscription` | Vendor pricing / subscribe |
| `/faq` | `FAQ` | |
| `/contact` | `Contact` | Sends email via edge function |
| `/terms` | `Terms` | |
| `/privacy` | `Privacy` | |
| `/unsubscribe` | `Unsubscribe` | Email unsubscribe |
| `/blog/paper-vs-digital-loyalty` | `BlogPaperVsDigital` | Marketing blog post |

### Vendor layout (`VendorLayout` — sidebar)

| Route | Page |
|-------|------|
| `/vendor-dashboard` | `VendorDashboard` |
| `/vendor-scanner` | `VendorScanner` |

### Admin layout (`AdminLayout` — sidebar)

| Route | Page |
|-------|------|
| `/admin` | `AdminLanding` |
| `/admin/dashboard` | `AdminDashboard` |

---

## Key Features

### Customer-facing

- **Auth:** Email/password sign-up, sign-in, forgot/reset password (Supabase Auth)
- **Role-based UX:** Customers see loyalty dashboard; vendors/admins redirect from `/`
- **Mobile wallet UI:** `WalletStampCards` (Framer Motion stack) on mobile home
- **Stamp cards & points:** Queries `stamp_cards`, `point_balances`, `rewards`, `user_rewards`
- **QR loyalty code:** Edge function `qr-token` generates HMAC-signed 5-minute tokens
- **Restaurant discovery:** Search, cuisine filter, Google Places autocomplete
- **In-app notifications:** `NotificationBell` + `notifications` table
- **Push notifications:** Capacitor push on native platforms
- **Profile management:** Name, phone, order history

### Vendor-facing

- **Multi-restaurant dashboard:** Rewards, menu items, promotions, analytics tabs
- **Customer scanner:** QR camera (`BarcodeDetector`) or manual email/phone lookup; awards stamps/points via `award_loyalty` RPC; 5-minute cooldown; reward redemption flow
- **Tier system:** Tier 1 (rewards only) vs Tier 2 (rewards + online ordering toggle)
- **Tier upgrade requests:** Vendors request; admins approve
- **Subscription:** `vendor_subscriptions` table; $20/mo or $16/mo annual
- **Analytics:** Scan counts, unique customers, completed cards, bar chart over time

### Admin-facing

- **Stats overview:** Users, restaurants, orders, pending tier requests
- **User & vendor tables:** Searchable lists
- **Tier upgrade approval/rejection**
- **Billing tab:** Subscription management UI

### Backend (Supabase)

**Tables:** `profiles`, `restaurants`, `rewards`, `stamp_cards`, `point_balances`, `user_rewards`, `menu_items`, `orders`, `order_items`, `promotions`, `scan_logs`, `notifications`, `user_roles`, `vendor_subscriptions`, `tier_upgrade_requests`, `device_tokens`, `reward_item_links`

**RPCs:** `award_loyalty`, `redeem_reward`, `has_role`

**Edge functions:** `qr-token`, `places-autocomplete`, `send-contact-email`, `send-transactional-email`, `send-push`, `auth-email-hook`, email unsubscribe/suppression handlers

**Security:** Row Level Security policies across tables; role enum `customer | vendor | admin`

---

## What's Working Well

| Area | Assessment |
|------|------------|
| **Core loyalty loop** | Customer QR → vendor scan → stamps/points → rewards. `VendorScanner`, `award_loyalty` RPC, 5-min cooldown, reward redemption flow — this is real. |
| **Mobile-first UX** | `WalletStampCards` (Apple Wallet-style stack) is a genuine differentiator. |
| **Vendor tooling** | Dashboard with rewards, menus, promotions, analytics, tier upgrades. |
| **Backend maturity** | 16 migrations, RLS, edge functions (QR tokens, email, push, Places autocomplete). |
| **SEO** | Helmet tags, JSON-LD, `sitemap.xml`, `llms.txt`, blog post. |
| **Design** | Cohesive warm palette (orange `#F97316`, charcoal, cream). Professional landing page. |

This is further along than most Lovable projects. The foundation for a **restaurant loyalty SaaS** is here.

---

## Strategic Direction

Redeemr currently sells two stories:

1. **Digital stamp cards** — mostly working end-to-end
2. **Online ordering + payments** — largely demo (`RestaurantDetails` uses mock Burger King data, cart checkout is fake, Stripe columns exist but no integration)

### Recommendation: Pick one wedge for launch

| Path | Pros | Cons |
|------|------|------|
| **A: Loyalty-first** (recommended) | Faster to market, lower complexity, competes with Stamp Me / Square Loyalty / Fivestars | Smaller per-venue revenue |
| **B: Ordering marketplace** | Higher revenue potential | Competes with DoorDash, Uber Eats — needs payments, logistics, density |

The working code, pricing page copy, and vendor scanner all point to **Path A**. Tier 2 ordering should be a **Phase 2** upsell, not a launch promise.

### Competitive positioning

**Current headline:** *"Loyalty Made Simple"* — accurate but generic.

**Stronger angles:**
- **"The punch card that lives in your phone"** — instantly understood
- **"Loyalty for independents, not chains"** — clear target
- **"Your regulars, back again"** — speaks to restaurant pain (repeat visits)

**Competitive edge:** Vendor-branded experience + simple QR scan + no POS integration required (for Tier 1).

Compare against:
- **Paper punch cards** — lost, forgotten, no data
- **Square Loyalty** — tied to Square POS
- **Stamp Me** — consumer app, less vendor control

### Tier model clarity (simplified for launch)

| Tier | Price | Includes |
|------|-------|----------|
| **Starter** | $0 for first 3 months, then $29/mo | Stamp/point cards, scanner, basic analytics |
| **Pro** (later) | $49/mo or rev share | Promotions, advanced analytics, integrations |

Do not sell ordering until it works.

---

## Critical Fixes Before Launch (P0)

These will hurt credibility if left as-is:

### 1. Restaurant detail page is broken for real data

`RestaurantDetails.tsx` ignores Supabase and only works for mock id `"1"`. The `useRestaurant(id)` hook in `useRestaurants.ts` exists but is unused. Every real restaurant link from `/restaurants` will 404.

**Fix:** Wire `useRestaurant` + fetch `menu_items` from Supabase. Hide ordering UI unless the venue is Tier 2.

### 2. Fake social proof on the landing page

`LandingPage.tsx` shows static stats (12k customers, 340 restaurants, 94% return rate). With zero or few real venues, fabricated stats erode trust.

**Fix:** Replace with honest messaging ("Join our founding restaurants") or real counts from the database.

### 3. Subscription activates without payment

`useVendorSubscription.ts` inserts subscriptions with `status: "active"` without Stripe. Toast says *"Payment processing will be connected soon."*

**Fix:** Integrate **Stripe Checkout** before charging restaurants — or run a genuine free trial with clear limits.

### 4. No vendor route protection

Admin pages check roles; `/vendor-dashboard` and `/vendor-scanner` do not. Any logged-in customer can access vendor tools.

**Fix:** Add route guards checking `role === 'vendor'`.

### 5. Cart / ordering is a demo

Cart checkout uses `setTimeout` and clears the cart — no `orders` table writes.

**Fix:** Either remove cart from nav entirely for launch, or label it clearly as "Coming soon."

### 6. "Book a Demo" does nothing

On `/business`, the button has no handler.

**Fix:** Connect to Calendly, a contact form, or `mailto:`.

---

## Product Recommendations

### Nail the "aha moment" in under 60 seconds

The winning flow for customers:

```
Sign up → see wallet → visit restaurant → staff scans QR → stamp appears → push notification
```

Optimize for:
- **Onboarding:** After signup, immediately show QR code + "Visit [nearest restaurant] to get your first stamp"
- **First stamp celebration:** Confetti, haptic feedback (Capacitor), push notification
- **Referral hook:** "Invite a friend, both get a bonus stamp at [Restaurant X]"

### Nail the vendor "aha moment"

```
Sign up → create reward ("Buy 9 coffees, get 1 free") → scan first customer → see analytics update
```

Reduce time-to-first-scan:
- **Guided setup wizard** (reward template picker: "Coffee card", "Lunch loyalty", etc.)
- **Printable QR poster** PDF for the counter ("Scan to join our loyalty program")
- **Staff training mode** — 30-second in-app tutorial

### Focus geography (density beats breadth)

Marketplaces and loyalty networks fail without **local density**. Do not launch "nationwide."

Pick one:
- One city (e.g. "Redeemr for independent cafés in [City]")
- One vertical (e.g. "Specialty coffee shops")
- One anchor partner (one popular venue that brings their regulars)

**Goal:** 10–20 venues in one area before expanding.

---

## Growth & Go-to-Market

### Phase 1: Founding restaurants (months 1–3)

- Personal outreach to 20 independent cafés/restaurants
- Offer **free for 6 months** in exchange for feedback + case study
- Install QR posters physically in each venue
- Track: scans/week, repeat visit rate, rewards redeemed

### Phase 2: Customer acquisition (per venue)

- Each restaurant promotes to **their existing regulars** (table tents, receipt inserts, Instagram)
- Redeemr's job is tooling, not ads — restaurants bring the users
- Optional: "Join [Café Name] loyalty — get a free coffee on signup"

### Phase 3: Network effects (only after density)

- Cross-venue discovery on `/restaurants`
- "Redeemr Passport" — visit 5 venues in [City], earn a bonus
- Local SEO: "[City] restaurant rewards app"

### Content marketing

Existing blog post (`/blog/paper-vs-digital-loyalty`) is the right direction. Add:
- "How [Local Café] increased repeat visits 23% with digital stamps" (real case study)
- Vendor onboarding guide (PDF/video)
- Comparison pages vs paper cards, Stamp Me, Square Loyalty

---

## Technical Roadmap

| Priority | Task | Why |
|----------|------|-----|
| **P0** | Wire `RestaurantDetails` to Supabase | Broken user journey today |
| **P0** | Stripe Checkout for vendor subscriptions | Cannot monetize without it |
| **P0** | Vendor route guards (`role === 'vendor'`) | Security + UX |
| **P0** | Remove or hide demo cart/ordering | Avoid false promises |
| **P1** | Vendor onboarding wizard | Reduces churn at signup |
| **P1** | Printable QR poster generator | Physical presence in venues |
| **P1** | Referral system (DB + UI) | Growth loop |
| **P1** | Real landing page stats or honest copy | Trust |
| **P2** | Push notification triggers on stamp earned | Retention |
| **P2** | Consolidate Supabase clients (`integrations/` vs `lib/`) | Env var mismatch risk |
| **P2** | Enable TypeScript strict mode gradually | Fewer production bugs |
| **P2** | Basic E2E tests for loyalty loop | Confidence to ship |
| **P3** | Full ordering + Stripe Connect | Only after loyalty PMF |

### Code quality notes

**Strengths:**
- Consistent use of React Query for server state
- Typed Supabase schema (`integrations/supabase/types.ts`)
- `sanitizeDbError` for user-facing DB errors
- Lazy loading for heavier pages (`MyQRCode`, `VendorScanner`)
- RLS + Postgres RPCs for sensitive loyalty operations

**Weaknesses:**
- Loose TypeScript: `strictNullChecks: false`, `noImplicitAny: false`
- Duplicate Supabase client: `integrations/supabase/client.ts` vs `lib/supabase.ts` (env var mismatch)
- No route guards on vendor pages
- No automated tests
- Cart state is in-memory only (lost on refresh)
- Mixed data sources: real Supabase on list pages, hardcoded mock on detail page

---

## UX Quick Wins

1. **Logged-in home on mobile** goes straight to wallet (`WalletStampCards`) — good. Add a persistent **"Show QR"** FAB.
2. **Restaurant cards** pass `rating={0}` and empty `deliveryTime` — hide fields without data.
3. **Sort dropdown** on `/restaurants` is non-functional — wire it or remove it.
4. **Dual toasters** (shadcn + Sonner) — pick one.
5. **Dark mode tokens** exist but no toggle — fine for v1, but don't half-implement it.
6. **`/cart` exists but no nav link** in `CustomerLayout`.
7. **Old `Navbar.tsx`** component exists but is unused (superseded by `CustomerLayout`).

---

## Success Metrics

For a loyalty SaaS at this stage, success is not viral consumer growth. It is:

| Metric | Target (6 months) |
|--------|-------------------|
| Paying restaurants | 50–100 in one city |
| Active scans/week | 500+ |
| Customer retention (30-day) | 40%+ return to app |
| NPS from vendors | 50+ |
| MRR | $1,500–$3,000 ($30 × 50–100 venues) |

That is a real business. Scale comes after **proving one market works**.

### Path to massive success

1. **Launch loyalty-only** — cut demo ordering from the story
2. **Fix the broken restaurant detail page** — today's biggest UX bug
3. **Win one local market** — 10–20 venues, not 340 fictional ones
4. **Make the first scan magical** — for customers and vendors
5. **Add Stripe** — before asking restaurants to pay
6. **Sell outcomes** — "more repeat customers," not "digital platform features"

---

## Known Gaps & Incomplete Areas

| Area | Status |
|------|--------|
| **Restaurant detail / ordering** | `RestaurantDetails` uses `MOCK_RESTAURANT_DATA` for id `"1"` only; `useRestaurant` hook exists but unused |
| **Payments** | Cart checkout is explicitly a demo; no Stripe integration despite `stripe_*` columns on subscriptions |
| **Vendor subscription** | Direct DB insert marks subscription "active"; toast says "Payment processing will be connected soon" |
| **Restaurant cards** | `Restaurants` passes `rating={0}` and `deliveryTime=""`; sort dropdown is non-functional |
| **Online ordering E2E** | Menu management exists for vendors; customer order flow doesn't create real `orders` from cart |
| **Vendor auth guard** | Any logged-in user could visit `/vendor-dashboard` |
| **Book a Demo** | Button on `/business` has no handler |
| **Landing stats** | Marketing numbers are static, not from analytics |
| **Tests / CI** | No test files, no GitHub workflows |
| **Mobile build** | Capacitor `server.url` points to Lovable hosted preview, not local `dist` |

---

## Development Setup

### Prerequisites

- Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd foodie-fortune-frontend

# Install dependencies
npm i

# Start the development server (port 8080)
npm run dev
```

### Environment variables

Create a `.env` file with:

```
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

### Editing options

**Lovable:** Visit the [Lovable Project](https://lovable.dev/projects/80aab20c-c5fc-4a34-93bb-4dd565cbec3a) and prompt changes. Changes sync to this repo automatically.

**Local IDE:** Clone, edit, and push. Changes sync back to Lovable.

**GitHub:** Edit files directly in the GitHub UI.

---

## Deployment

**Lovable:** Open [Lovable](https://lovable.dev/projects/80aab20c-c5fc-4a34-93bb-4dd565cbec3a) → Share → Publish.

**Custom domain:** Project → Settings → Domains → Connect Domain. See [Lovable custom domain docs](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

**Mobile (Capacitor):** Build web assets with `npm run build`, then use Capacitor CLI to sync to iOS/Android. App ID: `app.lovable.80aab20cc5fc4a3493bb4dd565cbec3a`.
