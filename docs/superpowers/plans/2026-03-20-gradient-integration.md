# Kairos Gradient Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the pink→purple→blue brand gradient into 10 additional touch-points across the app, creating a cohesive visual identity.

**Architecture:** All changes are CSS classes + `className` updates — no JavaScript logic changes. New utility classes go into `globals.css`, then component files reference them via class names. All gradient values use existing CSS custom properties (`--kairos-gradient`, `--brand-blue`, `--brand-purple`, `--brand-pink`).

**Tech Stack:** CSS custom properties, Tailwind CSS v4, Next.js App Router, React

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/app/globals.css` | New utility classes: `kairos-gradient-text`, `kairos-heading`, `kairos-shimmer`, scrollbar styles |
| `src/components/layout/header.tsx` | Header gradient bottom edge |
| `src/components/layout/footer.tsx` | Footer gradient top edge |
| `src/app/page.tsx` | StatCard gradient text + CTA button gradient |
| `src/app/conditions/page.tsx` | h1 `kairos-heading` class |
| `src/app/evidence/page.tsx` | h1 `kairos-heading` class |
| `src/app/about/page.tsx` | h1 `kairos-heading` class |
| `src/app/calculator/page.tsx` | h1 `kairos-heading` class |
| `src/components/methodology/methodology-page-content.tsx` | h1 `kairos-heading` class |
| `src/components/condition/condition-detail.tsx` | Header card gradient top accent |
| `src/components/condition/evidence-grade-badge.tsx` | High grade gradient border |
| `src/app/compare/page.tsx` | h1 `kairos-heading` class + gradient section dividers |

---

## Chunk 1: CSS Utility Classes (globals.css)

### Task 1: Add `kairos-gradient-text` utility class

**Files:**
- Modify: `src/app/globals.css` (after `.kairos-card-hover` block, ~line 315)

- [ ] **Step 1: Add the gradient text utility class**

In `src/app/globals.css`, after the `.kairos-card-hover:hover` block (line 315), add:

```css
/* Gradient text — use on stat numbers, badges, or any inline text */
.kairos-gradient-text {
  background: var(--kairos-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`
Open DevTools, manually add `kairos-gradient-text` to any element to confirm gradient text appears.

---

### Task 2: Add `kairos-heading` utility class

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the heading underline class**

Immediately after the `kairos-gradient-text` block, add:

```css
/* Page heading underline — 70px gradient bar below h1 elements */
.kairos-heading {
  position: relative;
  padding-bottom: 12px;
}
.kairos-heading::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 70px;
  height: 2px;
  background: var(--kairos-gradient);
  border-radius: 1px;
}
```

- [ ] **Step 2: Verify in browser**

Add `kairos-heading` class to any h1 element in DevTools, confirm the 70px gradient bar appears below the text, left-aligned.

---

### Task 3: Add scrollbar styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add scrollbar styling**

After the `kairos-heading` block, add:

```css
/* Custom scrollbar — branded gradient thumb */
html {
  scrollbar-color: var(--brand-purple) transparent;
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--kairos-gradient);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--kairos-gradient);
  filter: brightness(1.1);
}
```

- [ ] **Step 2: Verify in browser**

Scroll any long page in Chrome/Safari. Confirm the scrollbar thumb shows the gradient. In Firefox, confirm a purple thumb. Non-supporting browsers show default scrollbar (graceful fallback).

---

### Task 4: Add shimmer loading animation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add shimmer keyframe and class**

After the scrollbar styles, add:

```css
/* Loading shimmer — branded gradient sweep for skeletons */
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

- [ ] **Step 2: Verify in browser**

Add `kairos-shimmer` class to a div with fixed height in DevTools. Confirm the gradient sweeps left-to-right. Enable reduced motion in OS settings, confirm animation stops and shows solid muted background.

- [ ] **Step 3: Commit all CSS utility classes**

```bash
git add src/app/globals.css
git commit -m "feat: add gradient utility classes (text, heading, scrollbar, shimmer)"
```

---

## Chunk 2: Global Chrome — Header & Footer

### Task 5: Header gradient bottom edge

**Files:**
- Modify: `src/components/layout/header.tsx`

The header currently has `border-b border-white/10` on the `<header>` element (line 23). We need to replace this border with a gradient line, keeping the teaching-mode bar as an additive element.

- [ ] **Step 1: Remove `border-b border-white/10` from header and add gradient child div**

In `src/components/layout/header.tsx`, on line 23, change the `<header>` className:

Replace:
```tsx
<header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--header-bg)]/95">
```

With:
```tsx
<header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--header-bg)]/95">
```

Then, just before the closing `</header>` tag (before line 106), AFTER the mobile nav drawer block but BEFORE `</header>`, add the gradient line div. The gradient line should appear after the main content but before (or after) the teaching mode bar. Place it right after the main `<div className="mx-auto flex h-14...">` content div and before the teaching-mode indicator:

Actually, looking at the structure more carefully — the teaching-mode bar and mobile nav are both conditional. The gradient line should be a persistent bottom edge. Add it as the LAST child inside `<header>`, after the mobile nav block:

Replace the closing section of the header (lines 104-106):
```tsx
      )}
    </header>
```

With:
```tsx
      )}

      {/* Gradient bottom edge */}
      <div className="kairos-divider" />
    </header>
```

- [ ] **Step 2: Verify in browser**

Run dev server. Confirm the header now shows a subtle gradient line at the bottom instead of the plain white border. The teaching mode amber bar should still appear when toggled ON, stacking above the gradient line.

---

### Task 6: Footer gradient top edge

**Files:**
- Modify: `src/components/layout/footer.tsx`

The footer has `border-t` on the `<footer>` element (line 7).

- [ ] **Step 1: Replace border-t with gradient line**

In `src/components/layout/footer.tsx`, on line 7, change:

```tsx
    <footer className="mt-auto border-t py-6">
```

To:

```tsx
    <footer className="mt-auto py-6">
      <div className="kairos-divider" />
```

Then add a closing `</div>` — actually, no. The `kairos-divider` is a self-contained div. We just need to insert it as the first child of `<footer>` and remove `border-t`. The structure becomes:

```tsx
    <footer className="mt-auto py-6">
      <div className="kairos-divider mb-6" />
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
```

So replace:
```tsx
    <footer className="mt-auto border-t py-6">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
```

With:
```tsx
    <footer className="mt-auto py-6">
      <div className="kairos-divider mb-6" />
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
```

- [ ] **Step 2: Verify in browser**

Scroll to the footer. Confirm the gradient line appears at the top of the footer area, replacing the plain border. It should mirror the header's gradient line.

- [ ] **Step 3: Commit header and footer changes**

```bash
git add src/components/layout/header.tsx src/components/layout/footer.tsx
git commit -m "feat: replace header/footer borders with gradient lines"
```

---

## Chunk 3: Home Page — Stat Cards & CTA Button

### Task 7: Gradient text on stat card numbers

**Files:**
- Modify: `src/app/page.tsx`

The `StatCard` component (line 113-126) currently accepts an `accent` prop for per-card text color. We'll replace all 4 accent values with the `kairos-gradient-text` class.

- [ ] **Step 1: Update StatCard component to use gradient text**

In `src/app/page.tsx`, replace the `StatCard` function (lines 113-126):

```tsx
function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 text-center">
        <CardTitle className={`text-4xl font-bold font-mono tracking-tight ${accent}`}>
          {value}
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider font-medium mt-1">
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
```

With:

```tsx
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 text-center">
        <CardTitle className="text-4xl font-bold font-mono tracking-tight kairos-gradient-text">
          {value}
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider font-medium mt-1">
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
```

- [ ] **Step 2: Update StatCard usage to remove accent props**

In the same file, replace lines 68-72:

```tsx
        <StatCard label="Conditions" value={String(allConditions.length)} accent="text-primary" />
        <StatCard label="Categories" value={String(categories.size)} accent="text-[var(--brand-teal)]" />
        <StatCard label="Landmark Trials" value={String(allTrials.length)} accent="text-[var(--evidence-moderate)]" />
        <StatCard label="Risk Factors" value="13" accent="text-[var(--brand-coral)]" />
```

With:

```tsx
        <StatCard label="Conditions" value={String(allConditions.length)} />
        <StatCard label="Categories" value={String(categories.size)} />
        <StatCard label="Landmark Trials" value={String(allTrials.length)} />
        <StatCard label="Risk Factors" value="13" />
```

- [ ] **Step 3: Verify in browser**

Open the home page. All 4 stat card numbers should display the pink→purple→blue gradient text instead of individual accent colors.

---

### Task 8: Gradient CTA button

**Files:**
- Modify: `src/app/page.tsx`

The "Browse Conditions" button (line 49-52) currently uses `bg-primary`.

- [ ] **Step 1: Replace solid button with gradient button**

Replace lines 48-52:

```tsx
            <Link
              href="/conditions"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
            >
              Browse Conditions
            </Link>
```

With:

```tsx
            <Link
              href="/conditions"
              className="inline-flex h-11 items-center rounded-lg px-7 text-sm font-medium text-white shadow-md shadow-black/10 transition-all hover:shadow-lg hover:shadow-black/15"
              style={{ background: "var(--kairos-gradient)" }}
            >
              Browse Conditions
            </Link>
```

Note: We use inline `style` because Tailwind's `bg-` compiles to `background-color`, which doesn't support gradients. The `var(--kairos-gradient)` is a `linear-gradient()` value that requires the `background` shorthand.

- [ ] **Step 2: Verify in browser**

Open home page. "Browse Conditions" button should show the pink→purple→blue gradient with white text. Hovering should slightly increase shadow. "Risk Curve" button stays outlined.

- [ ] **Step 3: Commit home page gradient changes**

```bash
git add src/app/page.tsx
git commit -m "feat: gradient stat card numbers and CTA button on home page"
```

---

## Chunk 4: Page Heading Underlines

### Task 9: Apply `kairos-heading` to 5 page headings

**Files:**
- Modify: `src/app/conditions/page.tsx` (line 145)
- Modify: `src/app/evidence/page.tsx` (line 8)
- Modify: `src/app/about/page.tsx` (line 8)
- Modify: `src/app/calculator/page.tsx` (line 56)
- Modify: `src/components/methodology/methodology-page-content.tsx` (line 47)

NOT applied to the home page h1 (the hero logo serves that purpose).

- [ ] **Step 1: Conditions page — add `kairos-heading`**

In `src/app/conditions/page.tsx`, line 145, change:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight">
```

To:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
```

- [ ] **Step 2: Evidence page — add `kairos-heading`**

In `src/app/evidence/page.tsx`, line 8, change:

```tsx
      <h1 className="text-2xl font-semibold tracking-tight">Evidence Library</h1>
```

To:

```tsx
      <h1 className="text-2xl font-semibold tracking-tight kairos-heading">Evidence Library</h1>
```

- [ ] **Step 3: About page — add `kairos-heading`**

In `src/app/about/page.tsx`, line 8, change:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight">
```

To:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
```

- [ ] **Step 4: Calculator page — add `kairos-heading`**

In `src/app/calculator/page.tsx`, line 56, change:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight">
```

To:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
```

- [ ] **Step 5: Methodology page — add `kairos-heading`**

In `src/components/methodology/methodology-page-content.tsx`, line 47, change:

```tsx
          <h1 className="text-2xl font-semibold tracking-tight flex items-baseline gap-1.5">
```

To:

```tsx
          <h1 className="text-2xl font-semibold tracking-tight flex items-baseline gap-1.5 kairos-heading">
```

- [ ] **Step 6: Verify in browser**

Visit each of the 5 pages. Confirm a 70px gradient underline appears beneath each h1.

- [ ] **Step 7: Commit heading underlines**

```bash
git add src/app/conditions/page.tsx src/app/evidence/page.tsx src/app/about/page.tsx src/app/calculator/page.tsx src/components/methodology/methodology-page-content.tsx
git commit -m "feat: add gradient heading underlines to 5 page titles"
```

---

## Chunk 5: Condition Detail & Evidence Badge

### Task 10: Condition detail header card — gradient top accent

**Files:**
- Modify: `src/components/condition/condition-detail.tsx` (line 57)

The header card currently has `rounded-xl border bg-card p-5 shadow-sm`. We add a gradient top-edge accent using a child `<div>` with the `kairos-divider` class.

- [ ] **Step 1: Add gradient top accent to header card**

In `src/components/condition/condition-detail.tsx`, replace lines 57-58:

```tsx
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
```

With:

```tsx
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-[2px]" style={{ background: "var(--kairos-gradient)" }} />
        <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
```

And close the inner `<div className="p-5">` wrapper. Find the closing `</div>` of the header card section — the header card ends at line 79 with `</div>`. We need to add an extra closing `</div>` before it.

Replace the full header block (lines 57-79):

```tsx
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
            {CATEGORY_DISPLAY_NAMES[condition.category]}
          </span>
          {condition.parentConditionId && (
            <>
              <span className="text-border">/</span>
              <span>Sub-variant</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {condition.name}
        </h1>
        {condition.stratificationAxis && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Stratified by:{" "}
            <span className="font-medium text-foreground/80">{condition.stratificationAxis}</span>
          </p>
        )}
      </div>
```

With:

```tsx
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-[2px]" style={{ background: "var(--kairos-gradient)" }} />
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
              {CATEGORY_DISPLAY_NAMES[condition.category]}
            </span>
            {condition.parentConditionId && (
              <>
                <span className="text-border">/</span>
                <span>Sub-variant</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {condition.name}
          </h1>
          {condition.stratificationAxis && (
            <p className="mt-1.5 text-sm text-muted-foreground">
              Stratified by:{" "}
              <span className="font-medium text-foreground/80">{condition.stratificationAxis}</span>
            </p>
          )}
        </div>
      </div>
```

- [ ] **Step 2: Verify in browser**

Navigate to any condition detail page (e.g., `/conditions/chronic_htn_controlled_meds`). Confirm the header card has a 2px gradient line at its top edge, with the rounded corners preserved via `overflow-hidden`.

---

### Task 11: Evidence grade badge — gradient border for "high" grade

**Files:**
- Modify: `src/components/condition/evidence-grade-badge.tsx`

When grade strength is `"high"`, we wrap the badge in a gradient border using the padding-wrapper technique (since `border-image` doesn't work with `border-radius`).

- [ ] **Step 1: Replace the EvidenceGradeBadge component**

Replace the entire contents of `src/components/condition/evidence-grade-badge.tsx`:

```tsx
import type { EvidenceGrade } from "@/data/types";
import { Badge } from "@/components/ui/badge";

const gradeColors: Record<string, string> = {
  high: "bg-[var(--evidence-high)] text-white",
  moderate: "bg-[var(--evidence-moderate)] text-white",
  low: "bg-[var(--evidence-low)] text-black",
  very_low: "bg-muted text-muted-foreground",
  expert_consensus: "bg-muted text-muted-foreground",
};

export function EvidenceGradeBadge({ grade }: { grade: EvidenceGrade }) {
  const isHigh = grade.strength === "high";

  if (isHigh) {
    return (
      <span className="inline-flex rounded-md p-[1px]" style={{ background: "var(--kairos-gradient)" }}>
        <Badge className="text-[11px] bg-[var(--evidence-high)] text-white rounded-[calc(0.375rem-1px)]">
          Grade {grade.raw}
        </Badge>
      </span>
    );
  }

  return (
    <Badge className={`text-[11px] ${gradeColors[grade.strength] ?? ""}`}>
      Grade {grade.raw}
    </Badge>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to a condition with a "High" evidence grade. Confirm the badge has a gradient border. Other grade levels (moderate, low, etc.) should remain unchanged.

- [ ] **Step 3: Commit condition detail and badge changes**

```bash
git add src/components/condition/condition-detail.tsx src/components/condition/evidence-grade-badge.tsx
git commit -m "feat: gradient top accent on condition header, gradient border on high evidence badges"
```

---

## Chunk 6: Compare Page

### Task 12: Compare page heading underline + gradient section dividers

**Files:**
- Modify: `src/app/compare/page.tsx` (line 295 for h1, plus divider between compared condition sections)

The compare page is table/list-based — no visual connector lines exist. Per spec, we add a gradient divider between compared condition sections and the `kairos-heading` class to the h1.

- [ ] **Step 1: Add `kairos-heading` to compare page h1**

In `src/app/compare/page.tsx`, line 295, change:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight">
```

To:

```tsx
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
```

- [ ] **Step 2: Add gradient divider between selected conditions banner and comparison results**

In `src/app/compare/page.tsx`, find line 459 — the closing `)}` of the "Selected Conditions Banner" block (the `{selected.length > 0 && (` block). Immediately after that closing `)}` and before the empty state / comparison results, insert a gradient divider:

After line 459 (`      )}`), add:

```tsx
      {/* Gradient divider between selection and results */}
      {selected.length > 0 && <hr className="kairos-divider mb-6" />}
```

This adds a gradient divider between the selected condition cards and the comparison table/empty state below, consistent with the home page divider pattern.

- [ ] **Step 3: Verify in browser**

Navigate to `/compare`. Confirm the h1 has the gradient underline. Select 2+ conditions and confirm a gradient divider appears between the controls and the comparison cards.

- [ ] **Step 4: Commit compare page changes**

```bash
git add src/app/compare/page.tsx
git commit -m "feat: gradient heading underline and section dividers on compare page"
```

---

## Summary

| Commit | Changes |
|--------|---------|
| 1 | CSS utility classes: `kairos-gradient-text`, `kairos-heading`, scrollbar, `kairos-shimmer` |
| 2 | Header/footer gradient edge lines |
| 3 | Home page: gradient stat card numbers + CTA button |
| 4 | Gradient heading underlines on 5 pages |
| 5 | Condition detail header accent + high evidence badge gradient border |
| 6 | Compare page heading + section dividers |

Total: 12 files modified, 6 commits, ~10 tasks.
