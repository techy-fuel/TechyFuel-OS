# TechyFuel OS — Design System

> **Fueling Your Brand's Digital Journey.**
> The design language for **TechyFuel OS**, an all-in-one **Agency Operating System** for digital marketing agencies and service businesses.

TechyFuel OS unifies the entire agency workflow into one premium SaaS workspace: Executive Dashboard, Client CRM, Project & Task Management, Content Calendar, Client Approvals, File Management, Team Management, Meta Ads Center, Sales Pipeline, Finance & Invoicing, Reporting, an AI Assistant, and a Client Portal.

The product aesthetic sits at the intersection of **Linear** (crisp density, keyboard-grade precision), **Stripe** (cool layered shadows, restraint), **Notion** (calm content surfaces), **HubSpot** (CRM clarity) and **ClickUp/Monday** (colorful status systems). It must read as **billion-dollar enterprise software**: minimal yet powerful, blue-and-white, with selective glassmorphism and smooth, never-flashy motion.

---

## Sources

- **Brand logo:** `uploads/techyfuel logo png.png` (provided by user) → copied to `assets/techyfuel-logo.png`; flame mark extracted to `assets/techyfuel-mark.png`.
- **Brief:** product spec supplied in chat (15 modules, primary color `#2563EB`, blue/white theme, Linear/Notion/ClickUp/HubSpot/Stripe inspiration).
- No codebase or Figma file was provided — this system is authored from the brand brief and logo. Visual decisions are documented below so they can be revised against any future source of truth.

---

## CONTENT FUNDAMENTALS

How TechyFuel OS writes.

- **Voice:** confident, calm, operator-grade. We are the dependable system the agency runs on — never hypey, never cute. Think "control tower," not "growth hacker."
- **Person:** address the user as **you**; the product refers to itself implicitly ("Create invoice", not "TechyFuel will create…"). Agency-facing copy is collaborative ("your clients", "your team").
- **Casing:** **Sentence case everywhere** — buttons, menu items, headers, table columns ("Monthly revenue", not "Monthly Revenue"). Reserve Title Case only for proper product/module names (Meta Ads Center, Client Portal, AI Assistant). ALL-CAPS is used sparingly as a typographic device for tiny eyebrow labels and table micro-headers (letter-spaced, `--text-2xs`), never for sentences.
- **Verbs first on actions:** "Add client", "Send proposal", "Approve deliverable", "Generate summary". Primary buttons are 1–2 words.
- **Numbers are the hero:** metrics lead, labels follow. "$48,250 — Monthly revenue", "94% — On-time delivery". Use tabular figures, compact units ($48.2K, 12.4× ROAS), and a sign/color for deltas (▲ +12.5%).
- **Empty states** are encouraging and instructive: "No active campaigns yet. Connect a Meta Ad account to start tracking spend and ROAS." Always pair with a primary action.
- **Tone of microcopy:** plain and specific. "Invoice sent to acme@studio.com" beats "Success!". Errors are blameless and actionable: "Couldn't reach Meta. Reconnect the ad account to refresh data."
- **AI Assistant voice:** helpful colleague, concise, shows its work. "I drafted 6 captions for the Nova launch. Want me to schedule them?" Suggestions are proposed, never auto-applied without confirmation.
- **Emoji:** **not used** in product chrome, labels, or data. The brand expresses warmth through color and the flame mark, not emoji. (Platform glyphs like the Instagram/Facebook logos in the Content module are brand icons, not emoji.)

**Examples**
- Button: `Add client` · `Send proposal` · `Request revision` · `Export report`
- Eyebrow label: `THIS MONTH` · `OVERDUE` · `MEMBERS`
- Metric: `$48,250` / `Monthly revenue` / `▲ 12.5% vs last month`
- Toast: `Deliverable approved — client notified.`
- AI: `Summarizing 14 tasks across 3 projects…`

---

## VISUAL FOUNDATIONS

**Color.** Blue & white is the spine. Primary is `#2563EB` (`--blue-600`) used for primary actions, active nav, links, focus, and key data accents. Backgrounds are cool whites and near-white slates (`--slate-50` page, white cards). Neutrals are a **cool slate** ramp — never warm gray. Status colors are a calm Stripe/Untitled-style set: green `#099250`, amber `#f79009`, red `#d92d20`, plus blue for info and violet/teal as secondary chart hues. Color is used **functionally** (status, data, the one primary action per view), not decoratively. No more than the brand blue + one or two chart accents per screen.

**Gradients.** Used sparingly and only on-brand: the flame/brand gradient (`--grad-brand`, deep blue→sky) appears on the logo, the occasional hero panel, AI surfaces, and full-bleed marketing moments. **Never** bluish-purple "AI slop" gradients on cards. Dashboard surfaces are flat white; a faint `--grad-hero` radial wash is allowed behind page headers.

**Typography.** `Plus Jakarta Sans` for everything UI and display — geometric, rounded, premium, echoing the wordmark. `JetBrains Mono` for IDs, code, and occasional metric callouts. Headings are bold (700–800) with tight tracking (`-0.018em`); body is 14px/1.5 in `--slate-700`. Data tables use 13px with tabular numerals. Eyebrows are 11px ALL-CAPS, letter-spaced `0.08em`, in `--slate-500`.

**Spacing & layout.** 4px base grid. App shell = fixed **left sidebar (248px)** + **top bar (60px)** + scrolling content (max ~1280px, generous 24–32px gutters). Cards use 16–24px internal padding. Density is "comfortable-compact": Linear-tight in tables and lists, Notion-roomy in content surfaces. Fully responsive — sidebar collapses to icons (64px) then to a drawer on mobile; top-bar search collapses to an icon; grids reflow 4→2→1.

**Corner radii.** Soft but not pill-y. Controls/buttons 8px (`--radius-md`), cards 12–16px (`--radius-xl`/`2xl`), inputs 8px, pills/badges full. Modals 16px. Avatars and status dots full-round.

**Cards.** White surface, `--radius-xl`/`2xl`, a **1px hairline** border (`--slate-150`) **plus** a soft cool shadow (`--shadow-sm`/`md`). Never border-only, never shadow-only — the hairline keeps edges crisp on white-on-white, the shadow gives lift. No colored left-border accent cards. Hover on interactive cards: lift to `--shadow-lg` and border to `--slate-200`, 180ms.

**Shadows.** Soft, layered, **cool slate-tinted** (rgba 16,24,40) — never pure black, never harsh. Elevation ladder xs→2xl. Primary buttons and active brand moments may carry a subtle blue glow (`--shadow-brand`). Insets are reserved for wells/inputs-pressed.

**Glassmorphism.** Selective and tasteful: the top bar, command palette, AI assistant panel, and overlay popovers use `backdrop-filter: blur(16px)` over `rgba(255,255,255,0.72)` with a 1px light border (`--glass-border`). Glass is for **floating chrome over content**, not for base cards. Avoid glass on opaque white-on-white areas where it does nothing.

**Borders.** 1px hairlines in the slate ramp: `--slate-150` for subtle dividers/card edges, `--slate-200` for default control borders, `--slate-300` on hover/strong. Brand border `#2563EB` for selected/active. Dividers are full-width hairlines, never heavy rules.

**Backgrounds.** Predominantly flat cool white/slate. No textures, no photographic hero imagery in the app chrome. Allowed: a faint radial `--grad-hero` wash behind major page headers, and the brand gradient on dedicated hero/AI panels. Charts sit on white with a subtle slate gridline.

**Motion.** Smooth and quick. Standard `--ease-out` (cubic 0.16,1,0.3,1) over 120–180ms for hovers, 280ms for panels/modals. `--ease-spring` for playful affordances (toggle thumb, checkmarks). Page/section content fades+rises 8px on mount. Charts draw/grow on load. No bounces on layout, no infinite decorative loops. Respect `prefers-reduced-motion`.

**Hover / press states.** Buttons: primary darkens (`--blue-600`→`--blue-700`); secondary/ghost get a `--slate-100` wash. Hover never just changes opacity on solid fills — it shifts color. **Press:** subtle scale-down (`0.98`) + the next-darker shade; focus shows the brand ring (`0 0 0 3px rgba(37,99,235,.30)`). Links darken on hover. Rows highlight to `--slate-50`/`100`.

**Imagery vibe.** Product is icon- and data-forward, not photo-forward. Where avatars/client logos appear they're crisp and neutral. Any marketing imagery is cool-toned, bright, clean — matching the blue palette; no grain, no heavy filters.

---

## ICONOGRAPHY

- **System:** **[Lucide](https://lucide.dev)** — loaded from CDN (`lucide@latest`). Lucide's 1.75–2px rounded-stroke geometry matches Plus Jakarta Sans and the friendly-but-precise SaaS feel (it's the same family Linear-era tools favor). No brand icon font was provided, so Lucide is the documented substitution — swap if a proprietary set arrives.
- **Style rules:** stroke icons (not filled), `1.75px` stroke, `currentColor` so they inherit text color, sized 16/18/20px inline and 20/24px for nav and headers. Icons sit in the muted text color (`--slate-500`) and brighten to brand/strong on active.
- **Brand / platform logos:** social platforms in the Content module (Facebook, Instagram, LinkedIn, TikTok, YouTube) and integration logos render as their own brand glyphs — keep these as supplied SVG/PNG, do not redraw in Lucide.
- **The flame mark** (`assets/techyfuel-mark.png`) is the app icon / collapsed-sidebar logo. Never recolor it outside the brand blues; never place it on busy backgrounds without clear space ≈ the width of the arrow.
- **Emoji / unicode as icons:** not used. Status is shown with colored dots + Lucide glyphs, never emoji.
- **Never** hand-draw bespoke SVG icons for one-offs — pull the nearest Lucide glyph.

---

## INDEX

**Root**
- `styles.css` — global entry (import this). `@import`s all tokens + base.
- `readme.md` — this guide. · `SKILL.md` — portable Agent Skill manifest.

**Tokens** (`tokens/`)
- `colors.css` · `typography.css` · `spacing.css` · `effects.css` · `fonts.css` · `base.css`

**Assets** (`assets/`)
- `techyfuel-logo.png` — full lockup · `techyfuel-mark.png` — flame icon

**Foundations cards** (`foundations/`) — specimen cards in the Design System tab (Type, Colors, Spacing, Brand).

**Components** (`components/`) — see "Components" section below; mounted from `window.TechyFuelOSDesignSystem_be0222`.

**UI kits** (`ui_kits/`) — full-screen recreations: Executive Dashboard, Client CRM, Tasks (Kanban), Meta Ads Center, AI Assistant / Client Portal.

### Component inventory (`window.TechyFuelOSDesignSystem_be0222`)
- **buttons/** — `Button` (primary · secondary · ghost · subtle · danger), `IconButton`
- **forms/** — `Input`, `Select`, `Switch`, `Checkbox`
- **data-display/** — `Badge`, `Avatar` + `AvatarGroup`, `Card`, `StatCard`, `ProgressBar`
- **navigation/** — `Tabs`

### UI kit — `ui_kits/techyfuel-os/`
Interactive app shell. `index.html` boots the full workspace; click any sidebar item to move between screens, "Ask AI" opens the assistant panel.
- `AppShell.jsx` — sidebar + glass top bar + content frame
- `Dashboard.jsx` — Executive dashboard (KPIs, revenue area chart, project-status donut, activity, deadlines)
- `Projects.jsx` — project cards with status, budget burn, team & progress
- `TasksBoard.jsx` — Kanban board (Backlog → Completed) with priority/type tags
- `ContentCalendar.jsx` — weekly social planner across 5 platforms
- `CRM.jsx` — Client CRM table + profile panel with communication timeline
- `Pipeline.jsx` — sales pipeline deal kanban (New lead → Won)
- `MetaAds.jsx` — Meta Ads Center (spend/ROAS/CPL/leads, charts, campaign table)
- `Finance.jsx` — revenue/profit metrics + invoices table
- `Reports.jsx` — reporting center (report templates, PDF/Excel export)
- `Files.jsx` — folder manager (Designs/Videos/Documents/Contracts) + version history
- `Team.jsx` — team management by department with workload
- `Settings.jsx` — agency branding, notifications, integrations
- `ClientPortal.jsx` — client-facing portal preview (progress, approvals, files, invoice)
- `AIPanel.jsx` — glass AI Assistant slide-over
- `charts.jsx` — inline SVG charts (AreaLine, Bars, Donut, Spark); `helpers.jsx` — Lucide `Icon`

### Templates — `templates/`
- `agency-dashboard/` — starter dashboard page consumers can copy and build on.

### Foundations cards — `foundations/`
Color (primary, neutrals, status) · Type (display, body, numerics) · Spacing (scale, radii, shadows) · Brand (logo, mark, glassmorphism).
