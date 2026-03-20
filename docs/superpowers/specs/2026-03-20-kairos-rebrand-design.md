# Kairos Rebrand & UI Enrichment — Design Spec

## Overview

Rename the app from "TimingRx" to "Kairos" (Greek: the decisive, opportune moment). Replace the existing pharmacy-symbol logo with a new brand system built around diverging risk curves — two paths rising from a shared decision node, one accelerating steeply (adjusted risk with factors), one rising gently (baseline). Execute a phased UI enrichment that extends the logo's design language throughout the app.

## Brand System

### Logo Variants

Three variants, one visual language:

| Variant | Name | Usage | Structure |
|---------|------|-------|-----------|
| **Hero** | Integrated Dual-Curve Wordmark | Landing page hero, presentations | Both curves flow through "kairos" text. Solid gradient = adjusted risk accelerating upward. Dashed subtle line = baseline rising gently. Purple decision node at the separation point. |
| **Header** | Diverging Mark + Wordmark | Nav bar, methodology heading, footer, inline headings | Separable mark: steep pink curve arcs up and away, gentle blue curve extends under "kairos" text. Decision node anchors the origin. |
| **Icon** | Diverging Paths Mark | Favicon (16–32px), app icon (180–512px), social avatar | Two curves diverging from a decision node, no text. Steep curve = pink, gentle curve = blue, node = purple. Used only for static asset generation (favicon, etc.), not as a runtime UI component. |

### Color Specification

Gradient (unchanged from existing brand):
- Blue: `#6b93ef`
- Purple: `#b055f7` (decision node, primary interactive accent)
- Pink: `#e04cb0`

Dark background text: `#f0f0f5`
Light background text: `#1a1a2e`
Light background blue: `#5577cc`
Light background purple: `#8a3fd4`
Light background pink: `#c43a8a`

**Contrast compliance (WCAG AA):**
- `#b055f7` on dark `#0d0e14` → contrast ratio ~6.2:1 ✓ (AA for normal text)
- `#8a3fd4` on light `#f8f8fa` → contrast ratio ~3.8:1 ✓ (AA for large text / UI elements)
- All gradient accent elements are decorative (borders, glows, underlines) — not text-bearing — so they don't require text contrast ratios. Focus rings use the purple but also retain a visible outline fallback.

### Typography

- Wordmark: lowercase "kairos", Inter/Geist, `font-weight: 700`, `letter-spacing: -0.03em`
- Hero size: `text-4xl` (36px)
- Header size: `text-lg` (18px)
- Heading size: `text-2xl` (24px) — for inline use in headings like "How kairos Works"
- Footer size: `text-sm` (14px)

### SVG Specifications

**Icon variant** (viewBox `0 0 56 56`):
- Decision node: circle at `(8, 46)`, r=4, fill=purple
- Steep curve (adjusted): cubic bezier `M8,46 C16,42 26,30 34,18 C38,11 42,6 48,2`, stroke=pink, strokeWidth=4.5
- Gentle curve (baseline): cubic bezier `M8,46 C18,43 28,40 36,36 C42,33 46,31 50,28`, stroke=blue, strokeWidth=4.5

**Header variant** (viewBox `0 0 190 46`):
- Decision node: circle at `(8, 38)`, r=3.5, fill=purple
- Steep curve: `M8,38 C16,34 24,24 32,14 C36,9 38,6 42,4`, stroke=purple→pink gradient, strokeWidth=2.5
- Gentle curve: `M8,38 C40,35 80,31 120,28 C150,25 170,23 184,22`, stroke=purple→blue gradient, strokeWidth=2
- Text "kairos" at x=48, y=32, fontSize=22

**Hero variant** (viewBox `0 0 230 68`):
- Baseline (dashed): `M6,58 C50,56 100,52 150,46 C180,42 200,38 224,34`, stroke=blue, strokeWidth=1.8, opacity=0.35, strokeDasharray=`4,5`
- Adjusted (solid): `M6,58 C40,54 80,46 120,34 C150,24 180,14 220,4`, stroke=full gradient, strokeWidth=2.8
- Decision node: circle at `(100, 40)`, r=4, fill=purple, with r=8 glow at opacity=0.1
- Text "kairos" at x=8, y=46, fontSize=34

---

## Phase 1: Rebrand (Logo Replacement + Metadata)

### Scope

Replace every occurrence of "TimingRx" / "timingrx" / "timing-rx" with "Kairos" / "kairos" and swap the logo component across the app. Also clean up the duplicate file `page 2.tsx`.

### Complete File Inventory

All 17 files containing "TimingRx", "timingrx", or "timing-rx" references (verified via grep):

**Create:**
- `src/components/layout/kairos-logo.tsx` — New logo component with `hero`, `header`, `heading`, `footer` variants (no `icon` variant — see note below)
- `src/app/icon.svg` — Static SVG file using the icon variant paths for Next.js metadata favicon

**Delete:**
- `src/components/layout/timing-rx-logo.tsx` — Replaced by kairos-logo.tsx
- `src/app/conditions/[slug]/page 2.tsx` — Accidental macOS duplicate file, contains stale code

**Modify (logo imports — 5 files):**
- `src/app/page.tsx` — Swap `TimingRxLogo` → `KairosLogo`, hero variant, update subtitle and aria-labels
- `src/components/layout/header.tsx` — Swap `TimingRxLogo` → `KairosLogo`, header variant
- `src/components/layout/footer.tsx` — Swap `TimingRxLogo` → `KairosLogo`
- `src/app/conditions/page.tsx` — Swap `TimingRxLogo` → `KairosLogo`
- `src/components/methodology/methodology-page-content.tsx` — Swap `TimingRxLogo` → `KairosLogo`, update "How TimingRx Works" → "How kairos Works"

**Modify (string references only — 7 files):**
- `src/app/layout.tsx` — Update metadata: title "Kairos", description, any "TimingRx" strings
- `src/app/about/page.tsx` — Update all "TimingRx" text references to "Kairos"
- `src/app/methodology/page.tsx` — Update any "TimingRx" text references
- `src/app/conditions/[slug]/page.tsx` — Update any "TimingRx" text references
- `src/components/condition/evidence-sources-section.tsx` — Update "TimingRx" text references
- `src/data/types.ts` — Update any "TimingRx" comments or string literals
- `src/data/trials/index.ts` — Update any "TimingRx" comments or string literals

**Modify (non-component references — 2 files):**
- `src/lib/hooks/use-teaching-mode.tsx` — Update any "TimingRx" strings
- `src/__tests__/lib/hooks/use-teaching-mode.test.tsx` — Update test strings

**Modify (CSS):**
- `src/app/globals.css` — Update any "TimingRx" comments

**Replace:**
- `src/app/favicon.ico` — Replace with icon variant rendered as ICO (generate from the icon SVG using a CLI tool or manual export)

**Manual (user performs):**
- GitHub: Rename repo, update description and topics
- Vercel: Update project name and domain

### Audit Command

After all changes, run this to verify no references remain:
```bash
grep -ri "timingrx\|timing-rx\|TimingRx" src/ --include="*.{ts,tsx,css}" | grep -v node_modules
```

### Component API

```tsx
interface KairosLogoProps {
  className?: string;
  variant?: "header" | "hero" | "heading" | "footer";
}
```

Each variant determines: SVG content, text size, text color (dark vs light aware), overall dimensions. The `hero` variant includes the subtitle "OBSTETRIC DECISION INTELLIGENCE" in small caps below (changed from "EVIDENCE-BASED OBSTETRIC GUIDANCE" — deliberate update to match the app's decision-support focus). No `icon` variant — the icon is only needed as a static SVG file for favicon/metadata, not as a runtime React component.

### Favicon Generation

The existing `src/app/favicon.ico` will be replaced. The approach:
1. Create `src/app/icon.svg` with the diverging-paths mark SVG (the icon variant paths)
2. Next.js automatically uses `icon.svg` for the favicon when present
3. Optionally generate `favicon.ico` from the SVG using `npx svg2ico` or similar, for legacy browser support

---

## Phase 2: Gradient Accents & Motif Integration

### Scope

Extend the logo's gradient and curve motif into the UI as accent elements. All new color values must use CSS custom properties for theme consistency.

### New CSS Custom Properties

Add to `globals.css`:
```css
--kairos-gradient: linear-gradient(90deg, var(--brand-blue, #6b93ef), var(--brand-purple, #b055f7), var(--brand-pink, #e04cb0));
--kairos-glow: 0 0 0 1px oklch(from var(--brand-purple) l c h / 0.15);
--kairos-focus: var(--brand-purple, #b055f7);
```

### Changes

**Gradient accent lines:**
- Add a thin (1–2px) gradient divider line between major page sections (home page, methodology page) using `--kairos-gradient`
- Active tab indicators in `src/components/methodology/methodology-tabs.tsx` get a gradient underline using `--kairos-gradient` instead of the current solid primary color
- The condition detail page section headers get a gradient left-border accent

**Card interactions:**
- Card hover states gain a subtle gradient border glow: `box-shadow: var(--kairos-glow)` on hover
- Factor toolbar buttons get a gradient background when active: `background: var(--kairos-gradient)` at 15% opacity, with white/foreground text

**Hero background motif:**
- The home page hero section gets a large, faint pair of diverging curves as a background SVG element — purely decorative, low opacity (0.03–0.05), positioned behind the hero text via `position: absolute; z-index: 0`
- Uses the same curve paths as the logo but scaled to fill the hero width

**Decision node accent:**
- Interactive focus rings use `var(--kairos-focus)` instead of the default browser focus color
- Toggle switches and active states use the purple as their accent color
- Retain a visible `outline` fallback for high-contrast mode

---

## Phase 3: Typography & Dark Mode Enhancement

### Scope

Refine typography to match the wordmark's confident feel, and enrich dark mode.

### Changes

**Typography tightening:**
- Page headings (`h1`, `h2`) get `letter-spacing: -0.02em` to match the wordmark's tight tracking
- Condition page titles get `font-weight: 700` (up from 600)
- Badge text gets `font-weight: 600` for better contrast at small sizes
- The hero subtitle switches to all-caps with wide tracking (`letter-spacing: 0.15em`)

**Dark mode enrichment:**
- Background shifts from flat dark to subtle gradient wash: `linear-gradient(180deg, oklch(0.14 0.01 260), oklch(0.12 0.015 280))` — very subtle blue-purple tint
- Card surfaces get a faint backdrop-blur glass effect: `backdrop-filter: blur(8px)`, `background: oklch(0.18 0.01 260 / 0.6)`
- The existing gradient becomes more vivid in dark mode (leverage existing oklch dark-mode tokens which already boost chroma)

---

## Phase 4: Micro-interactions & Polish

### Scope

Add motion and interaction refinements that echo the logo's themes.

### Changes

**Page transitions:**
- Smooth cross-fade between methodology tabs (CSS `transition: opacity 200ms ease`)
- Risk curve charts animate on first render — curves draw in from left to right using SVG `stroke-dashoffset` animation

**Loading & empty states:**
- A minimal loading skeleton uses an animated version of the diverging curves — the two paths draw and the decision node pulses (reusing the `timeline-node-pulse` keyframe from `globals.css`)
- Empty search results show a faded version of the icon SVG paths with "No conditions found"

**Chart enhancements:**
- Risk curve page: a subtle gradient glow (`filter: blur(20px)`, low opacity) behind the main chart area using the brand gradient colors
- Timeline chart nodes already use the `timeline-node-pulse` animation from `src/app/globals.css`

**Hover micro-interactions:**
- Condition cards: on hover, a faint gradient line sweeps across the bottom edge (CSS `background-size` animation on a `::after` pseudo-element)
- Factor toolbar buttons: on hover, the text shifts slightly and gains a purple tint via `color: var(--kairos-focus)`

---

## Implementation Notes

- All phases are independent and execute sequentially
- Phase 1 is the critical path — no UI enrichment should ship without the rebrand
- Phase 2–4 are additive polish; each phase improves the app but none are blockers
- All gradient values use CSS custom properties (`--kairos-gradient`, `--kairos-glow`, `--kairos-focus`) so they respect dark/light themes
- SVG gradients in the React component need unique IDs via `useId()` to avoid conflicts
- GitHub/Vercel changes are manual and should happen after Phase 1 ships
- The `page 2.tsx` duplicate should be deleted in the first commit of Phase 1

## Success Criteria

- Every visible instance of "TimingRx" is replaced with "Kairos" / "kairos" (verified by grep audit)
- The three logo variants render correctly at all sizes on dark and light backgrounds
- The favicon shows the diverging-paths icon mark
- The gradient accent language is consistent across all pages
- Dark mode feels richer without losing readability
- No regressions — all 208+ routes build successfully
- Lighthouse accessibility score maintained (gradient accents are decorative, focus rings have outline fallback)
- The `page 2.tsx` duplicate file is removed
