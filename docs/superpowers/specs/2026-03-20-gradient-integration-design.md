# Kairos Gradient Integration Design Spec

**Goal:** Extend the pink→purple→blue brand gradient (`--kairos-gradient`) into 10 additional touch-points across the app, creating a cohesive visual identity that echoes the logo's diverging-curves motif.

**Prerequisite:** Phase 1–4 rebrand complete. CSS custom properties `--kairos-gradient`, `--kairos-glow`, `--kairos-focus`, `--brand-blue`, `--brand-purple`, `--brand-pink` already defined in `globals.css` for both light and dark modes.

---

## Tier 1: Global Chrome (every page)

### A. Header bottom edge

**File:** `src/components/layout/header.tsx`

Replace the current `border-b border-white/10` on the `<header>` element with a gradient line. Implementation: add a `::after` pseudo-element or a child `<div>` using the existing `kairos-divider` CSS class (already defined in `globals.css`). The teaching-mode indicator bar (3px amber→teal gradient) remains as an additive element above/below the gradient line.

### B. Footer top edge

**File:** `src/components/layout/footer.tsx`

Replace `border-t` on `<footer>` with the same gradient line approach. Mirrors the header, bookending every page with the brand gradient.

### H. Custom scrollbar

**File:** `src/app/globals.css`

Add scrollbar styling using:
- Firefox: `scrollbar-color: var(--brand-purple) transparent` on `html`
- WebKit: `::-webkit-scrollbar-thumb` with `background: var(--kairos-gradient)`
- Track: transparent or near-transparent
- Width: thin (8px)
- Graceful fallback: browsers that don't support custom scrollbars show defaults

---

## Tier 2: Home Page + Page-Level Accents

### C. Page heading underlines

**File:** `src/app/globals.css` (new class), then applied in 5 page files

New CSS class `kairos-heading` that adds a `::after` pseudo-element:
- Width: 70px
- Height: 2px
- Background: `var(--kairos-gradient)`
- Position: below the text, left-aligned
- Border-radius: 1px

Applied to h1 elements on these pages:
- `src/app/conditions/page.tsx` — "Delivery Timing by Condition"
- `src/app/evidence/page.tsx` — "Evidence Library"
- `src/app/about/page.tsx` — "Methodology & Disclaimers"
- `src/app/calculator/page.tsx` — page heading
- `src/components/methodology/methodology-page-content.tsx` — "How kairos Works"

NOT applied to the home page h1 (hero logo serves that purpose).

### D. Stat card gradient numbers

**File:** `src/app/page.tsx`

The `StatCard` component's value text currently uses per-card accent colors (`text-primary`, `text-[var(--brand-teal)]`, etc.). Replace all 4 with gradient text:

```css
background: var(--kairos-gradient);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Add a `kairos-gradient-text` utility class in `globals.css` to avoid repetition.

### E. Primary CTA gradient button

**File:** `src/app/page.tsx`

The "Browse Conditions" hero button currently uses `bg-primary`. Replace with:
- `background: var(--kairos-gradient)`
- `color: white` (text)
- Remove `shadow-primary/25` (replace with neutral shadow)
- Hover: slight brightness increase via `filter: brightness(1.1)`

The secondary "Risk Curve" button stays as outlined.

### I. Loading shimmer animation

**File:** `src/app/globals.css`

New keyframe and utility class:

```css
@keyframes kairos-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.kairos-shimmer {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--brand-purple) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: kairos-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .kairos-shimmer {
    animation: none;
    background: var(--muted);
  }
}
```

This is a utility class available for any loading skeleton. No specific component changes required now — it's infrastructure for future use.

---

## Tier 3: Condition & Evidence Detail

### F. Evidence grade badge — High only

**File:** `src/components/condition/evidence-grade-badge.tsx`

When the evidence grade strength is `"high"`, apply a gradient border instead of the current solid green. Implementation approach: use a wrapper with `background: var(--kairos-gradient)` and `padding: 1px` around an inner element with the card background, creating a gradient border effect (the `border-image` approach doesn't work well with `border-radius`).

Other grade levels (moderate, low, very_low, expert_consensus) remain unchanged.

### G. Condition detail header card

**File:** `src/components/condition/condition-detail.tsx`

The top-level header card (`.rounded-xl.border.bg-card.p-5.shadow-sm`) gains a 2px gradient top accent. Implementation: add a child `<div>` at the top of the card with `kairos-divider` class, or use a `border-top` approach with gradient. The existing border and rounded corners remain.

### J. Compare page connector lines

**File:** `src/app/compare/page.tsx`

If the compare page uses visual connector lines or relationship indicators between compared conditions, apply SVG gradient strokes using `url(#kairos-gradient)`. If the compare page is purely list/table-based with no visual connectors, add a gradient divider between the compared condition sections instead.

---

## CSS Utility Classes Summary

New classes added to `globals.css`:

| Class | Purpose |
|-------|---------|
| `kairos-gradient-text` | Gradient text color via background-clip |
| `kairos-heading` | h1 underline accent (70px gradient bar) |
| `kairos-shimmer` | Loading skeleton gradient sweep |
| Scrollbar styles | Global scrollbar theming |

Existing classes reused:
- `kairos-divider` — header/footer edge lines
- `kairos-card-hover` — already on cards

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/globals.css` | New utility classes, scrollbar styles, shimmer keyframe |
| `src/components/layout/header.tsx` | Border → gradient line |
| `src/components/layout/footer.tsx` | Border → gradient line |
| `src/app/page.tsx` | Stat card gradient text, CTA button gradient |
| `src/app/conditions/page.tsx` | h1 kairos-heading class |
| `src/app/evidence/page.tsx` | h1 kairos-heading class |
| `src/app/about/page.tsx` | h1 kairos-heading class |
| `src/app/calculator/page.tsx` | h1 kairos-heading class |
| `src/components/methodology/methodology-page-content.tsx` | h1 kairos-heading class |
| `src/components/condition/condition-detail.tsx` | Header card gradient top accent |
| `src/components/condition/evidence-grade-badge.tsx` | High grade gradient border |
| `src/app/compare/page.tsx` | Connector lines or section dividers |

---

## Constraints

- All gradient values reference CSS custom properties — no hardcoded hex in component files
- Dark mode variants already defined in `globals.css` (boosted chroma)
- `prefers-reduced-motion: reduce` disables shimmer animation
- Scrollbar styles degrade gracefully (no-op on unsupported browsers)
- No JavaScript needed — all changes are CSS classes + className updates
