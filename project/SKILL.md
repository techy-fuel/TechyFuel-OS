---
name: techyfuel-design
description: Use this skill to generate well-branded interfaces and assets for TechyFuel OS — the premium blue-and-white Agency Operating System — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — global entry; link this one file. `@import`s all tokens + base.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`, `base.css`. Primary brand color is `#2563EB` (`--blue-600`).
- `assets/` — `techyfuel-logo.png` (lockup), `techyfuel-mark.png` (flame app icon).
- `components/` — React primitives (Button, IconButton, Input, Select, Switch, Checkbox, Badge, Avatar/AvatarGroup, Card, StatCard, ProgressBar, Tabs). In a built design system they live on `window.TechyFuelOSDesignSystem_be0222`; the prop contracts are in each `*.d.ts`, usage in each `*.prompt.md`.
- `ui_kits/techyfuel-os/` — full interactive app recreation (Dashboard, CRM, Tasks Kanban, Meta Ads, Client Portal, AI panel). Read these for layout patterns.
- `templates/` — copyable starting points.
- `foundations/` — specimen cards documenting color, type, spacing, brand.

## Non-negotiables
- Blue & white. Cool **slate** neutrals (never warm gray). Color is functional (status/data/one primary action), not decorative.
- `Plus Jakarta Sans` for UI + display, `JetBrains Mono` for data/IDs. Sentence case everywhere; ALL-CAPS only for tiny letter-spaced eyebrows. No emoji in product chrome.
- Cards = white + 1px hairline + soft cool shadow + 12–16px radius. Never colored left-border accent cards. Never bluish-purple gradients.
- Icons = **Lucide**, 1.75px stroke, `currentColor`. Don't hand-draw icons.
- Glassmorphism only on floating chrome (top bar, AI panel, popovers) — `backdrop-filter: blur(16px)` over `rgba(255,255,255,.72)`.
- Motion: `--ease-out`, 120–180ms hovers; primary buttons darken (not fade) on hover, shrink to 0.98 on press, brand focus ring.

> **Font substitution flag:** no brand font files were provided; Plus Jakarta Sans + JetBrains Mono (Google Fonts) stand in for the geometric rounded sans of the wordmark. Swap if official fonts arrive.
