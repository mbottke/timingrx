# Methodology Phase A — Pipeline View Design Spec

**Date:** 2026-03-19
**Phase:** A (Animated Pipeline with Particle System)
**Location:** `/methodology` page, "Pipeline View" tab
**Depends on:** Phase B (Interactive Explorer) — shares MethodologyContext

---

## Overview

An animated SVG pipeline visualization showing the risk calculation as a top-to-bottom data flow. Particles carry risk values through stages: Muglu input → multiplier gates → CI expansion chamber → 5 parallel confidence filters → final output. The pipeline shares state with Phase B via MethodologyContext, so toggling factors in the toolbar updates both views simultaneously.

**Key innovation:** The particle system's speed, density, and color directly encode risk magnitude, making the abstract math viscerally tangible.

---

## Page Architecture Change: Tabbed Methodology Page

The `/methodology` route becomes a tabbed page with 3 views:

```
┌─────────────────────────────────────────────────────┐
│  How TimingRx Works                                  │
│  [Interactive Explorer]  [Pipeline View]  [Timeline]  │
│  ─────────────────────────────────────────────────── │
│  (Active tab content renders here)                    │
└─────────────────────────────────────────────────────┘
```

- **Tab 1: "Interactive Explorer"** — Existing Phase B (dual-track, 6 sections)
- **Tab 2: "Pipeline View"** — This spec (animated pipeline)
- **Tab 3: "Timeline"** — Phase C (future, renders placeholder)

### Shared State

All tabs share the same `MethodologyProvider` context and the same sticky `FactorToolbar`. Toggling a factor updates whichever tab is active.

### URL Persistence

Tab selection stored as query param: `/methodology?view=explorer`, `/methodology?view=pipeline`, `/methodology?view=timeline`. Default: `explorer`. Uses Next.js `useSearchParams` for reading + `useRouter` for updating.

### Server/Client Component Boundary

The current `page.tsx` is a Server Component (exports `metadata`). Since tabs require `useSearchParams`, the page must extract a client component:

- `src/app/methodology/page.tsx` — remains Server Component, exports `metadata`, renders `<MethodologyProvider><MethodologyPageContent /></MethodologyProvider>`
- `src/components/methodology/methodology-page-content.tsx` — new Client Component (`"use client"`), uses `useSearchParams` + `useRouter` for tab state, conditionally renders `<FactorToolbar>`, `<SectionNav>` (only for explorer tab), `<MethodologyTabs>`, and the active tab's content

This preserves SSR metadata while enabling client-side tab routing.

### Section Nav Visibility

`SectionNav` is conditionally rendered inside `MethodologyPageContent` only when `activeTab === "explorer"`. No changes needed to `section-nav.tsx` itself.

---

## Pipeline Layout

### Overall Structure

The pipeline is a single vertically-scrolling visualization, centered with max-width 800px. It consists of SVG structure (stages + pipes) with a Canvas overlay (particles).

```
┌─ Factor Toolbar (shared, sticky) ─────────────────────┐
├─ Tabs ────────────────────────────────────────────────┤
│                                                        │
│              ┌──────────────┐                          │
│              │  MUGLU INPUT │  ← Stage 0               │
│              │   0.40/1,000 │                          │
│              └──────┬───────┘                          │
│                     │                                   │
│              ┌──────┴───────┐                          │
│              │  × Age ≥40   │  ← Multiplier Gate 1     │
│              └──────┬───────┘                          │
│                     │                                   │
│              ┌──────┴───────┐                          │
│              │  × BMI 35+   │  ← Multiplier Gate 2     │
│              └──────┬───────┘                          │
│                     │                                   │
│              ┌──────┴───────┐                          │
│              │ CI EXPANSION │  ← Uncertainty Chamber    │
│              └──────┬───────┘                          │
│                     │                                   │
│         ┌───┬───┬──┴──┬───┬───┐                       │
│         │EQ │MV │ IP  │MP │RP │  ← 5 Parallel Filters │
│         └───┴───┴──┬──┴───┴───┘                       │
│                     │                                   │
│              ┌──────┴───────┐                          │
│              │  GRADE: B    │  ← Final Output          │
│              │  1.58/1,000  │                          │
│              └──────────────┘                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Coordinate System

A custom hook (`usePipelineLayout`) computes the SVG coordinates for all stages based on:
- Container width (responsive)
- Number of active factors (determines how many gates to render)
- Fixed vertical spacing: 80px between stages, 60px for the parallel filter section

Output: an array of `StageLayout` objects that both the SVG and Canvas layers use:

```typescript
type StageType = "muglu" | "gate" | "interaction" | "ci" | "filter" | "output";

interface StageLayout {
  id: string;           // e.g., "muglu", "gate_age_gte_40", "filter_eq", "output"
  type: StageType;
  x: number;            // center x
  y: number;            // top y
  width: number;
  height: number;
  color?: string;       // factor/filter/grade color
  pipeInY?: number;     // y-coordinate where the input pipe connects
  pipeOutY?: number;    // y-coordinate where the output pipe connects
}
```

---

## Pipeline Stages

### Stage 0: Muglu Input Node

- **Shape:** Rounded rectangle, 200×60px, primary border (2px)
- **Content:** GA display (e.g., "39w0d"), baseline risk value (AnimatedNumber), "Muglu 2019" source label in muted text
- **Animation:** Value pulses briefly when GA changes
- **Hover:** Popover showing the 6-row data table (GA + risk + CI)
- **Click:** Switches to Explorer tab then scrolls to Section 1. Implementation: call `router.replace('?view=explorer')`, then in a `requestAnimationFrame` callback (after DOM mount), call `document.getElementById('section-baseline')?.scrollIntoView({ behavior: 'smooth' })`. This pattern applies to all stage click handlers.

### Stage 1..N: Multiplier Gates

- **Shape:** Trapezoid/funnel — 180px wide at top, 200px at bottom, 50px tall. Conveys risk expansion.
- **Border:** 2px in the factor's assigned color
- **Background:** Factor color at 8% opacity
- **Content:** Factor label, "×" + multiplier value, cumulative risk after this gate (AnimatedNumber)
- **Dynamic rendering:** One gate per active factor, ordered by `activeFactorIds` array order
- **Enter animation:** Spring slide-in from left (200ms), pipe segments reconnect
- **Exit animation:** Spring slide-out to right (200ms), pipe segments reconnect
- **Hover:** Popover with source citation, evidence grade badge, data reliability score
- **Click:** Smooth-scrolls to Phase B Section 2

### Interaction Adjustment Gates

- **Rendered when:** `applyInteractions` is true AND both factors of an interaction pair are active
- **Shape:** Same trapezoid but with dotted border (2px dashed) and narrower (160px wide)
- **Content:** Italic label (e.g., "BMI × DM interaction"), multiplier (e.g., "×0.85"), cumulative risk
- **Color:** Slate (#64748b) — neutral, distinct from factor colors. Note: `pipeline-stage.tsx` must use this hardcoded slate color for `isInteraction: true` steps, ignoring the `color` property from `StepBreakdown` (which may contain the first factor's color).
- **Position:** Immediately after the last factor of the interaction pair

### Stage CI: Uncertainty Chamber

- **Shape:** Wide rounded rectangle, 240×70px, with an animated "expansion" visual
- **Visual metaphor:** The input pipe is narrow (3px) and the output pipe is wider (proportional to CI width, 6-12px range)
- **Content:** "95% CI" label, lower bound – upper bound, combined SE
- **Internal animation:** Gentle pulse (scale 1.0→1.02→1.0 over 2s loop). Inside the chamber, colored stripes represent each factor's variance contribution (matching the Phase B Section 3 bars)
- **Hover:** Popover with the quadrature formula and per-factor variance breakdown
- **Click:** Smooth-scrolls to Phase B Section 3

### Stage Confidence: 5 Parallel Filters (Branching)

- **Structure:** Main pipe splits into 5 parallel vertical paths, each 40px wide, spaced 20px apart
- **Each filter:** Vertical rectangle (40×80px) with fill level representing the component value (0-1). Background: muted. Fill: component color. Label above (EQ/MV/IP/MP/RP), value below.
- **Colors and field mapping:**

| Abbreviation | Codebase field (`breakdown.*`) | Color |
|---|---|---|
| EQ | `evidenceQuality` | #3b82f6 |
| MV | `modelValidity` | #8b5cf6 |
| IP | `interactionPenalty` | #f59e0b |
| MP | `magnitudePlausibility` | #14b8a6 |
| RP | `rareDiseaseValidity` | #f43f5e |
- **Reconvergence:** Below the 5 filters, paths merge back into a single pipe. At the merge point, a small "×" multiplication badge shows the 5 values combining.
- **Animation:** Filter fill levels animate with framer-motion spring when values change. Filters that drop below 0.8 flash red briefly.
- **Hover on any filter:** Popover with that component's formula
- **Click:** Smooth-scrolls to Phase B Section 4

### Stage Output: Final Result Node

- **Shape:** Large rounded rectangle, 220×80px
- **Background:** Grade color (A=#22c55e, B=#3b82f6, C=#f59e0b, D=#f97316, F=#ef4444) at 15% opacity
- **Border:** Grade color at full
- **Content:** Grade letter (24px bold), score number, adjusted risk per 1,000 (AnimatedNumber), CI range
- **OR correction badge:** If triggered, a small amber badge shows "Corrected: X.XX" below the main value
- **Hover:** Popover with grade definition text
- **Click:** Smooth-scrolls to Phase B Section 6

---

## Particle System

### Architecture

SVG handles static structure (stages, pipes). A Canvas element overlays the SVG for particle rendering. Both layers are absolutely positioned in a relative container and share the same coordinate system via `usePipelineLayout`.

### Particle Properties

| Property | Baseline (no factors) | High risk (5+ factors) |
|---|---|---|
| Speed | 60 px/s | 200 px/s (capped 250) |
| Spawn rate | 1 per 800ms | 1 per 200ms |
| Size | 6px | 8px |
| Color | slate-400 (#94a3b8) | Warms through pipeline |
| Trail length | 15px | 30px |
| Trail opacity | 25% | 40% |
| Glow radius | 2px | 4px |

### Speed Formula

```
speed = min(250, 60 + (combinedMultiplier - 1) * 20)
```

### Spawn Rate Formula

```
interval = max(200, 800 - activeFactorCount * 100)
```

### Color Progression

Particles start as slate-400 (#94a3b8) at the Muglu node. As they pass through each multiplier gate, their color blends toward that factor's assigned color using **RGB linear interpolation** (30% blend per gate):

```typescript
function lerpColor(from: string, to: string, t: number): string {
  // Parse hex to RGB, lerp each channel, return hex
  const f = hexToRgb(from), t2 = hexToRgb(to);
  const r = Math.round(f.r + (t2.r - f.r) * t);
  const g = Math.round(f.g + (t2.g - f.g) * t);
  const b = Math.round(f.b + (t2.b - f.b) * t);
  return `rgb(${r},${g},${b})`;
}
```

By the output stage, color reflects the final grade:
- Grade A: emerald-500
- Grade B: blue-500
- Grade C: amber-500
- Grade D: orange-500
- Grade F: red-500

### Trail Rendering

Each particle maintains a position history (last 4-6 frames). The trail is rendered as a gradient line from current position (full opacity) to the oldest history point (0% opacity). Trail width tapers from particle size to 0.

```
ctx.beginPath();
ctx.moveTo(current.x, current.y);
for (const point of history) {
  ctx.lineTo(point.x, point.y);
}
// Gradient stroke: currentColor → transparent
```

### Glow Effect

Applied via `ctx.shadowBlur` and `ctx.shadowColor` on each particle draw call. Shadow blur radius scales with risk (2-4px).

### Reactive Behaviors

- **Factor toggled ON:** Burst of 5 particles from the new gate, accelerating
- **Factor toggled OFF:** Particles at the removed gate scatter briefly (random velocity for 200ms), then resume normal flow
- **GA changed:** All particles accelerate for 500ms then settle to new calculated speed

### Performance

- Canvas `requestAnimationFrame` loop, capped at 60fps
- Maximum 30 particles alive at once (older particles removed when limit reached)
- When tab is not active (hidden), animation loop pauses via `document.visibilityState`
- Note: do NOT use `will-change: transform` on Canvas elements — Canvas paints directly, CSS layer promotion provides no benefit and wastes memory

### Reduced Motion

When `prefers-reduced-motion` is active:
- No particle animation — static dots rendered at each stage center
- No pipe dash animation
- No stage enter/exit animations
- All values still update reactively

---

## Pipe Segments

SVG `<path>` elements connecting stages.

### Main Flow Pipes
- Stroke: 3px
- Color: CSS gradient from upstream stage color to downstream stage color
- Animated dash pattern: `stroke-dasharray="4 4"` with `stroke-dashoffset` animated in the direction of flow (same speed as particles)

### Confidence Branch Pipes
- 5 pipes splitting from the main flow
- Stroke: 1.5px
- Each colored to match its filter (EQ=blue, MV=violet, etc.)
- Curved bezier paths from the branch point to each filter's top center

### CI Output Pipe
- The pipe exiting the CI chamber is wider than the input pipe
- Width: `max(4, min(12, Math.log2(1 + ciWidth * 20) * 3))` where ciWidth = ciHigh - ciLow (log-scaled to produce visible variation across the typical CI range of 0.1–5.0)
- This visually represents the uncertainty expansion

### Dynamic Reconnection
When gates are added/removed, pipe segments animate to new positions using framer-motion `motion.path` with `d` attribute animation (morphing path shape).

---

## Hover Popovers

Each stage has a hover-triggered popover using a shared `PipelineHoverCard` component.

### Structure
```
┌─ HoverCard ──────────────────┐
│ Stage Title          [Grade] │
│ ──────────────────────────── │
│ Key-value details            │
│ Formula (if applicable)      │
│                              │
│ Click to explore in detail → │
└──────────────────────────────┘
```

- Max width: 280px
- Positioned above the stage (or below if near top of viewport)
- Appears after 200ms hover delay, disappears on mouse leave
- Content varies by stage type (see stage descriptions above)

---

## Responsive Behavior

| Breakpoint | Layout |
|---|---|
| ≥1024px | Full SVG pipeline, max-width 800px centered, Canvas particles |
| 768–1023px | SVG scales to 90% width, smaller fonts (text-[10px]), particles still active |
| <768px | **Simplified mode:** No SVG/Canvas. Stages render as styled cards in a vertical stack with connecting arrow icons between them. Particles disabled. Same information, card-based layout. |

### Mobile Simplified Mode

Each stage becomes a compact card:
```
┌────────────────────────────┐
│ ◉ Muglu Baseline           │
│   0.40 per 1,000 at 39w0d │
└────────────────────────────┘
        ↓
┌────────────────────────────┐
│ × Age ≥40 (×1.88)         │
│   → 0.75 per 1,000        │
└────────────────────────────┘
        ↓
      ...
```

Cards use the same factor colors, grade colors, and AnimatedNumber values as the full pipeline. Click still scrolls to Phase B.

---

## Tab Component

### MethodologyTabs

```typescript
interface Tab {
  id: "explorer" | "pipeline" | "timeline";
  label: string;
  icon?: string;
}

const TABS: Tab[] = [
  { id: "explorer", label: "Interactive Explorer" },
  { id: "pipeline", label: "Pipeline View" },
  { id: "timeline", label: "Timeline" },  // Phase C placeholder
];
```

- Renders as a horizontal button group below the page title, above the content
- Active tab: `bg-primary text-primary-foreground`
- Inactive: `bg-muted text-muted-foreground hover:text-foreground`
- URL sync via `useSearchParams` (read) + `router.replace` (write, shallow)
- Tab content uses `{activeTab === "explorer" && <ExplorerContent />}` pattern (not lazy — all content is lightweight enough)
- **Keyboard:** Follows WAI-ARIA Tabs pattern: `role="tablist"` on container, `role="tab"` + `aria-selected` on each tab button, `role="tabpanel"` on content. Arrow Left/Right moves focus between tabs. Home/End jump to first/last tab. Enter/Space activates focused tab.

### Timeline Placeholder (Tab 3)

```tsx
<div className="py-20 text-center">
  <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
  <p className="text-sm text-muted-foreground mt-1">
    The Timeline view will provide an anatomical visualization of delivery timing.
  </p>
</div>
```

---

## File Structure

### New Files

| File | Responsibility |
|---|---|
| `src/components/methodology/methodology-page-content.tsx` | Client component shell: tab state, URL sync, conditional rendering |
| `src/components/methodology/methodology-tabs.tsx` | Tab switcher with WAI-ARIA tablist pattern |
| `src/components/methodology/pipeline/pipeline-view.tsx` | Main pipeline container + Canvas particle layer |
| `src/components/methodology/pipeline/pipeline-stage.tsx` | Individual stage nodes (Muglu, Gate, CI, Output) |
| `src/components/methodology/pipeline/pipeline-filters.tsx` | 5 parallel confidence filter branches |
| `src/components/methodology/pipeline/pipeline-pipes.tsx` | SVG pipe segments connecting stages |
| `src/components/methodology/pipeline/particle-system.tsx` | Canvas particle spawner + animator |
| `src/components/methodology/pipeline/pipeline-hover-card.tsx` | Hover popover for stage inspection |
| `src/components/methodology/pipeline/use-pipeline-layout.ts` | Hook computing SVG coordinates for all stages |
| `src/components/methodology/pipeline/pipeline-mobile.tsx` | Simplified card-based layout for <768px |

### Modified Files

| File | Change |
|---|---|
| `src/app/methodology/page.tsx` | Simplify to server shell, delegate to MethodologyPageContent |
| `src/components/methodology/section-nav.tsx` | No changes needed (conditional rendering handled by parent) |

---

## Dependencies

No new dependencies. Uses:
- framer-motion (already installed) — stage enter/exit, filter fills, pipe morphing
- Canvas API (native) — particle rendering
- Existing AnimatedNumber, FormulaBlock components from Phase B

---

## Animation Performance Budget

| Metric | Target |
|---|---|
| Canvas particle render | <2ms per frame (30 particles max) |
| SVG pipe morph | 60fps via framer-motion GPU-accelerated transforms |
| Stage enter/exit | 200ms spring, no layout thrashing |
| Total JS for pipeline tab | <40KB gzipped (SVG + Canvas + layout hook) |
| `prefers-reduced-motion` | All animations disabled, static rendering |

---

## Error States

- If MethodologyContext produces invalid values: pipeline renders Muglu input + output only, with "Calculation error — showing baseline" message
- If Canvas API unavailable: particles don't render, SVG pipeline still works
- If zero factors active: pipeline shows Muglu input → CI chamber (pass-through) → confidence filters → output. No multiplier gates. A "no factors selected" annotation appears between Muglu and CI.

---

## Accessibility

- All stage nodes are focusable (`tabIndex={0}`) with `aria-label` describing the stage
- Tab/Enter on a stage triggers the same popover as hover
- Arrow keys navigate between stages vertically
- The Canvas particle layer has `aria-hidden="true"` (purely decorative)
- Screen reader users get a text summary below the pipeline: "Risk flows from baseline (X) through N factors to adjusted risk (Y) with confidence grade Z"
