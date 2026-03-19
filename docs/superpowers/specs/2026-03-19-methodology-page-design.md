# Methodology Visualization Page — Design Spec

**Date:** 2026-03-19
**Route:** `/methodology`
**Phase:** B (Layered Risk Curve with Live Calculator Mirror)
**Future phases:** A (Animated Pipeline, below B), C (Anatomical Timeline, below A with disclaimer)

---

## Overview

A dual-track educational page that explains how TimingRx's risk calculation and confidence scoring system works. The left column shows animated visualizations; the right column shows the corresponding mathematical formulas with live-updating numbers. A simplified factor toolbar lets users interact with the model and watch both tracks respond simultaneously.

**Novel contribution:** No existing clinical risk calculator explains its methodology interactively. This page makes the model's assumptions, limitations, and evidence basis transparent — aligning with the "glass box" philosophy.

---

## Layout

### Desktop (>=1024px)

```
┌──────────────────────────────────────────────────────────┐
│  STICKY FACTOR TOOLBAR                                    │
│  [GA: 39w0d ▼]  [Age>=40] [BMI 35+] [DM] [Smoking] ...  │
├────────────────────────────┬─────────────────────────────┤
│                            │                             │
│   VISUAL TRACK (55%)       │   MATH TRACK (45%)          │
│                            │                             │
│   Animated charts,         │   Live formula breakdown,   │
│   gauges, diagrams         │   color-coded numbers,      │
│                            │   expandable derivations    │
│                            │                             │
└────────────────────────────┴─────────────────────────────┘
```

- CSS Grid: `grid-template-columns: 55% 45%`
- Gap: 24px with a subtle vertical divider (1px border-muted)
- Both columns scroll together (single scroll context)
- Sticky toolbar: `position: sticky; top: 0; z-index: 30`

### Mobile (<1024px)

- Tabs: "Visual" | "Math" with swipe navigation
- Factor toolbar collapses to a horizontal scroll strip
- Sections stack vertically

### Section Navigation

- Left-edge dot nav (fixed position) indicating which of 6 sections is active
- Scroll-spy using IntersectionObserver to update active dot
- Clicking a dot smooth-scrolls to that section

---

## Shared State

All sections share a single React context (`MethodologyContext`) containing:

```typescript
interface StepBreakdown {
  factorId: string;
  label: string;
  multiplier: number;
  riskBefore: number;   // per 1,000 (cumulative before this factor)
  riskAfter: number;    // per 1,000 (cumulative after this factor)
  color: string;        // assigned factor color from palette
}

interface MethodologyState {
  ga: GestationalAgeDays;
  activeFactorIds: string[];
  applyInteractions: boolean;
  // Derived (computed in context provider):
  riskCurve: RiskCalculation[];          // full 37-42w curve
  selectedGaCalculation: RiskCalculation; // the user's current GA point
  stepByStepBreakdown: StepBreakdown[];  // cascading multiplication steps
}
```

The factor toolbar mutates `ga`, `activeFactorIds`, and `applyInteractions`. The derived fields recompute via `useMemo`. Both columns consume the state reactively.

**GA interpolation behavior:** The chart reference line interpolates to any GA day using the existing `interpolateBaseline()` function. The math track data table highlights the nearest whole-week row. If the GA falls between weeks (e.g., 39w3d), both surrounding rows get a lighter highlight and the interpolated value is shown inline.

### Factor Color Palette

Single source of truth for factor colors, also exposed as CSS variables:

| Category | Factors | Color | Hex |
|---|---|---|---|
| Age | age_35_39, age_gte40, age_gte45 | Amber | #f59e0b |
| BMI | bmi_30_35, bmi_35_40, bmi_gte40 | Blue | #3b82f6 |
| Metabolic | preexisting_dm | Purple | #8b5cf6 |
| Cardiovascular | chronic_htn | Rose | #f43f5e |
| Fetal | sga_fetus | Teal | #14b8a6 |
| History | prior_stillbirth | Slate | #64748b |
| Parity | nulliparity | Indigo | #6366f1 |
| Social | smoking, black_race | Emerald | #10b981 |
| Overflow (>12) | Any additional | Cycle from top | — |

When more than 12 factors are active (unlikely), colors cycle from the beginning with a dashed-border modifier to distinguish.

### Gauge-to-Field Mapping

| Gauge | Abbreviation | Codebase field |
|---|---|---|
| Evidence Quality | EQ | `breakdown.evidenceQuality` |
| Model Validity | MV | `breakdown.modelValidity` |
| Interaction Penalty | IP | `breakdown.interactionPenalty` |
| Magnitude Plausibility | MP | `breakdown.magnitudePlausibility` |
| Rare-Disease Validity | RP | `breakdown.rareDiseaseValidity` |

### Error States

- If `riskCalculation` produces `NaN` or `Infinity`: display warning banner "Calculation produced invalid values — showing baseline only" and fall back to baseline-only display.
- If no risk factor data loads: display the page with only Section 1 (baseline) active; Sections 2-5 show "Risk factors unavailable" placeholder.
- If a factor has `ci95` containing 0 or negative values: skip that factor's CI contribution in the quadrature propagation and note "CI unavailable for [factor]" in Section 3.

### Reduced Motion (`prefers-reduced-motion: reduce`)

All sections render in their final state immediately — no spring, stagger, opacity, or path-draw transitions. Specifically:
- Section 1: all data points, curve, CI band, and zone shading render at once
- Section 2: ghost/solidify/arrow sequence skipped; curve updates instantly
- Section 3: CI band updates instantly; gauge needle jumps to position
- Section 4: gauges render at final fill level; multiplication chain shown as static row
- Section 5: correction curve appears/disappears instantly
- Section 6: grade pointer jumps to position

### Keyboard Accessibility

- Factor toolbar pills: focusable via Tab, toggle via Enter/Space
- Arrow keys navigate between pills within the toolbar
- Escape closes any expanded teaching callout
- Section dots: focusable, Enter to scroll to section

### Interaction Adjustments in Section 2

When "Apply Interactions" is active and two interacting factors are both toggled on, the math track cascade shows an additional line with a distinct style:
```
  x BMI x DM interaction (x0.85):  [prev] x 0.85 = [new]  ← dotted connector
```
The visual track shows the curve dropping slightly (sub-multiplicative correction) with a unique dotted-line animation rather than the solid lift arrows used for factors.

---

## Section 1: The Foundation — Muglu Baseline Curve

### Visual Track

1. Clean chart area renders empty
2. Muglu data points animate in sequentially (37w -> 42w), each with a 200ms scale-up pulse
3. A smooth curve connects them (framer-motion path animation, 800ms)
4. CI band fades in (opacity 0->0.15, 400ms)
5. Risk zone shading (green/yellow/red) slides in from left (300ms each)
6. The row matching the user's selected GA highlights with a color pulse on the chart (vertical reference line animates to position)

### Math Track

**Header:** "Prospective Stillbirth Risk"

**Formula block (static):**
```
          stillbirths at week X
Risk = ─────────────────────────────
       ongoing pregnancies at week X
```

**Source badge:** Muglu et al. 2019 (PLOS Medicine) — n = 15,458,874

**Data table:** All 6 GA weeks with risk and CI. The row matching the current GA has a highlighted background with animated transition when GA changes.

**Teaching callout (expandable):**
- The "fetuses-at-risk" denominator insight (Smith 2001)
- Why prior studies using deliveries as denominator were misleading
- How Muglu pooled 13 cohort studies using random-effects meta-analysis

### Animations

- Curve: framer-motion `pathLength` animation on SVG path
- Data points: framer-motion `scale` spring from 0 to 1, staggered 150ms
- CI band: framer-motion `opacity` from 0 to target
- Zone shading: framer-motion `scaleX` from 0 to 1, origin left

---

## Section 2: Multiplying Risk — The Factor Model

### Visual Track

When a factor is toggled ON:
1. Current curve shown (baseline or already-adjusted)
2. A translucent "ghost" curve appears at the new adjusted level (opacity 0.3, 300ms)
3. At each GA data point, an animated vertical arrow shows the multiplicative lift (arrow grows from old point to new point, 400ms, in the factor's assigned color)
4. The ghost solidifies into the new adjusted curve (opacity 0.3->1.0, 300ms)
5. The previous curve becomes dashed (stroke-dasharray transition, 200ms)
6. The lift arrows fade out (200ms)

When a factor is toggled OFF:
- Reverse animation: curve drops back down, previous curve un-dashes

**Factor color assignments:**
Each factor gets a unique hue from a predefined palette (12 colors, accessible):
- Age factors: amber/orange spectrum
- BMI factors: blue spectrum
- Medical conditions: purple spectrum
- Social determinants: teal spectrum
- Obstetric history: rose spectrum

Hovering a factor in the toolbar highlights its specific contribution layer with increased opacity.

### Math Track

**Header:** "Step-by-Step Multiplication"

**Cascading calculation display:**
```
Baseline at [GA]:              [value] per 1,000
  x Age >=40 (aOR 1.88):      [prev] x 1.88 = [new]
  x BMI 35-39.9 (aOR 2.10):   [new_prev] x 2.10 = [final]
  ─────────────────────────────────────────────────
  Adjusted risk:               [final] per 1,000
```

- Each line animates in (slide from left + fade, 200ms) when its factor is toggled
- The multiplier value renders in the factor's assigned color
- Numbers cascade: when a factor changes, all downstream values animate to new values (framer-motion `animate` on number values using spring physics)
- Number animation: use framer-motion `useSpring` + `useTransform` for smooth number counting transitions

**Teaching callout (always visible):**
"When logistic regression models show independently significant adjusted odds ratios without significant interaction terms, the log-odds are additive — meaning odds ratios are multiplicative. This is the standard approach used in the Framingham cardiovascular risk calculator and the FMF preeclampsia screener."

**Expandable deeper dive:**
- Table of all factor multipliers with their sources
- The rare-disease assumption preview (connecting to Section 5)
- Why adjusted ORs from different studies can be combined (and the caveats)

---

## Section 3: Quantifying Uncertainty — CI Propagation

### Visual Track

Focus: the CI band around the adjusted curve.

1. Baseline curve with its CI band shown (from Section 1 state)
2. As each factor is active, its CI contribution is visualized as a colored ring that expands the band width:
   - Each factor's variance contribution shown as a colored translucent stripe within the CI band
   - Wider stripe = more uncertainty from that factor
   - Colors match factor assignments from Section 2
3. An **uncertainty gauge** (circular, like a speedometer) on the side:
   - Needle position = CI width ratio (adjusted / baseline)
   - Zones: tight (green, <2x), moderate (yellow, 2-4x), wide (orange, 4-8x), very wide (red, >8x)
   - Needle animates smoothly with framer-motion spring

### Math Track

**Header:** "Log-Scale Quadrature (GUM Standard)"

**Formula block:**
```
For each factor i with RR_i and 95% CI [L_i, U_i]:

  Var(ln(RR_i)) = [(ln(U_i) - ln(L_i)) / (2 x 1.96)]^2
```

**Live variance accumulation:**
```
Baseline:  Var = [formula] = [value]    ████░░░░░░
Age >=40:  Var = [formula] = [value]    ██░░░░░░░░
BMI 35+:   Var = [formula] = [value]    ███░░░░░░░
                                        ──────────
Combined:  Var = sum = [value]          █████████░

SE = sqrt([value]) = [value]

95% CI = exp[ln([adjusted]) +/- 1.96 x [SE]]
       = [[low], [high]] per 1,000
```

Each row has a mini bar chart showing its proportional contribution to total variance. Bars are colored by factor. The sum bar animates as factors change.

**Teaching callout (always visible):**
"This is the same uncertainty propagation formula used in metrology (the GUM international standard, JCGM 100:2008) and particle physics. When multiplying independent measurements, relative uncertainties add in quadrature."

**Expandable:**
- The independence assumption and when it breaks down
- How correlated factors would require covariance terms (which we don't have)
- Why the CI is symmetric on the log scale but asymmetric on the risk scale

---

## Section 4: The Confidence Scorer — 5 Lenses of Trust

### Visual Track

Five vertical gauges arranged horizontally, each with:
- A colored fill level (0-100%)
- An icon at top (unique per component)
- The component abbreviation
- The numeric value below

```
  [EQ]    [MV]    [IP]    [MP]    [RP]
  ████    ████    ████    ████    ████
  ████    ████    ████    ████    ████
  ████    ███░    ████    ████    ████
  ████    ██░░    ████    ████    ████
  ████    █░░░    ████    ████    ████
  0.87    0.92    1.00    1.00    1.00
```

Below the gauges, a **multiplication chain** animation:
- Five colored circles (matching gauge colors) flow left-to-right
- Each shows its value
- Multiplication signs between them
- They converge into a final score circle that pulses with the grade color
- The grade letter appears in the final circle

When a gauge drops below 0.80, it pulses red briefly (300ms). When it drops below 0.60, the pulse is stronger and a warning icon appears.

### Math Track

**Header:** "Score = 100 x EQ x MV x IP x MP x RP"

Five formula boxes, each with a distinct border color matching its gauge:

**Box 1 — EQ (Evidence Quality):**
```
EQ = (R_baseline + sum(R_i)) / (1 + n)

R_baseline = 0.95  (Muglu, n=15M)
R_age>=40  = 0.80  (Reddy 2006, n=5.4M)
R_BMI35    = 0.85  (Flenady 2011 MA)

EQ = (0.95 + 0.80 + 0.85) / 3 = 0.867
```

**Box 2 — MV (Model Validity):**
```
MV = max(0.40, 1.0 - 0.03n - 0.005n^2)
   = 1.0 - 0.03(2) - 0.005(4)
   = 0.920

n = 2 factors -> independence plausible
```

**Boxes 3-5:** Same pattern for IP, MP, RP.

**Final calculation:**
```
Score = 100 x 0.867 x 0.920 x 1.000 x 1.000 x 1.000
      = 79.8 -> 80 -> Grade B ("Moderate confidence")
```

Each box highlights when its gauge is hovered. Values update live.

**Teaching callout:**
"No existing clinical risk calculator provides individual-level confidence scoring. This is a novel feature. The 5-component formula was calibrated against 10 realistic clinical scenarios to ensure grades align with clinical intuition."

**Expandable:**
- Full calibration table (10 scenarios with expected vs actual grades)
- GRADE framework comparison
- Why multiplicative composition rather than additive scoring
- Individual R_i justifications (per-factor data reliability reasoning)

---

## Section 5: The Safety Net — OR to RR Correction

### Visual Track

**Trigger condition:** Correction is displayed only when BOTH conditions are met: (a) combined adjusted risk >= 1% AND (b) at least one risk factor is active (combinedMultiplier > 1). This matches the risk engine implementation (risk-engine.ts line 177).

**When correction is NOT triggered** (combined risk <1% or no factors active):
- A green checkmark with "Rare-disease assumption holds"
- A small number line showing where the current combined risk sits relative to the 1% threshold
- Brief text: "OR and RR diverge by <0.1% at this risk level"

**When correction IS triggered** (combined risk >=1%):
- Two curves appear on the chart:
  1. Raw OR-based estimate (dashed line, labeled)
  2. Zhang & Yu corrected RR (solid line, labeled)
- The gap between them is shaded in amber, labeled "OR overestimation"
- A **divergence meter** shows the percentage difference
- As more factors stack, the gap visually widens — making overestimation tangible

Animation: when the threshold is crossed, the correction curve "peels away" from the OR curve with a smooth divergence animation.

### Math Track

**Header:** "Zhang & Yu (1998) Correction"

**Formula:**
```
RR_corrected = OR / [(1 - P_0) + (P_0 x OR)]

Where P_0 = baseline risk (proportion)
```

**Live calculation:**
```
At [GA] with combined OR = [value]:
  P_0 = [baseline] / 1000 = [proportion]
  RR = [OR] / [(1 - [P0]) + ([P0] x [OR])]
     = [OR] / [denominator]
     = [corrected]

Divergence: [pct]%
```

**Threshold table:**
| Combined risk | Divergence | Clinical impact |
|---|---|---|
| <1% | <0.5% | Negligible |
| 1-5% | 0.5-3% | Minor |
| 5-10% | 3-8% | Moderate |
| 10-20% | 8-20% | Significant |
| >20% | >20% | Substantial |

Current position highlighted in the table.

---

## Section 6: Grade Mapping — What the Letters Mean

### Visual Track

A horizontal grade bar spanning full width:
```
  A (>=85)     B (70-84)    C (55-69)    D (40-54)    F (<40)
[████████████|████████████|███████████|████████████|████████████]
                    ^ 80
```

- Each zone has its distinct color (matching confidence-a through confidence-f CSS variables)
- An animated pointer (triangle/diamond) sits at the current score position
- Pointer slides smoothly with framer-motion spring when score changes
- The active grade zone has a subtle glow/pulse
- Below each zone: the clinical meaning label

Below the bar: a **scenario showcase** strip. Pre-built scenarios that the user can click to instantly load:
- "Baseline only" -> Grade A (95)
- "Age 40" -> Grade B (84)
- "Age 40 + BMI 40 + DM" -> Grade C (62)
- "5+ factors" -> Grade D (45)
- "Maximum complexity" -> Grade F (28)

Clicking a scenario sets the toolbar factors and all sections animate to the new state.

### Math Track

**Grade table:**

| Grade | Score | Label | Meaning |
|---|---|---|---|
| A | >= 85 | High confidence | Based primarily on large meta-analytic data with minimal extrapolation |
| B | 70-84 | Moderate confidence | Supported by moderate-quality evidence with reasonable assumptions |
| C | 55-69 | Limited confidence | Estimated from multiple sources with significant assumptions |
| D | 40-54 | Low confidence | Rough estimate; interpret with clinical judgment |
| F | < 40 | Very low confidence | Highly uncertain; clinical judgment should predominate |

Current grade row highlighted.

**Teaching callout:**
"These thresholds were calibrated against 10 realistic clinical scenarios to ensure grades match clinical intuition about when to trust a composite estimate."

---

## Sticky Factor Toolbar

Sits above both columns, full width, sticky at top:

```
┌──────────────────────────────────────────────────────────────┐
│ GA: [39w0d -/+]  │  Factors: [Age>=40] [BMI 35+] [DM] ...  │
│                   │  [Interactions: OFF]                      │
└──────────────────────────────────────────────────────────────┘
```

- GA: increment/decrement buttons (not the full multi-method entry — simplified for this page)
- Factors: pill-style toggle buttons, each showing the factor name and multiplier
- Active factors use their assigned color with a filled background
- Inactive factors are outlined with muted text
- "Apply Interactions" toggle at the end
- On mobile: horizontal scrolling strip

---

## Animation Library

**framer-motion** (v11+) for all animations:
- `motion.path` with `pathLength` for curve drawing
- `motion.div` with `layout` for smooth repositioning
- `useSpring` + `useTransform` for smooth number counting
- `AnimatePresence` for factor line enter/exit in the math track
- `spring` config: `{ stiffness: 200, damping: 25 }` for snappy but smooth feel
- Stagger: `staggerChildren: 0.1` for sequential data point reveals

**Performance:**
- framer-motion adds ~32KB gzipped
- All animations use `transform` and `opacity` only (GPU-accelerated, no layout thrashing)
- Charts use Recharts `isAnimationActive={false}` for the base chart; custom framer-motion overlays handle the layered animations
- `will-change: transform` on animated elements

---

## File Structure

```
src/
  app/
    methodology/
      page.tsx              -- Page shell, metadata, layout
  components/
    methodology/
      methodology-provider.tsx    -- React context with shared state
      factor-toolbar.tsx          -- Sticky toolbar with GA + factor toggles
      section-nav.tsx             -- Left-edge dot navigation
      section-baseline.tsx        -- Section 1: Muglu baseline
      section-multiplication.tsx  -- Section 2: Factor model
      section-ci-propagation.tsx  -- Section 3: CI quadrature
      section-confidence.tsx      -- Section 4: 5-component scorer
      section-or-correction.tsx   -- Section 5: Zhang & Yu
      section-grade-mapping.tsx   -- Section 6: Grade bar
      animated-curve.tsx          -- Layered risk curve with framer-motion
      animated-number.tsx         -- Smooth number counting component
      formula-block.tsx           -- Styled formula display with live values
      confidence-gauges.tsx       -- 5 vertical gauges component
      uncertainty-meter.tsx       -- Circular gauge for CI width
      teaching-callout.tsx        -- Expandable educational callout box
      scenario-strip.tsx          -- Pre-built scenario quick-load buttons
```

---

## Dependencies

| Package | Purpose | Size |
|---|---|---|
| framer-motion | All animations (curve morphing, number counting, layout) | ~32KB gzip |
| (existing) recharts | Base chart rendering | already included |
| (existing) lucide-react | Icons for gauges, sections | already included |

No other new dependencies.

---

## Testing Strategy

- **Unit tests** for animated-number (verify it converges to target value)
- **Unit tests** for formula-block (verify correct values render for given inputs)
- **Snapshot tests** for each section component with fixed input state
- **Visual regression** would be ideal but deferred to post-launch
- **Accessibility:** All animations respect `prefers-reduced-motion` via framer-motion's built-in support. Math formulas have `aria-label` descriptions. Gauge values are announced to screen readers.

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| >= 1280px | Full dual-track, generous spacing |
| 1024-1279px | Dual-track, tighter spacing |
| 768-1023px | Tabbed (Visual / Math), factor toolbar as scroll strip |
| < 768px | Tabbed, simplified factor toolbar (icon-only pills), vertical section nav hidden |

---

## Performance Budget

| Metric | Target |
|---|---|
| JS bundle (this page) | < 80KB gzipped (framer-motion + page components) |
| First paint | < 200ms (SSR shell) |
| Interactive | < 500ms |
| Animation frame rate | 60fps (all animations GPU-accelerated) |
| `prefers-reduced-motion` | All animations disabled, static layout shown |
