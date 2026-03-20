# Aesthetic Forge: TimingRx Visual Redesign Plan

**Profile**: Clinical Precision + Mint Protocol hybrid
**Boldness Tier**: B2 (Confident)
**Palette**: Steel Blue anchor + Teal companion + Coral spark
**Font**: Geist Sans (retained) + Geist Mono (expanded usage)

---

## Executive Summary

TimingRx has excellent data architecture but minimal visual architecture. The oklch token system is sophisticated but underutilized — the primary color is achromatic black, 95% of surfaces are white, and medical semantic colors only appear on tiny badges. This plan introduces a clinical color identity, improves information hierarchy, adds visual depth and rhythm, and creates signature moments — all while preserving the existing shadcn/ui foundation.

**Design philosophy**: Every visual change must serve clinical cognition. Color encodes risk. Space encodes hierarchy. Typography encodes data type. Nothing decorative without purpose.

---

## Phase 1: Color Identity & Token Overhaul

**Goal**: Transform the achromatic palette into a purposeful clinical color system.

### Task 1.1: Establish Brand Color

**Current**: `--primary: oklch(0.205 0 0)` (near-black, achromatic)
**New**: `--primary: oklch(0.45 0.12 245)` (steel blue — authoritative, clinical, accessible)

Update `:root` and `.dark` in `globals.css`:
- `--primary` → steel blue (the anchor color, 30% of color budget)
- `--primary-foreground` → white
- `--secondary` → warm neutral tint (not dead gray)
- `--accent` → light steel blue tint
- Add `--brand-teal: oklch(0.62 0.14 175)` (companion, for teaching/positive)
- Add `--brand-coral: oklch(0.65 0.18 25)` (spark, for alerts/CTAs, ≤10% usage)

**Files**: `src/app/globals.css`

### Task 1.2: Warm the Neutrals (Chromatic Grays)

**Current**: All grays are `oklch(X 0 0)` — dead neutral, no temperature.
**New**: Tint all neutrals toward blue (hue 245, chroma 0.005-0.015):
- `--background: oklch(0.985 0.005 245)` (barely perceptible blue-white)
- `--muted: oklch(0.96 0.008 245)` (cool muted)
- `--muted-foreground: oklch(0.45 0.015 245)` (chromatic gray text)
- `--border: oklch(0.90 0.01 245)` (tinted border)

This creates a cohesive cool-clinical atmosphere without being perceptible as "blue."

**Files**: `src/app/globals.css`

### Task 1.3: Unify Chart Colors with Token System

**Current**: `chart-theme.ts` uses hardcoded hex (`#94a3b8`, `#ef4444`)
**New**: Reference CSS custom properties or derive from the same oklch values.

Replace hex values with semantic references:
- `baseline` → `var(--muted-foreground)` equivalent
- `adjusted` → `var(--risk-high)` equivalent
- `safe/caution/danger` zones → `var(--ga-safe/caution/danger)` equivalents

**Files**: `src/components/charts/chart-theme.ts`

---

## Phase 2: Typography & Hierarchy

**Goal**: Create clear typographic rhythm and expand mono font usage for clinical data.

### Task 2.1: Establish Type Scale

Define a consistent scale in `globals.css` or Tailwind config:
```
Hero:      text-4xl (36px) / font-semibold / tracking-tight
Page:      text-2xl (24px) / font-semibold / tracking-tight
Section:   text-lg  (18px) / font-semibold
Card:      text-base (16px) / font-semibold
Body:      text-sm  (14px) / font-normal
Caption:   text-xs  (12px) / font-normal / text-muted-foreground
Micro:     text-[11px]     / font-normal / text-muted-foreground
```

**Rule**: Eliminate all `text-[10px]` instances. Minimum readable size is `text-[11px]` (used sparingly) or `text-xs` (12px, preferred minimum).

**Files**: Multiple components — `condition-card.tsx`, `condition-detail.tsx`, `calculator/page.tsx`, `glass-box-display.tsx`, `confidence-score.tsx`, `footer.tsx`

### Task 2.2: Expand Monospace Usage

Geist Mono should anchor all clinical data:
- GA windows: `font-mono` on all gestational age displays
- Risk statistics: `font-mono` on all numerical values (RR, OR, CI, per-1000)
- Confidence scores: `font-mono` on score values
- Calculator multipliers: already using `font-mono` (good)
- Table numerical columns: `font-mono tabular-nums`

**Files**: `ga-window-badge.tsx`, `risk-data-table.tsx`, `glass-box-display.tsx`, `confidence-score.tsx`, `condition-detail.tsx`

### Task 2.3: Heading Proximity Fix

Apply Gestalt proximity principle — headings get 1.5-2x more space above than below:
- Section headings in condition detail: `mt-8 mb-3` instead of uniform `space-y-6`
- Category headings on conditions page: `mt-10 mb-4` (currently `mb-4` only)

**Files**: `condition-detail.tsx`, `conditions/page.tsx`

---

## Phase 3: Layout & Space

**Goal**: Create visual rhythm, improve mobile experience, add wayfinding.

### Task 3.1: Harmonize Container Widths

**Current**: `max-w-7xl` for list pages, `max-w-3xl` for detail pages (2.3x jump).
**New**:
- Home page: `max-w-6xl` (hero) + `max-w-7xl` (category grid)
- Conditions list: `max-w-6xl`
- Condition detail: `max-w-4xl` (wider than current, less jarring transition)
- Calculator: `max-w-6xl`

**Files**: `page.tsx` (home), `conditions/page.tsx`, `conditions/[slug]/page.tsx`, `calculator/page.tsx`

### Task 3.2: Add Breadcrumb Navigation

Add a breadcrumb component to condition detail pages:
```
Conditions / Hypertensive Disorders / Chronic Hypertension
```
Uses `text-sm text-muted-foreground` with `>` separators. Links back to conditions page and filtered category.

**Files**: New component `src/components/ui/breadcrumb.tsx`, update `condition-detail.tsx`

### Task 3.3: Mobile Navigation Menu

**Current**: Desktop nav links (`md:flex`) disappear entirely on mobile. No hamburger, no drawer.
**New**: Add a sheet/drawer menu triggered by a hamburger icon on mobile. Include all nav links + teaching mode toggle.

**Files**: `src/components/layout/header.tsx`, possibly new `mobile-nav.tsx`

### Task 3.4: Semantic Spacing in Condition Detail

Replace uniform `space-y-6` with grouped spacing:
- Related sections (e.g., Risk Data + Risk Modifiers) get `space-y-4` between them
- Section groups get `space-y-8` between groups
- Major transitions (e.g., before Landmark Trials) get a subtle `<Separator />` or `space-y-10`

**Files**: `condition-detail.tsx`

---

## Phase 4: Card System & Visual Depth

**Goal**: Differentiate card types, add depth, create visual hierarchy within cards.

### Task 4.1: Card Type Variants

Add left-border accent strips to distinguish card types:
- **Guideline Recommendations**: `border-l-4 border-l-[var(--primary)]` (steel blue)
- **Clinical Notes**: `border-l-4 border-l-[var(--brand-teal)]` (teal)
- **Teaching/Physiology**: `border-l-4 border-l-amber-400` (warm, already amber-tinted)
- **Risk Data**: `border-l-4 border-l-[var(--risk-high)]` (coral/red)
- **Landmark Trials**: `border-l-4 border-l-[var(--evidence-moderate)]` (blue)
- **Special Considerations**: `border-l-4 border-l-[var(--ga-caution)]` (amber)

**Files**: `condition-detail.tsx`

### Task 4.2: Hover & Interactive States

- Condition cards: add `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`
- Calculator risk factor buttons: add subtle scale on active state
- Teaching mode expand/collapse: smooth height transition

**Files**: `condition-card.tsx`, `calculator-form.tsx`, `risk-data-table.tsx`

### Task 4.3: Hero Stat Cards on Home Page

Transform the generic stat cards into impactful hero numbers:
- Large number: `text-3xl font-bold font-mono` with brand color
- Label below: `text-xs uppercase tracking-wider text-muted-foreground`
- Subtle background tint per stat type
- Consider a very subtle bottom border in brand color

**Files**: `src/app/page.tsx` (StatCard component)

---

## Phase 5: Vibrancy & Signature Moments

**Goal**: Create the "wow" moments — dark surfaces, hero elements, saturation scarcity.

### Task 5.1: Dark Header Treatment

Transform the header from transparent glass to a confident dark surface:
- Background: `bg-[oklch(0.18 0.02 245)]` (dark steel blue)
- Logo text: white
- Nav links: `text-white/70 hover:text-white`
- Teaching toggle: styled for dark background
- This creates the critical dark anchor at the top of every page

**Files**: `src/components/layout/header.tsx`, `src/app/globals.css`

### Task 5.2: Risk Curve Dark Canvas

The stillbirth risk curve is the app's most powerful visual. Give it a dark canvas:
- Card background: dark surface (`bg-[oklch(0.15 0.01 245)]`)
- Axis labels: white/light
- Grid lines: subtle white
- Risk zones: more visible against dark background
- The colored lines and CI bands will *pop* against dark

**Files**: `stillbirth-risk-curve.tsx`, `calculator/page.tsx`, `chart-theme.ts`

### Task 5.3: Home Page Hero Enhancement

- Add a subtle gradient background to the hero section: from `primary/5` to transparent
- The "198 conditions" stat should be a hero number: large, mono, brand-colored
- Add a subtle animated gradient or shimmer on the primary CTA button

**Files**: `src/app/page.tsx`

### Task 5.4: Category Cards with Color Identity

Each medical category gets a subtle color identity:
- Hypertensive disorders → coral tint
- Fetal conditions → blue tint
- Maternal medical → teal tint
- Obstetric complications → amber tint
- etc.

Applied as a very subtle top border or left accent on category section headers and their cards.

**Files**: `src/app/page.tsx`, `conditions/page.tsx`, `globals.css` (add category color tokens)

---

## Phase 6: Teaching Mode Visual Layer

**Goal**: Make teaching mode feel like a distinct visual experience.

### Task 6.1: Teaching Mode Visual Identity

When teaching mode is active:
- Add a thin colored bar below the header (teal/amber gradient, 3px)
- Teaching content cards get a distinctive left border + tinted background
- The "TEACHING" badge becomes more prominent

**Files**: `header.tsx`, `condition-detail.tsx`, `globals.css`

### Task 6.2: Evidence Source Cards Enhancement

The evidence sources section currently alternates between card/list views. Enhance:
- Card view: add evidence source type color as top border
- Include mini EBM pyramid icon/indicator
- Teaching mode: show full descriptions with smooth expand animation

**Files**: `evidence-sources-section.tsx`

---

## Phase 7: Responsive & Accessibility Polish

### Task 7.1: Mobile-First Audit

- Ensure all `text-[10px]` → `text-[11px]` minimum
- Touch targets: all interactive elements ≥ 44px tap target
- Calculator form: stack to full width on mobile with clear section breaks
- Condition cards: single column on small mobile (`<375px`)

**Files**: Multiple

### Task 7.2: Dark Mode Toggle & Full Dark Mode Support

- Add a theme toggle (sun/moon icon) to the header
- Verify all new colors work in dark mode
- Dark mode gets a slightly warmer temperature than light mode for comfort

**Files**: `header.tsx`, `globals.css`, new `theme-provider.tsx` or enhancement to existing

### Task 7.3: Focus & Keyboard Accessibility

- Visible focus rings on all interactive elements (already handled by shadcn base, but verify)
- Skip-to-content link
- Proper ARIA labels on the teaching mode toggle, risk factor buttons, view toggles

**Files**: `header.tsx`, `calculator-form.tsx`, `evidence-sources-section.tsx`

---

## Phase 8: Micro-Interactions & Polish

### Task 8.1: Page Transitions

- Subtle fade-in on page content load
- Condition cards: staggered fade-in on conditions page

**Files**: New animation utilities or Tailwind animation classes

### Task 8.2: Loading States

- Add skeleton loaders for dynamic content (calculator results)
- Subtle pulse animation on confidence score while calculating

**Files**: New skeleton components or inline

### Task 8.3: Empty States

- Design empty states for: no search results, no risk factors selected, empty categories
- Each with a relevant illustration or icon + helpful text

**Files**: Various

---

## Implementation Priority

| Priority | Phase | Impact | Effort |
|----------|-------|--------|--------|
| **P0** | 1.1, 1.2 | Brand color + chromatic grays transform the entire feel | Low |
| **P0** | 5.1 | Dark header creates instant visual authority | Low |
| **P1** | 2.1 | Typography scale fixes readability issues | Medium |
| **P1** | 4.1 | Card accent borders create wayfinding | Low |
| **P1** | 5.2 | Dark chart canvas = signature moment | Medium |
| **P1** | 3.3 | Mobile nav is a functional gap | Medium |
| **P2** | 1.3, 2.2 | Chart token unification + mono expansion | Low |
| **P2** | 3.1, 3.2, 3.4 | Layout harmony + breadcrumbs + spacing | Medium |
| **P2** | 4.2, 4.3 | Hover states + hero stats | Low |
| **P2** | 5.3, 5.4 | Home hero + category colors | Medium |
| **P3** | 6.1, 6.2 | Teaching mode visual layer | Medium |
| **P3** | 7.1, 7.2, 7.3 | Mobile + dark mode + a11y | High |
| **P3** | 8.1, 8.2, 8.3 | Micro-interactions + polish | Medium |

---

## Color Palette Reference

### Primary Palette (Anchor + Companion + Spark)

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Anchor | `--primary` | `oklch(0.45 0.12 245)` | Header, CTAs, primary borders, nav active |
| Anchor Light | `--primary/10` | 10% opacity variant | Hover backgrounds, tints |
| Companion | `--brand-teal` | `oklch(0.62 0.14 175)` | Teaching mode, positive states, success |
| Spark | `--brand-coral` | `oklch(0.65 0.18 25)` | Alerts, risk highlights, urgent CTAs |

### Medical Semantic (Unchanged, working well)

| Token | Current Value | Status |
|-------|--------------|--------|
| `--risk-high` | `oklch(0.577 0.245 27.325)` | Keep |
| `--risk-moderate` | `oklch(0.705 0.213 47.604)` | Keep |
| `--risk-low` | `oklch(0.627 0.14 164.789)` | Keep |
| `--evidence-*` | Various | Keep |
| `--ga-*` | Various | Keep |
| `--confidence-*` | Various | Keep |

### Neutrals (New Chromatic Grays)

| Token | Current | New | Delta |
|-------|---------|-----|-------|
| `--background` | `oklch(1 0 0)` | `oklch(0.985 0.005 245)` | Blue-white tint |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.15 0.01 245)` | Barely tinted |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.96 0.008 245)` | Cool muted |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.45 0.015 245)` | Darker, tinted |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.90 0.01 245)` | Slightly more visible |

---

## Success Criteria

After implementation, the app should pass these tests:

1. **Squint test**: At 25% zoom, you can identify the header (dark), content sections (light with colored accents), and the risk curve (dark canvas with colored lines)
2. **Grayscale test**: With color removed, hierarchy is still clear through value contrast alone
3. **Temperature test**: Header/charts feel cool-analytical; teaching content feels warmer
4. **3-color audit**: Steel blue (30%), teal (small accents), coral (≤10% for alerts)
5. **Hero element**: Every major page has one dominant visual element
6. **Mobile test**: Full functionality on 375px viewport, all touch targets ≥ 44px
7. **WCAG AA**: All text passes 4.5:1 contrast (normal) or 3:1 (large/bold)
