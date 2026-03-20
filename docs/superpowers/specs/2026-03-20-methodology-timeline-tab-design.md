# Methodology Timeline Tab — Design Spec

**Date:** 2026-03-20
**Status:** Approved
**Author:** Michael Bottke, MD + Claude

## Purpose

The Timeline tab is the third view in the methodology section (alongside Explorer and Pipeline). It answers the clinical question: **"Given these risk factors, at what gestational age does risk become actionable?"**

It presents an interactive horizontal GA timeline (37w→42w) with an overlaid risk curve, cross-GA equivalence markers, and a glass-box detail card — all fully interactive and bidirectionally synced with the Factor Toolbar.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary framing | Cross-GA equivalence ("39w adjusted ≈ 41w baseline") | Most clinically intuitive counseling tool |
| Secondary framing | Fixed reference lines (1.0/1k, 2.0/1k) | Provides orientation anchors |
| Interactivity | Full — click weeks, scrub, bidirectional sync with toolbar | Timeline is a first-class control surface |
| Detail card | Glass-box with full factor breakdown | Matches app design decision #1 (transparency) |
| Playback | Auto-advance with play/pause, available to all users | Compelling enough for default, not teaching-only |
| Layout | Horizontal timeline chart + detail card below | Combines familiar clinical timeline with data density |

## Architecture

### Component Tree

```
TimelineView
├── description card (how-it-works)
├── TimelineChart (SVG)
│   ├── baseline curve (dashed)
│   ├── adjusted curve (solid) + CI band
│   ├── fixed reference lines
│   ├── cross-GA equivalence markers
│   └── clickable week nodes
├── TimelinePlayback (controls bar)
└── TimelineDetailCard
    ├── header (week, grade, equivalence tag)
    ├── risk summary (3 stat cells)
    ├── factor breakdown (expandable)
    └── counseling statement
```

### Data Flow

- `TimelineView` consumes `useMethodology()` — same context as Explorer and Pipeline.
- Clicking a week node calls `setGA()` → bidirectional sync with Factor Toolbar.
- `riskCurve` (all 6 GA points, 37–42w) drives the chart curves.
- For smooth visual interpolation between weekly data points, additional points are interpolated client-side using the existing `interpolateBaseline` function from the risk engine.
- `selectedGaCalculation` and `stepByStepBreakdown` from context drive the detail card.
- Cross-GA equivalence is computed locally: for each week, find the baseline week whose uncomplicated risk is the closest match to this week's adjusted risk. Strategy: find the baseline GA point with the minimum absolute difference to the adjusted risk. Only display the equivalence marker if a match exists at a later GA (earlier-GA equivalences aren't clinically useful) and the adjusted risk exceeds the baseline risk at the same GA.

**No new data files or engine changes.** The only new logic is the equivalence finder and the playback timer.

## Component Specs

### TimelineChart

**SVG, full-width, ~200px tall.**

Elements:
- **Horizontal axis:** 37w → 42w, evenly spaced clickable week nodes (circles).
- **Baseline curve:** Dashed line, `--primary` (steel blue). The uncomplicated pregnancy reference.
- **Adjusted curve:** Solid line, `--brand-coral`. With selected risk factors applied.
- **CI band:** Shaded fill between CI bounds around adjusted curve, `--brand-coral` at 12% opacity.
- **Fixed reference lines:** Horizontal dashed lines at 1.0/1,000 and 2.0/1,000 per ongoing pregnancies. Labeled on right edge. Color: `--muted-foreground` at 40%.
- **Cross-GA equivalence markers:** When a week's adjusted risk ≈ a later week's baseline risk, a dashed amber (`--ga-caution`) connector spans between those two week positions with a label (e.g., "39w adjusted ≈ 41w baseline").
- **Selected week indicator:** Active week node enlarges, gets a ring highlight, vertical hairline extends through the chart.
- **Hover:** Crosshair with tooltip showing interpolated risk at that point. Clicking snaps to nearest whole week.

**No factors selected state:**
- Only baseline curve shows (no adjusted curve, CI band, or equivalence markers).
- Detail card shows baseline-only data with note: "Add risk factors in the toolbar to see adjusted risk."

### TimelinePlayback

**Control bar between chart and detail card.**

Elements:
- Play/pause button (▶ / ⏸)
- Current week label
- Progress indicator: 6 dots for 37–42w, filled up to current
- Speed toggle: 1× (2s/week) or 2× (1s/week)

Behavior:
- Play starts from 37w, advances one week every ~2 seconds.
- Each advance calls `setGA()` → chart, detail card, and Factor Toolbar all update.
- Reaching 42w auto-pauses.
- Clicking any week node during playback pauses and snaps.
- Clicking play again resumes from current position (does not reset to 37w).
- Left/right arrow keys step through weeks. Space toggles play/pause. Only active when timeline tab is focused.

Visual during playback:
- Selected week node pulses gently (CSS keyframe animation).
- Curve area behind the advancing cursor fills progressively (sweep effect).
- Detail card uses CSS transitions on numeric values (no jarring re-renders).

### TimelineDetailCard

**Card component with `border-l-4` accent colored by selected week's severity** (green → amber → coral → red as risk increases).

**Row 1 — Header:**
- Selected week, prominently displayed (e.g., "39 weeks 0 days")
- Confidence grade badge (A–F, colored) + numeric score
- Cross-GA equivalence tag: "Risk ≈ 41w uncomplicated"

**Row 2 — Risk summary (three stat cells, side by side):**

| Adjusted Risk | Baseline Risk | 95% CI |
|---|---|---|
| **0.75**/1,000 | 0.40/1,000 | 0.28–1.89 |
| severity-colored, large | muted | muted mono |

Combined multiplier as a subtle badge: `×1.88`

**Row 3 — Factor contribution breakdown (expandable):**
- Each active factor as a row: label, multiplier, individual contribution to risk delta.
- Uses `stepByStepBreakdown` from context — cascading multiplication.
- Color-coded per factor via `getFactorColor`.
- OR correction shown as final row with explanation when applicable.
- Empty state: "No risk factors selected — showing Muglu 2019 baseline only."

**Row 4 — Counseling statement:**
- Plain-English one-liner generated from the data.
- Examples:
  - "At 39 weeks with these risk factors, stillbirth risk is approximately 1 in 1,333 ongoing pregnancies — equivalent to an uncomplicated pregnancy at 41 weeks."
  - "At 42 weeks with age ≥40 and BMI ≥40, risk reaches approximately 1 in 53 — consider the urgency of delivery planning."
  - Baseline only: "At 39 weeks without additional risk factors, baseline stillbirth risk is approximately 1 in 2,500 ongoing pregnancies."

## Visual Design

### Colors — all existing CSS tokens

| Element | Token |
|---------|-------|
| Baseline curve | `--primary` |
| Adjusted curve | `--brand-coral` |
| CI band | `--brand-coral` at 12% opacity |
| Reference lines | `--muted-foreground` at 40% |
| Equivalence markers | `--ga-caution` |
| Week nodes | Severity-graded: `--risk-low` → `--risk-moderate` → `--risk-high` |
| Detail card accent | Same severity color as selected week |

### Transitions

| Element | Duration | Easing |
|---------|----------|--------|
| Week selection (node scale, card border, numeric values) | 200ms | ease-out |
| Playback sweep (curve area fill) | 300ms | linear |
| Factor breakdown expand/collapse | 150ms | ease |

### Integration with Methodology Page

- Same `max-w-6xl` container as Explorer and Pipeline.
- Factor Toolbar remains at top — changing factors live-updates adjusted curve, equivalence markers, and detail card.
- GA state preserved when switching between tabs.
- Description card above timeline (matching Pipeline's "How This Pipeline Works" pattern): brief explanation of what the visualization shows.

## Responsive Design

**Desktop (md+):**
- Full horizontal chart, detail card stat cells in a row.

**Mobile (< md):**
- Chart renders at compressed width, stays horizontal (min ~320px).
- Week labels abbreviate to numbers only.
- Detail card stat cells stack vertically.
- Factor breakdown defaults to collapsed.
- Playback controls remain full-width.

## Accessibility

- Week nodes are `<button>` elements with `aria-label`: "37 weeks, risk 0.15 per 1000"
- Playback controls: `aria-label`, `role="toolbar"`
- SR-only summary paragraph (matching Pipeline pattern): "Risk timeline from 37 to 42 weeks. Adjusted risk ranges from X to Y per 1000 with confidence grade Z."
- Arrow key navigation between week nodes.
- `prefers-reduced-motion` disables playback sweep animation and node pulse.

## New Files

| File | Purpose |
|------|---------|
| `src/components/methodology/timeline/timeline-view.tsx` | Top-level component, renders in timeline tab |
| `src/components/methodology/timeline/timeline-chart.tsx` | Horizontal SVG timeline with curves and nodes |
| `src/components/methodology/timeline/timeline-detail-card.tsx` | Glass-box detail card |
| `src/components/methodology/timeline/timeline-playback.tsx` | Play/pause controls and auto-advance logic |
| `src/components/methodology/timeline/use-timeline-equivalence.ts` | Hook: computes cross-GA equivalence mappings |
| `src/components/methodology/timeline/use-timeline-playback.ts` | Hook: playback timer state machine |
| `src/components/methodology/timeline/generate-counseling-statement.ts` | Pure function: risk data → plain-English statement |

## Modified Files

| File | Change |
|------|--------|
| `src/components/methodology/methodology-page-content.tsx` | Import and render `TimelineView` in the timeline tab panel |

## Out of Scope

- Printing/export of the timeline view
- Custom threshold configuration (fixed at 1.0 and 2.0/1,000)
- Condition-specific GA window overlays (that's the Compare page's job)
- New risk engine calculations or data files
