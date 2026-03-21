# Kairos 22-Improvement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 22 improvements to Kairos spanning hidden computation surfacing, condition-calculator integration, physiologic visualization, enhanced comparison tools, data enrichment, search/navigation, calculator UX, and visual polish.

**Architecture:** Improvements are organized into 7 independent chunks. Each chunk produces working, testable software. Dependencies flow downward: Chunk 1 (calculator core) enables Chunks 2-3, but Chunks 4-7 are independent. Within each chunk, tasks are ordered by dependency.

**Tech Stack:** Next.js 16 (App Router) + TypeScript strict + Tailwind + shadcn/ui + Recharts + Framer Motion + cmdk + FlexSearch. Static TypeScript data files (no database). Vitest for testing.

**Key files to understand before starting any task:**
- `src/data/types.ts` — All core types (ObstetricCondition, RiskCalculation, ConfidenceScore, etc.)
- `src/data/helpers.ts` — `w()`, `range()`, `cite()`, `grade()` convenience functions
- `src/lib/calculator/risk-engine.ts` — Core risk calculation: `calculateRisk()`, `calculateRiskCurve()`, `interpolateBaseline()`
- `src/lib/calculator/mortality-index.ts` — `calculateMortalityIndex()`, `findMortalityCrossover()` (exists but not in UI)
- `src/lib/calculator/nnt-calculator.ts` — `calculateNNT()` (exists but not in UI)
- `src/data/risk-models/neonatal-delivery-risk.ts` — GA-specific neonatal morbidity data (exists but not visualized)
- `src/data/physiologic/index.ts` — Convergence data and week-by-week physiology (exists but not in app)
- `src/lib/hooks/use-calculator.ts` — Calculator state management hook
- `src/components/charts/chart-theme.ts` — Chart color tokens
- `src/components/charts/chart-gradient-defs.tsx` — SVG gradient definitions for charts
- `src/components/calculator/glass-box-display.tsx` — Risk decomposition display
- `src/components/condition/condition-detail.tsx` — Condition detail page component
- `src/app/calculator/page.tsx` — Calculator page (manages chart size, fullscreen)
- `src/app/conditions/page.tsx` — Conditions list with search/sort/filter
- `src/app/compare/page.tsx` — Cross-condition/guideline comparison

**Testing patterns already established:**
- Tests live in `src/__tests__/` mirroring `src/` structure
- Use Vitest with `@testing-library/react` and `jsdom`
- Run: `pnpm test` (all) or `pnpm vitest run src/__tests__/path/to/test.ts` (single)
- Data integrity tests exist at `src/__tests__/data/conditions-integrity.test.ts`

**Existing test setup file:** `src/__tests__/setup.ts`

---

## Chunk 1: Surface Hidden Computational Power (Improvements #1, #2, #3)

These three improvements surface computation that already exists in `lib/calculator/` but has no UI. No new algorithms needed — just visualization.

---

### Task 1.1: Mortality Index Crossover Chart (#1)

**Files:**
- Create: `src/components/charts/mortality-crossover-chart.tsx`
- Create: `src/__tests__/lib/calculator/mortality-index-extended.test.ts`
- Modify: `src/app/calculator/page.tsx`
- Reference: `src/lib/calculator/mortality-index.ts` (already exports `calculateMortalityIndex`, `findMortalityCrossover`)
- Reference: `src/components/charts/chart-theme.ts` (reuse chart color tokens)
- Reference: `src/components/charts/chart-gradient-defs.tsx` (reuse gradient defs)

- [ ] **Step 1: Write test for mortality index with combined multiplier**

File: `src/__tests__/lib/calculator/mortality-index-extended.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { calculateMortalityIndex, findMortalityCrossover } from "@/lib/calculator/mortality-index";

describe("mortality index for UI consumption", () => {
  it("returns 6 data points from 37w to 42w", () => {
    const index = calculateMortalityIndex(1);
    expect(index).toHaveLength(6);
    expect(index[0].ga).toBe(37 * 7);
    expect(index[5].ga).toBe(42 * 7);
  });

  it("crossover moves earlier with higher multiplier", () => {
    const crossBase = findMortalityCrossover(1);
    const crossHigh = findMortalityCrossover(3.0);
    // Higher risk multiplier should cause crossover at same or earlier GA
    if (crossBase !== null && crossHigh !== null) {
      expect(crossHigh).toBeLessThanOrEqual(crossBase);
    }
  });

  it("each point has expectantRisk and deliveryRisk", () => {
    const index = calculateMortalityIndex(2.0);
    for (const point of index) {
      expect(point.expectantRisk).toBeGreaterThan(0);
      expect(point.deliveryRisk).toBeGreaterThan(0);
      expect(typeof point.favorDelivery).toBe("boolean");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it passes** (these test existing code)

Run: `pnpm vitest run src/__tests__/lib/calculator/mortality-index-extended.test.ts`
Expected: PASS (testing existing functions)

- [ ] **Step 3: Create the MortalityCrossoverChart component**

File: `src/components/charts/mortality-crossover-chart.tsx`

Build a Recharts `ComposedChart` with:
- X-axis: GA weeks (37-42)
- Two lines: `expectantRisk` (stillbirth if waiting, styled with `chartColors.adjusted`/pink) and `deliveryRisk` (neonatal death if delivering now, styled with `chartColors.baseline`/purple)
- A `ReferenceArea` or vertical `ReferenceLine` at the crossover GA point with label "Balance favors delivery"
- Shading: left of crossover = subtle green (expectant OK), right of crossover = subtle pink (delivery favored)
- Tooltip showing both values at each GA
- Use `chartColors` from `chart-theme.ts` and `ChartGradientDefs` for consistent styling

Props interface:
```typescript
interface Props {
  combinedMultiplier: number;
  currentGA: number;
  height?: string;
}
```

Component calls `calculateMortalityIndex(combinedMultiplier)` and `findMortalityCrossover(combinedMultiplier)` internally.

- [ ] **Step 4: Add MortalityCrossoverChart to the calculator page**

File: `src/app/calculator/page.tsx`

Add a new `<Card>` below the existing `<GlassBoxDisplay>` and above the disclaimer. Compute `combinedMultiplier` from `currentRisk.factorContributions` (multiply all multipliers together, include interaction adjustments). The card title should be "Mortality Index — Expectant vs. Delivery Risk" with a subtitle explaining what it shows.

- [ ] **Step 5: Verify the chart renders in the dev server**

Run: `pnpm dev` and navigate to `/calculator`. Verify:
- Chart renders with two crossing lines
- Toggling risk factors shifts the crossover point
- Changing GA highlights the current position

- [ ] **Step 6: Commit**

```bash
git add src/components/charts/mortality-crossover-chart.tsx src/__tests__/lib/calculator/mortality-index-extended.test.ts src/app/calculator/page.tsx
git commit -m "feat(calculator): add mortality index crossover visualization

Surfaces the existing mortality index computation (calculateMortalityIndex,
findMortalityCrossover) as a dual-line Recharts chart showing where
expectant management risk exceeds delivery risk."
```

---

### Task 1.2: NNT Display Panel (#2)

**Files:**
- Create: `src/components/calculator/nnt-panel.tsx`
- Create: `src/__tests__/lib/calculator/nnt-calculator-ui.test.ts`
- Modify: `src/app/calculator/page.tsx`
- Reference: `src/lib/calculator/nnt-calculator.ts` (already exports `calculateNNT`)

- [ ] **Step 1: Write test for NNT calculator at various GAs**

File: `src/__tests__/lib/calculator/nnt-calculator-ui.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { calculateNNT } from "@/lib/calculator/nnt-calculator";

describe("NNT calculator for UI", () => {
  it("returns finite NNT at 39w with baseline multiplier", () => {
    const result = calculateNNT(39 * 7, 1);
    expect(result.nntOneWeek).toBeGreaterThan(0);
    expect(result.nntOneWeek).toBeLessThan(Infinity);
  });

  it("NNT decreases with higher multiplier", () => {
    const nntBase = calculateNNT(40 * 7, 1);
    const nntHigh = calculateNNT(40 * 7, 3.0);
    expect(nntHigh.nntOneWeek).toBeLessThanOrEqual(nntBase.nntOneWeek);
  });

  it("includes context comparison values", () => {
    const result = calculateNNT(39 * 7, 1);
    expect(result.context.arriveNNTCesarean).toBe(28);
    expect(result.context.swepisNNTDeath).toBe(230);
    expect(result.context.cochraneNNTDeath).toBe(544);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm vitest run src/__tests__/lib/calculator/nnt-calculator-ui.test.ts`
Expected: PASS

- [ ] **Step 3: Create the NNTPanel component**

File: `src/components/calculator/nnt-panel.tsx`

A `"use client"` component that takes `ga: GestationalAgeDays` and `combinedMultiplier: number` as props. Internally calls `calculateNNT(ga, combinedMultiplier)`. Renders:

- Primary display: NNT value in large mono font with label "inductions to prevent 1 stillbirth (vs. waiting 1 week)"
- Risk differential: `riskIfWaiting` vs `riskIfDelivering` as a comparison row
- Context bar: horizontal comparison showing the current NNT positioned relative to ARRIVE (28), Alkmark (79), SWEPIS (230), and Cochrane (544) as labeled markers on a log-scale bar. Use brand colors.
- If NNT is `Infinity`, show "At this GA, delivery risk exceeds waiting risk — NNT is not meaningful."

Style following the existing `glass-box-display.tsx` pattern: `Card` with `CardHeader`/`CardContent`, mono fonts for numbers, `text-xs`/`text-sm` sizing.

- [ ] **Step 4: Add NNTPanel to calculator page**

File: `src/app/calculator/page.tsx`

Add below the MortalityCrossoverChart. Compute `combinedMultiplier` the same way as Task 1.1. Pass `state.ga` and the multiplier.

- [ ] **Step 5: Verify in dev server**

Check that NNT updates when GA or factors change. Verify the context bar positions make sense.

- [ ] **Step 6: Commit**

```bash
git add src/components/calculator/nnt-panel.tsx src/__tests__/lib/calculator/nnt-calculator-ui.test.ts src/app/calculator/page.tsx
git commit -m "feat(calculator): add NNT panel with trial context comparison

Surfaces calculateNNT as a panel showing numbers needed to treat,
with visual comparison to ARRIVE, SWEPIS, Alkmark, and Cochrane benchmarks."
```

---

### Task 1.3: Neonatal Risk Counterbalance Toggle (#3)

**Files:**
- Modify: `src/components/charts/stillbirth-risk-curve.tsx`
- Modify: `src/app/calculator/page.tsx`
- Reference: `src/data/risk-models/neonatal-delivery-risk.ts`
- Reference: `src/components/charts/chart-theme.ts`

- [ ] **Step 1: Extend StillbirthRiskCurve to accept neonatal data**

File: `src/components/charts/stillbirth-risk-curve.tsx`

Add optional prop `showNeonatalRisk?: boolean` and import `neonatalDeliveryRisk`. When enabled:
- Add a third Line to the ComposedChart for `neonatalDeathPer1000` (green/teal color, `chartColors.safe` token)
- Add data mapping: merge neonatal data points with existing data by GA
- Add legend entry: "Neonatal death risk (if delivered)"
- The visual effect: a line that decreases from left to right while the stillbirth line increases — creating the "scissors" crossover

- [ ] **Step 2: Add toggle to calculator page**

File: `src/app/calculator/page.tsx`

Add a `Switch` component labeled "Show delivery risks" next to the chart size buttons. Pass the state as `showNeonatalRisk` prop to `StillbirthRiskCurve`.

- [ ] **Step 3: Verify the scissors visualization**

Run dev server, enable the toggle. Verify:
- Green neonatal line appears and decreases right-to-left
- The crossing point between stillbirth and neonatal lines is visible
- Tooltip shows all three values (baseline, adjusted if factors active, neonatal)

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/stillbirth-risk-curve.tsx src/app/calculator/page.tsx
git commit -m "feat(calculator): add neonatal risk counterbalance toggle

Shows neonatal death risk alongside stillbirth risk, creating
a scissors visualization of the expectant vs delivery tradeoff."
```

---

## Chunk 2: Condition-Calculator Integration (Improvements #4, #5, #6)

These create the missing link between condition detail pages and the risk calculator.

---

### Task 2.1: Condition-to-Calculator Deep Link (#4)

**Files:**
- Create: `src/lib/utils/condition-factor-mapping.ts`
- Create: `src/__tests__/lib/utils/condition-factor-mapping.test.ts`
- Modify: `src/components/condition/condition-detail.tsx`
- Modify: `src/app/calculator/page.tsx`
- Modify: `src/lib/hooks/use-calculator.ts`

- [ ] **Step 1: Create condition-to-factor mapping**

File: `src/lib/utils/condition-factor-mapping.ts`

```typescript
/**
 * Maps condition IDs to relevant calculator risk factor IDs.
 * Used by the "Open in Risk Calculator" button on condition detail pages.
 */
export const conditionToFactors: Record<string, string[]> = {
  // Hypertensive
  chronic_htn: ["chronic_hypertension"],
  chronic_htn_no_meds: ["chronic_hypertension"],
  chronic_htn_controlled_meds: ["chronic_hypertension"],
  chronic_htn_difficult_control: ["chronic_hypertension"],
  // Diabetes
  gdm_diet_controlled: [],
  gdm_medication_controlled: [],
  gdm_poorly_controlled: ["preexisting_diabetes"],
  pregestational_dm_well_controlled: ["preexisting_diabetes"],
  pregestational_dm_vascular_poor_control: ["preexisting_diabetes"],
  // Fetal
  fgr_3rd_10th: ["sga_fetus"],
  fgr_less_3rd: ["sga_fetus"],
  // Age
  ama_35_39: ["age_35_39"],
  ama_40_plus: ["age_gte_40"],
  ama_45_plus: ["age_gte_45"],
  // Obesity
  obesity_class_i: ["bmi_30_34"],
  obesity_class_ii: ["bmi_35_39"],
  obesity_class_iii: ["bmi_gte_40"],
  obesity_super_morbid: ["bmi_gte_40"],
  // Prior
  prior_stillbirth_unexplained: ["prior_stillbirth"],
  prior_stillbirth_explained: ["prior_stillbirth"],
};

/** Get risk factor IDs for a condition. Returns empty array if no mapping. */
export function getFactorsForCondition(conditionId: string): string[] {
  return conditionToFactors[conditionId] ?? [];
}

/** Check if a condition has a calculator mapping */
export function hasCalculatorMapping(conditionId: string): boolean {
  const factors = conditionToFactors[conditionId];
  return factors !== undefined && factors.length > 0;
}
```

- [ ] **Step 2: Write test for the mapping**

File: `src/__tests__/lib/utils/condition-factor-mapping.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { getFactorsForCondition, hasCalculatorMapping } from "@/lib/utils/condition-factor-mapping";

describe("condition-factor-mapping", () => {
  it("returns correct factors for chronic HTN", () => {
    expect(getFactorsForCondition("chronic_htn")).toEqual(["chronic_hypertension"]);
  });

  it("returns empty array for unmapped condition", () => {
    expect(getFactorsForCondition("nonexistent")).toEqual([]);
  });

  it("hasCalculatorMapping returns false for conditions with empty array", () => {
    expect(hasCalculatorMapping("gdm_diet_controlled")).toBe(false);
  });

  it("hasCalculatorMapping returns true for mapped conditions", () => {
    expect(hasCalculatorMapping("ama_40_plus")).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run src/__tests__/lib/utils/condition-factor-mapping.test.ts`
Expected: PASS

- [ ] **Step 4: Add URL query param parsing to calculator page**

File: `src/app/calculator/page.tsx`

Read `?factors=id1,id2` from `useSearchParams()`. On mount, if factors are present, call `toggleFactor` for each. This requires making the page component use `"use client"` (it already does) and importing `useSearchParams` from `next/navigation`.

File: `src/lib/hooks/use-calculator.ts`

Add a `setFactors(ids: string[])` method that replaces `activeFactorIds` entirely (for URL-based initialization).

- [ ] **Step 5: Add "Open in Risk Calculator" button to condition detail**

File: `src/components/condition/condition-detail.tsx`

Import `hasCalculatorMapping`, `getFactorsForCondition`. Below the header section, if `hasCalculatorMapping(condition.id)`, render a `Link` styled as a button:

```tsx
<Link
  href={`/calculator?factors=${getFactorsForCondition(condition.id).join(",")}`}
  className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
  style={{ background: "var(--kairos-gradient)" }}
>
  Open in Risk Calculator
</Link>
```

- [ ] **Step 6: Verify end-to-end**

Navigate to a condition page (e.g., Chronic HTN). Click "Open in Risk Calculator". Verify the calculator page loads with the correct risk factor pre-selected and the curve updates.

- [ ] **Step 7: Commit**

```bash
git add src/lib/utils/condition-factor-mapping.ts src/__tests__/lib/utils/condition-factor-mapping.test.ts src/components/condition/condition-detail.tsx src/app/calculator/page.tsx src/lib/hooks/use-calculator.ts
git commit -m "feat: add condition-to-calculator deep linking

Adds 'Open in Risk Calculator' button on condition detail pages
that navigates to /calculator with relevant risk factors pre-selected."
```

---

### Task 2.2: Condition-Aware Calculator Recommendations (#5)

**Files:**
- Create: `src/components/calculator/condition-recommendations.tsx`
- Modify: `src/app/calculator/page.tsx`
- Reference: `src/lib/utils/condition-factor-mapping.ts` (from Task 2.1)
- Reference: `src/data/conditions/index.ts`

- [ ] **Step 1: Create reverse mapping (factor → conditions)**

Add to `src/lib/utils/condition-factor-mapping.ts`:

```typescript
import { allConditions } from "@/data/conditions";
import type { ObstetricCondition } from "@/data/types";

/** Reverse lookup: given active factor IDs, find relevant conditions */
export function getConditionsForFactors(factorIds: string[]): ObstetricCondition[] {
  if (factorIds.length === 0) return [];
  const relevant: ObstetricCondition[] = [];
  for (const [condId, factors] of Object.entries(conditionToFactors)) {
    if (factors.some((f) => factorIds.includes(f))) {
      const condition = allConditions.find((c) => c.id === condId);
      if (condition && condition.guidelineRecommendations.length > 0) {
        relevant.push(condition);
      }
    }
  }
  return relevant;
}
```

- [ ] **Step 2: Create the ConditionRecommendations component**

File: `src/components/calculator/condition-recommendations.tsx`

A `"use client"` component that takes `activeFactorIds: string[]` as a prop. Calls `getConditionsForFactors(activeFactorIds)`. For each returned condition, render a compact card showing:
- Condition name (linked to `/conditions/${id}`)
- Primary guideline's GA window badge (`GAWindowBadge`)
- Evidence grade badge
- The recommendation notes (truncated to 2 lines)

Wrapped in a `Card` with title "Relevant Condition Guidelines". Only renders if there are matching conditions.

- [ ] **Step 3: Add to calculator page**

File: `src/app/calculator/page.tsx`

Add `<ConditionRecommendations activeFactorIds={state.activeFactorIds} />` below the NNT panel (or after the glass box if NNT not yet built).

- [ ] **Step 4: Verify**

Select "Chronic hypertension" in the calculator. Verify that chronic HTN condition variants appear in the recommendations panel with their GA windows.

- [ ] **Step 5: Commit**

```bash
git add src/components/calculator/condition-recommendations.tsx src/lib/utils/condition-factor-mapping.ts src/app/calculator/page.tsx
git commit -m "feat(calculator): show relevant condition guidelines for active factors

When risk factors are selected, shows the corresponding condition
guidelines with GA windows and evidence grades inline."
```

---

### Task 2.3: Calculator Quick-Scenario Presets (#6)

**Files:**
- Create: `src/data/calculator-presets.ts`
- Create: `src/components/calculator/preset-selector.tsx`
- Modify: `src/app/calculator/page.tsx`
- Modify: `src/lib/hooks/use-calculator.ts`

- [ ] **Step 1: Define preset scenarios**

File: `src/data/calculator-presets.ts`

```typescript
export interface CalculatorPreset {
  id: string;
  label: string;
  description: string;
  factorIds: string[];
  defaultGA: number; // GestationalAgeDays
  category: string;
}

export const calculatorPresets: CalculatorPreset[] = [
  {
    id: "ama-nullip-gdm",
    label: "35yo nulliparous with GDM",
    description: "Advanced maternal age + nulliparity + preexisting diabetes proxy",
    factorIds: ["age_35_39", "nulliparity", "preexisting_diabetes"],
    defaultGA: 39 * 7,
    category: "Common Scenarios",
  },
  {
    id: "ama40-htn-prior",
    label: "40yo with chronic HTN + prior stillbirth",
    description: "High-risk combination with supra-multiplicative interaction",
    factorIds: ["age_gte_40", "chronic_hypertension", "prior_stillbirth"],
    defaultGA: 37 * 7,
    category: "High Risk",
  },
  {
    id: "ivf-42",
    label: "IVF conception, age 42",
    description: "ART conception with advanced maternal age",
    factorIds: ["age_gte_40"],
    defaultGA: 39 * 7,
    category: "Common Scenarios",
  },
  {
    id: "obese-dm-smoke",
    label: "Class III obesity + diabetes + smoking",
    description: "Multiple metabolic risk factors",
    factorIds: ["bmi_gte_40", "preexisting_diabetes", "smoking"],
    defaultGA: 37 * 7,
    category: "High Risk",
  },
  {
    id: "sga-nullip",
    label: "SGA fetus in nulliparous patient",
    description: "Fetal growth restriction with first pregnancy",
    factorIds: ["sga_fetus", "nulliparity"],
    defaultGA: 37 * 7,
    category: "Fetal Indications",
  },
  {
    id: "baseline-39w",
    label: "Low-risk at 39 weeks",
    description: "No additional risk factors — baseline Muglu curve",
    factorIds: [],
    defaultGA: 39 * 7,
    category: "Baseline",
  },
];
```

- [ ] **Step 2: Create PresetSelector component**

File: `src/components/calculator/preset-selector.tsx`

A dropdown or collapsible card that shows presets grouped by category. Clicking a preset calls a callback with `{ factorIds, defaultGA }`. Style as pill buttons or a select dropdown matching the existing UI patterns.

- [ ] **Step 3: Add `loadPreset` to useCalculator hook**

File: `src/lib/hooks/use-calculator.ts`

```typescript
const loadPreset = useCallback((factorIds: string[], ga: GestationalAgeDays) => {
  setState((s) => ({
    ...s,
    ga,
    activeFactorIds: factorIds,
    applyInteractions: factorIds.length >= 2,
  }));
}, []);
```

- [ ] **Step 4: Wire PresetSelector into calculator page**

File: `src/app/calculator/page.tsx`

Add `<PresetSelector onSelect={(preset) => loadPreset(preset.factorIds, preset.defaultGA)} />` above the CalculatorForm.

- [ ] **Step 5: Verify**

Click each preset. Verify factors are selected, GA is set, and the curve updates. Verify the glass box shows correct decomposition.

- [ ] **Step 6: Commit**

```bash
git add src/data/calculator-presets.ts src/components/calculator/preset-selector.tsx src/lib/hooks/use-calculator.ts src/app/calculator/page.tsx
git commit -m "feat(calculator): add quick-scenario presets

Pre-built clinical scenarios (AMA+GDM, HTN+prior stillbirth, etc.)
that load risk factors and GA with one click."
```

---

## Chunk 3: Physiologic Data Visualization (Improvements #7, #8)

Surfaces the rich physiologic data that exists in `src/data/physiologic/index.ts` but isn't visible in the app.

---

### Task 3.1: Interactive Convergence Chart (#7)

**Files:**
- Create: `src/components/charts/convergence-chart.tsx`
- Create: `src/app/physiology/page.tsx`
- Modify: `src/components/layout/header.tsx` (add nav link)

- [ ] **Step 1: Create the ConvergenceChart component**

File: `src/components/charts/convergence-chart.tsx`

Import `convergenceData` from `@/data/physiologic`. Build a Recharts `ComposedChart` with dual Y-axes:
- Left axis: Percentage (0-100) for amniotic fluid, meconium, macrosomia
- Right axis: Risk per 1,000 × 10 for stillbirth (multiplied for visual scale)
- Lines: 4 lines in distinct colors from `chartColors` — fluid (blue, declining), meconium (amber, rising), macrosomia (green, rising), stillbirth (pink/red, rising sharply)
- X-axis: GA weeks 37-42
- Tooltip: show all 4 values with units
- Legend at bottom

The visual story: all four lines converge toward "bad" from 39w onward.

- [ ] **Step 2: Create the Physiology page**

File: `src/app/physiology/page.tsx`

A server component page with:
- Title: "Physiologic Risk Convergence"
- Subtitle explaining what the chart shows
- The `ConvergenceChart` component
- Below the chart: a section for the week-by-week physiology (Task 3.2)

Export metadata:
```typescript
export const metadata = {
  title: "Physiology — Kairos",
  description: "Week-by-week physiologic changes driving delivery timing decisions from 37-42 weeks.",
};
```

- [ ] **Step 3: Add nav link**

File: `src/components/layout/header.tsx`

Add `{ href: "/physiology", label: "Physiology" }` to the `navLinks` array, between "Evidence" and "Compare".

- [ ] **Step 4: Verify**

Navigate to `/physiology`. Verify the convergence chart renders with all 4 lines and the tooltip works.

- [ ] **Step 5: Commit**

```bash
git add src/components/charts/convergence-chart.tsx src/app/physiology/page.tsx src/components/layout/header.tsx
git commit -m "feat: add physiology page with convergence chart

Visualizes amniotic fluid decline, meconium staining, macrosomia,
and stillbirth risk converging from 37-42 weeks."
```

---

### Task 3.2: Week-by-Week Physiology Timeline (#8)

**Files:**
- Create: `src/components/physiology/physiology-timeline.tsx`
- Modify: `src/app/physiology/page.tsx`
- Reference: `src/data/physiologic/index.ts` (`weekByWeekPhysiology`)

- [ ] **Step 1: Create the PhysiologyTimeline component**

File: `src/components/physiology/physiology-timeline.tsx`

A `"use client"` component with:
- A horizontal step bar or slider showing weeks 39-42
- At each week, display 5 cards: Placenta, Amniotic Fluid, Meconium, Fetal Growth, Hormonal
- Use Framer Motion's `AnimatePresence` for smooth transitions between weeks
- Each card has an icon, a title, and the description text from `weekByWeekPhysiology`
- Cards should use color coding: green (39w) → amber (40-41w) → red (42w) to visually convey increasing risk
- In teaching mode (import `useTeachingMode`), show expanded descriptions

- [ ] **Step 2: Add to physiology page**

File: `src/app/physiology/page.tsx`

Add `<PhysiologyTimeline />` below the convergence chart, wrapped in a section with the heading "Week-by-Week Changes".

- [ ] **Step 3: Verify**

Navigate to `/physiology`. Step through 39w → 42w. Verify cards animate, content changes, and color coding progresses.

- [ ] **Step 4: Commit**

```bash
git add src/components/physiology/physiology-timeline.tsx src/app/physiology/page.tsx
git commit -m "feat(physiology): add interactive week-by-week timeline

Step-through component showing placental, amniotic fluid, meconium,
fetal growth, and hormonal changes from 39-42 weeks with animations."
```

---

## Chunk 4: Enhanced Compare & Analysis (Improvements #9, #10, #11)

---

### Task 4.1: Patient Scenario Comparison (#9)

**Files:**
- Create: `src/components/calculator/scenario-compare.tsx`
- Create: `src/lib/hooks/use-scenario-compare.ts`
- Create: `src/app/scenarios/page.tsx`
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Create the useScenarioCompare hook**

File: `src/lib/hooks/use-scenario-compare.ts`

```typescript
"use client";

import { useState, useMemo, useCallback } from "react";
import { calculateRiskCurve } from "@/lib/calculator/risk-engine";
import type { RiskCalculation } from "@/data/types";

export interface Scenario {
  id: string;
  name: string;
  factorIds: string[];
  applyInteractions: boolean;
  color: string;
}

const SCENARIO_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

export function useScenarioCompare() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: "1", name: "Scenario A", factorIds: [], applyInteractions: false, color: SCENARIO_COLORS[0] },
  ]);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 4) return;
    const idx = scenarios.length;
    setScenarios((s) => [
      ...s,
      {
        id: String(idx + 1),
        name: `Scenario ${String.fromCharCode(65 + idx)}`,
        factorIds: [],
        applyInteractions: false,
        color: SCENARIO_COLORS[idx % SCENARIO_COLORS.length],
      },
    ]);
  }, [scenarios.length]);

  const removeScenario = useCallback((id: string) => {
    setScenarios((s) => s.filter((sc) => sc.id !== id));
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<Omit<Scenario, "id" | "color">>) => {
    setScenarios((s) =>
      s.map((sc) => (sc.id === id ? { ...sc, ...updates } : sc))
    );
  }, []);

  const toggleFactor = useCallback((scenarioId: string, factorId: string) => {
    setScenarios((s) =>
      s.map((sc) => {
        if (sc.id !== scenarioId) return sc;
        const has = sc.factorIds.includes(factorId);
        return {
          ...sc,
          factorIds: has
            ? sc.factorIds.filter((f) => f !== factorId)
            : [...sc.factorIds, factorId],
        };
      })
    );
  }, []);

  const curves = useMemo<Map<string, RiskCalculation[]>>(() => {
    const map = new Map<string, RiskCalculation[]>();
    for (const sc of scenarios) {
      map.set(
        sc.id,
        calculateRiskCurve({
          activeFactorIds: sc.factorIds,
          applyInteractions: sc.applyInteractions,
        })
      );
    }
    return map;
  }, [scenarios]);

  return { scenarios, addScenario, removeScenario, updateScenario, toggleFactor, curves };
}
```

- [ ] **Step 2: Create the ScenarioCompare page component**

File: `src/app/scenarios/page.tsx`

A `"use client"` page with:
- Top: editable scenario name tabs (up to 4), each with its assigned color dot
- For each scenario: a compact factor selector (reuse factor list from calculator-form, but inline/horizontal)
- Chart: a `ComposedChart` rendering all scenario curves simultaneously, each in its assigned color, baseline as dashed gray
- Below chart: side-by-side glass-box summaries (compact version) for each scenario
- "Add Scenario" button (max 4)

Add metadata and nav link in `header.tsx`: `{ href: "/scenarios", label: "Scenarios" }`.

- [ ] **Step 3: Verify**

Create 2-3 scenarios with different factors. Verify curves render in different colors, update independently, and the comparison is clear.

- [ ] **Step 4: Commit**

```bash
git add src/components/calculator/scenario-compare.tsx src/lib/hooks/use-scenario-compare.ts src/app/scenarios/page.tsx src/components/layout/header.tsx
git commit -m "feat: add patient scenario comparison page

Compare up to 4 risk scenarios side-by-side with overlaid curves
and compact glass-box breakdowns."
```

---

### Task 4.2: GA Timeline on Condition Cards (#10)

**Files:**
- Create: `src/components/condition/ga-timeline-bar.tsx`
- Modify: `src/components/condition/condition-card.tsx`

- [ ] **Step 1: Create GATimelineBar component**

File: `src/components/condition/ga-timeline-bar.tsx`

A small, purely visual component:

```typescript
interface Props {
  earliestGA: number; // GestationalAgeDays
  latestGA: number;
}
```

Renders a thin horizontal bar (4px height, full card width) representing 34w-42w range. The recommended delivery window is highlighted in gradient (kairos-gradient). Everything outside is `bg-muted`. Use the existing `gaToPercent` function logic (from compare page) to convert GA days to percentage position.

- [ ] **Step 2: Add to ConditionCard**

File: `src/components/condition/condition-card.tsx`

Import `GATimelineBar`. If the primary recommendation has `timing.type === "range"`, render the bar at the bottom of the card (inside the Card, after the existing content). For `type === "immediate"`, show a bar highlighting 34w. For `type === "individualize"`, show a subtle dotted line.

- [ ] **Step 3: Verify**

Navigate to `/conditions`. Verify each card has a subtle colored bar at the bottom. Scan visually to confirm different conditions have windows at different positions.

- [ ] **Step 4: Commit**

```bash
git add src/components/condition/ga-timeline-bar.tsx src/components/condition/condition-card.tsx
git commit -m "feat(conditions): add GA timeline minibar to condition cards

Shows a thin colored bar on each card representing the recommended
delivery window within the 34-42w range."
```

---

### Task 4.3: Guideline Divergence Highlights (#11)

**Files:**
- Create: `src/lib/utils/guideline-divergence.ts`
- Create: `src/__tests__/lib/utils/guideline-divergence.test.ts`
- Create: `src/components/condition/divergence-indicator.tsx`
- Modify: `src/components/condition/condition-detail.tsx`
- Modify: `src/app/conditions/page.tsx`

- [ ] **Step 1: Write divergence detection logic**

File: `src/lib/utils/guideline-divergence.ts`

```typescript
import type { GuidelineRecommendation } from "@/data/types";

export interface DivergenceResult {
  hasDivergence: boolean;
  overlapGA?: { earliest: number; latest: number };
  divergenceGA?: Array<{ body: string; earliest: number; latest: number }>;
  maxDivergenceDays: number;
}

/**
 * Detect divergence between multiple guideline recommendations.
 * Only applies to recommendations with timing.type === "range".
 */
export function detectDivergence(recs: GuidelineRecommendation[]): DivergenceResult {
  const ranges = recs
    .filter((r) => r.timing.type === "range")
    .map((r) => ({
      body: r.citations.map((c) => c.body).join("/"),
      earliest: r.timing.type === "range" ? r.timing.range.earliest : 0,
      latest: r.timing.type === "range" ? r.timing.range.latest : 0,
    }));

  if (ranges.length < 2) return { hasDivergence: false, maxDivergenceDays: 0 };

  const overlapEarliest = Math.max(...ranges.map((r) => r.earliest));
  const overlapLatest = Math.min(...ranges.map((r) => r.latest));
  const globalEarliest = Math.min(...ranges.map((r) => r.earliest));
  const globalLatest = Math.max(...ranges.map((r) => r.latest));

  const hasDivergence = overlapEarliest > globalEarliest || overlapLatest < globalLatest;
  const maxDivergenceDays = (globalLatest - globalEarliest) - (Math.max(0, overlapLatest - overlapEarliest));

  return {
    hasDivergence,
    overlapGA: overlapEarliest <= overlapLatest
      ? { earliest: overlapEarliest, latest: overlapLatest }
      : undefined,
    divergenceGA: ranges,
    maxDivergenceDays,
  };
}
```

- [ ] **Step 2: Write tests**

File: `src/__tests__/lib/utils/guideline-divergence.test.ts`

Test with: two overlapping ranges (no divergence), two partially overlapping ranges (divergence), and two non-overlapping ranges (full divergence).

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run src/__tests__/lib/utils/guideline-divergence.test.ts`
Expected: PASS

- [ ] **Step 4: Create DivergenceIndicator component**

File: `src/components/condition/divergence-indicator.tsx`

A small visual component that takes `DivergenceResult` as props. If `hasDivergence`:
- Show a horizontal bar with colored segments for each guideline body
- Overlapping region is highlighted
- Non-overlapping regions show which body disagrees
- Text: "Guidelines diverge by {maxDivergenceDays} days"

- [ ] **Step 5: Add to condition detail page**

File: `src/components/condition/condition-detail.tsx`

Import `detectDivergence`. If the condition has 2+ guideline recommendations, compute divergence. If divergent, render `DivergenceIndicator` inside the recommendations card.

- [ ] **Step 6: Add divergence filter to conditions page**

File: `src/app/conditions/page.tsx`

Add a filter option: "Show only divergent guidelines." Filter conditions where `detectDivergence(c.guidelineRecommendations).hasDivergence === true`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/utils/guideline-divergence.ts src/__tests__/lib/utils/guideline-divergence.test.ts src/components/condition/divergence-indicator.tsx src/components/condition/condition-detail.tsx src/app/conditions/page.tsx
git commit -m "feat: add guideline divergence detection and visualization

Highlights when ACOG, NICE, and other bodies disagree on delivery
timing for the same condition, with a visual divergence bar."
```

---

## Chunk 5: Data Enrichment (Improvements #12, #13, #14, #15)

---

### Task 5.1: PubMed Recent Literature Integration (#12)

**Files:**
- Create: `src/components/condition/recent-literature.tsx`
- Modify: `src/components/condition/condition-detail.tsx`

This task uses the PubMed MCP server (`mcp__179d383d-...__search_articles`). Since MCP calls are made at build time or via API routes, and Kairos uses static data files, this should be implemented as a client-side component that calls the MCP tool via a Next.js API route.

- [ ] **Step 1: Create API route for PubMed search**

File: `src/app/api/pubmed/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ articles: [] });

  // This will be wired to the PubMed MCP tool
  // For now, create the interface and placeholder
  // The actual MCP integration depends on runtime MCP availability
  return NextResponse.json({
    articles: [],
    query,
    note: "PubMed MCP integration pending — will populate when MCP server is available at runtime",
  });
}
```

- [ ] **Step 2: Create RecentLiterature component**

File: `src/components/condition/recent-literature.tsx`

A `"use client"` component that takes `conditionName: string` and `conditionTags: string[]` as props. On mount, fetches `/api/pubmed?q=${conditionName}+delivery+timing`. Displays results as a list of article cards with title, journal, year. Shows a loading skeleton while fetching. Shows "No recent articles found" if empty.

Also display `lastReviewedDate` from the condition if present, with a warning badge if > 2 years old.

- [ ] **Step 3: Add to condition detail page**

File: `src/components/condition/condition-detail.tsx`

Add `<RecentLiterature>` section after "Key Evidence Sources" and before "Landmark Trials". Only render if the condition name is available.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/pubmed/route.ts src/components/condition/recent-literature.tsx src/components/condition/condition-detail.tsx
git commit -m "feat(conditions): add recent literature section with PubMed integration

Queries PubMed for recent articles on each condition. Shows
lastReviewedDate staleness warnings. MCP integration ready."
```

---

### Task 5.2: Clinical Trials Integration (#13)

**Files:**
- Create: `src/components/condition/active-trials.tsx`
- Create: `src/app/api/trials/route.ts`
- Modify: `src/components/condition/condition-detail.tsx`

- [ ] **Step 1: Create API route for ClinicalTrials.gov**

File: `src/app/api/trials/route.ts`

Same pattern as PubMed: placeholder API route that will use the ClinicalTrials.gov MCP (`mcp__4d425401-...__search_trials`).

- [ ] **Step 2: Create ActiveTrials component**

File: `src/components/condition/active-trials.tsx`

Shows active clinical trials related to the condition. Displays: trial title, phase, enrollment status, estimated completion. Highlighted if the condition has low evidence grade.

- [ ] **Step 3: Add to condition detail**

Add after RecentLiterature section.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/trials/route.ts src/components/condition/active-trials.tsx src/components/condition/condition-detail.tsx
git commit -m "feat(conditions): add active clinical trials section

Shows relevant ongoing trials from ClinicalTrials.gov for each condition.
Highlights conditions with weak evidence that have active research."
```

---

### Task 5.3: ICD-10 Code Integration (#14)

**Files:**
- Create: `src/lib/utils/icd-codes.ts`
- Modify: `src/components/condition/condition-detail.tsx`
- Modify: `src/app/conditions/page.tsx`

- [ ] **Step 1: Create ICD code data file**

File: `src/lib/utils/icd-codes.ts`

A mapping of condition IDs to ICD-10 codes. Start with the most common conditions:

```typescript
export const conditionIcdCodes: Record<string, string[]> = {
  chronic_htn: ["O10.0", "O10.9"],
  preeclampsia_without_severe: ["O14.0"],
  preeclampsia_with_severe: ["O14.1"],
  gdm_diet_controlled: ["O24.410"],
  gdm_medication_controlled: ["O24.414"],
  pregestational_dm_well_controlled: ["O24.011", "O24.111"],
  // ... extend for all conditions
};

export function getIcdCodes(conditionId: string): string[] {
  return conditionIcdCodes[conditionId] ?? [];
}
```

- [ ] **Step 2: Display ICD codes on condition detail**

File: `src/components/condition/condition-detail.tsx`

If codes exist, show them as small mono badges below the condition name in the header.

- [ ] **Step 3: Add ICD search to conditions page**

File: `src/app/conditions/page.tsx`

Extend the search filter to also match on ICD codes: `c.icdCodes?.some(code => code.includes(q))` or use the `conditionIcdCodes` mapping.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils/icd-codes.ts src/components/condition/condition-detail.tsx src/app/conditions/page.tsx
git commit -m "feat: add ICD-10 code display and search

Shows ICD-10 codes on condition pages and allows searching
by ICD code on the conditions list page."
```

---

### Task 5.4: Evidence Completeness Dashboard (#15)

**Files:**
- Create: `src/components/data-quality/completeness-dashboard.tsx`
- Create: `src/app/data-quality/page.tsx`

- [ ] **Step 1: Create completeness aggregation logic**

File: `src/components/data-quality/completeness-dashboard.tsx`

A `"use client"` component that imports `allConditions` and computes:
- Total conditions with guideline recommendations (count & %)
- Total with risk data
- Total with landmark trials
- Total with key evidence sources
- Total with physiology explanations
- Total with clinical notes
- Total with interactions
- Breakdown by evidence strength (how many high/moderate/low/very_low/expert)
- Breakdown by category completeness

Render as a grid of progress bars using the existing Card pattern. Each metric shows: bar, count, percentage.

- [ ] **Step 2: Create the page**

File: `src/app/data-quality/page.tsx`

```typescript
import { CompletenessDashboard } from "@/components/data-quality/completeness-dashboard";

export const metadata = {
  title: "Data Quality — Kairos",
  description: "Transparency dashboard showing condition data completeness.",
};

export default function DataQualityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight kairos-heading">Data Quality</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Transparency report on condition data completeness and evidence quality.
      </p>
      <CompletenessDashboard />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Navigate to `/data-quality`. Verify all metrics render and percentages make sense.

- [ ] **Step 4: Commit**

```bash
git add src/components/data-quality/completeness-dashboard.tsx src/app/data-quality/page.tsx
git commit -m "feat: add data quality transparency dashboard

Shows completeness metrics for conditions, risk data, trials,
evidence sources, and evidence strength distribution."
```

---

## Chunk 6: Search & Navigation (Improvements #16, #17)

---

### Task 6.1: Command Palette (#16)

**Files:**
- Create: `src/components/layout/command-palette.tsx`
- Modify: `src/app/layout.tsx`
- Reference: `src/components/ui/command.tsx` (cmdk already in deps)

- [ ] **Step 1: Create the CommandPalette component**

File: `src/components/layout/command-palette.tsx`

A `"use client"` component using the existing `Command` component from `src/components/ui/command.tsx` (shadcn/ui cmdk wrapper). Features:

- Opens on `⌘K` (or `Ctrl+K`) keyboard shortcut
- Renders in a `Dialog` overlay
- Groups:
  - **Conditions** — search all conditions by name/tag, navigates to `/conditions/${id}`
  - **Quick Actions** — "Risk Calculator", "Compare Conditions", "Evidence Library", "Methodology", "Physiology"
  - **Settings** — "Toggle Teaching Mode", "Toggle Theme"
- Use `allConditions` for the condition list
- Import `useTeachingMode` for toggle
- Import `useTheme` from `next-themes` for theme toggle
- Use `useRouter` from `next/navigation` for navigation

- [ ] **Step 2: Add to root layout**

File: `src/app/layout.tsx`

Import and render `<CommandPalette />` inside the body, alongside the existing `<Header />`.

- [ ] **Step 3: Verify**

Press `⌘K`. Verify:
- Palette opens with search
- Typing "pree" shows preeclampsia conditions
- Clicking a condition navigates to its page
- "Toggle Teaching Mode" works
- Escape closes

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/command-palette.tsx src/app/layout.tsx
git commit -m "feat: add command palette (⌘K) for quick navigation

Search conditions, navigate to pages, and toggle settings
from a keyboard-driven command palette using cmdk."
```

---

### Task 6.2: Related Conditions Navigation (#17)

**Files:**
- Create: `src/lib/utils/related-conditions.ts`
- Create: `src/components/condition/related-conditions.tsx`
- Modify: `src/components/condition/condition-detail.tsx`

- [ ] **Step 1: Create related conditions logic**

File: `src/lib/utils/related-conditions.ts`

```typescript
import { allConditions, conditionById } from "@/data/conditions";
import type { ObstetricCondition } from "@/data/types";

export interface RelatedCondition {
  condition: ObstetricCondition;
  reason: "same_category" | "interaction" | "similar_ga";
}

export function getRelatedConditions(
  conditionId: string,
  limit: number = 6
): RelatedCondition[] {
  const condition = conditionById.get(conditionId);
  if (!condition) return [];

  const related: RelatedCondition[] = [];
  const seen = new Set<string>([conditionId]);

  // 1. Conditions that interact with this one
  for (const interaction of condition.interactions) {
    const other = conditionById.get(interaction.interactingConditionId);
    if (other && !seen.has(other.id)) {
      related.push({ condition: other, reason: "interaction" });
      seen.add(other.id);
    }
  }

  // 2. Same category (excluding sub-variants of same parent)
  for (const other of allConditions) {
    if (seen.has(other.id)) continue;
    if (other.category === condition.category && other.parentConditionId !== condition.id) {
      related.push({ condition: other, reason: "same_category" });
      seen.add(other.id);
    }
    if (related.length >= limit) break;
  }

  // 3. Similar GA window (if still room)
  if (related.length < limit) {
    const myGA = getEarliestGA(condition);
    if (myGA < 999) {
      const gaSimilar = allConditions
        .filter((c) => !seen.has(c.id))
        .map((c) => ({ condition: c, diff: Math.abs(getEarliestGA(c) - myGA) }))
        .filter((c) => c.diff <= 14) // within 2 weeks
        .sort((a, b) => a.diff - b.diff)
        .slice(0, limit - related.length);

      for (const { condition: c } of gaSimilar) {
        related.push({ condition: c, reason: "similar_ga" });
        seen.add(c.id);
      }
    }
  }

  return related.slice(0, limit);
}

function getEarliestGA(c: ObstetricCondition): number {
  const rec = c.guidelineRecommendations[0];
  if (!rec) return 999;
  if (rec.timing.type === "range") return rec.timing.range.earliest;
  if (rec.timing.type === "immediate") return 0;
  return 999;
}
```

- [ ] **Step 2: Create RelatedConditions component**

File: `src/components/condition/related-conditions.tsx`

A card section showing related conditions as compact clickable cards, each with:
- Condition name (linked)
- Reason badge: "Interacts", "Same category", "Similar GA"
- GA window badge

- [ ] **Step 3: Add to condition detail page**

File: `src/components/condition/condition-detail.tsx`

Add `<RelatedConditions conditionId={condition.id} />` at the bottom, after the sub-variants section.

- [ ] **Step 4: Verify**

Navigate to a condition with known interactions (e.g., chronic HTN). Verify related conditions appear with correct reasons.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/related-conditions.ts src/components/condition/related-conditions.tsx src/components/condition/condition-detail.tsx
git commit -m "feat(conditions): add related conditions navigation

Shows conditions that interact, share a category, or have similar
GA windows at the bottom of each condition detail page."
```

---

## Chunk 7: Calculator UX & Visual Polish (Improvements #19, #20, #21, #22, #24)

---

### Task 7.1: Risk Factor Impact Preview (#19)

**Files:**
- Create: `src/components/calculator/factor-preview-sparkline.tsx`
- Modify: `src/components/calculator/calculator-form.tsx`

- [ ] **Step 1: Create FactorPreviewSparkline component**

File: `src/components/calculator/factor-preview-sparkline.tsx`

A tiny (80x24px) sparkline component that takes `factorId: string` and `currentFactorIds: string[]`. Computes two mini curves:
- Current risk curve (with `currentFactorIds`)
- Preview curve (with `currentFactorIds + [factorId]`)

Renders as two simple SVG paths (no axes, no labels — just the shape). The preview curve is in pink, the current in gray. This gives a visual preview of how adding the factor would shift the curve.

Use `calculateRiskCurve` directly. Memoize heavily since this renders on hover.

- [ ] **Step 2: Add hover preview to calculator form**

File: `src/components/calculator/calculator-form.tsx`

On hover over a non-active factor button, show the `FactorPreviewSparkline` as a tooltip or inline preview. Use a `useState` for hovered factor ID. Only show sparkline for factors not already active.

- [ ] **Step 3: Verify**

Hover over different factors in the calculator. Verify sparkline appears showing the curve shift.

- [ ] **Step 4: Commit**

```bash
git add src/components/calculator/factor-preview-sparkline.tsx src/components/calculator/calculator-form.tsx
git commit -m "feat(calculator): add risk factor impact preview sparkline

Shows a mini sparkline on hover previewing how adding a factor
would shift the risk curve."
```

---

### Task 7.2: Animated Risk Curve Transitions (#20)

**Files:**
- Modify: `src/components/charts/stillbirth-risk-curve.tsx`

- [ ] **Step 1: Add animated transitions**

File: `src/components/charts/stillbirth-risk-curve.tsx`

Recharts supports `animationDuration` on `Line` and `Area` components. Set:
- `animationDuration={600}` on the adjusted Line
- `animationDuration={800}` on the CI Area
- `animationEasing="ease-in-out"` on both
- `isAnimationActive={true}` explicitly

This is a minimal change — Recharts handles the interpolation internally.

- [ ] **Step 2: Verify**

Toggle factors on/off in the calculator. Verify:
- The adjusted curve smoothly rises/falls
- The CI band smoothly expands/contracts
- No jank or layout shift

- [ ] **Step 3: Commit**

```bash
git add src/components/charts/stillbirth-risk-curve.tsx
git commit -m "feat(calculator): add smooth animated transitions to risk curve

Uses Recharts animation props for 600ms ease-in-out transitions
when risk factors are toggled."
```

---

### Task 7.3: Risk Contextualization Panel (#21)

**Files:**
- Create: `src/components/calculator/risk-context-panel.tsx`
- Create: `src/lib/calculator/risk-equivalence.ts`
- Create: `src/__tests__/lib/calculator/risk-equivalence.test.ts`
- Modify: `src/app/calculator/page.tsx`

- [ ] **Step 1: Write risk equivalence logic**

File: `src/lib/calculator/risk-equivalence.ts`

```typescript
import type { GestationalAgeDays } from "@/data/types";
import { interpolateBaseline } from "./risk-engine";
import { w } from "@/data/helpers";

/**
 * Find the GA at which baseline risk equals the given adjusted risk.
 * E.g., "Your adjusted risk at 39w equals baseline risk at 41w3d."
 */
export function findEquivalentBaselineGA(
  adjustedRiskPer1000: number
): GestationalAgeDays | null {
  // Binary search from 37w to 43w (in days)
  let low = w(37);
  let high = w(43);

  const lowRisk = interpolateBaseline(low);
  const highRisk = interpolateBaseline(high);

  if (adjustedRiskPer1000 < lowRisk) return null; // Below baseline minimum
  if (adjustedRiskPer1000 > highRisk) return null; // Above baseline maximum

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const midRisk = interpolateBaseline(mid);
    if (Math.abs(midRisk - adjustedRiskPer1000) < 0.001) return mid;
    if (midRisk < adjustedRiskPer1000) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round((low + high) / 2);
}

/**
 * Format risk as "1 in X" for clinical communication.
 */
export function riskAsOneInX(riskPer1000: number): string {
  if (riskPer1000 <= 0) return "N/A";
  const oneInX = Math.round(1000 / riskPer1000);
  return `1 in ${oneInX.toLocaleString()}`;
}
```

- [ ] **Step 2: Write tests**

File: `src/__tests__/lib/calculator/risk-equivalence.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { findEquivalentBaselineGA, riskAsOneInX } from "@/lib/calculator/risk-equivalence";

describe("risk equivalence", () => {
  it("finds equivalent GA for elevated risk", () => {
    const equivalentGA = findEquivalentBaselineGA(1.5);
    expect(equivalentGA).not.toBeNull();
    if (equivalentGA) {
      // 1.5 per 1000 should map to somewhere around 40-41w
      expect(equivalentGA).toBeGreaterThan(37 * 7);
      expect(equivalentGA).toBeLessThan(43 * 7);
    }
  });

  it("returns null for risk below baseline minimum", () => {
    expect(findEquivalentBaselineGA(0.01)).toBeNull();
  });

  it("formats risk as 1 in X correctly", () => {
    expect(riskAsOneInX(2.0)).toBe("1 in 500");
    expect(riskAsOneInX(5.0)).toBe("1 in 200");
  });
});
```

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run src/__tests__/lib/calculator/risk-equivalence.test.ts`
Expected: PASS

- [ ] **Step 4: Create RiskContextPanel component**

File: `src/components/calculator/risk-context-panel.tsx`

A `"use client"` component that takes `result: RiskCalculation` as a prop. Displays:
- "1 in X pregnancies" framing for both baseline and adjusted risk
- GA equivalence: "This adjusted risk at {currentGA} equals the baseline risk at {equivalentGA}" (if found)
- Use `gaToDisplay` for formatted GA strings

Style as a Card with subtle brand-blue left border.

- [ ] **Step 5: Add to calculator page**

File: `src/app/calculator/page.tsx`

Add `<RiskContextPanel result={currentRisk} />` between the glass box and the mortality crossover chart.

- [ ] **Step 6: Verify**

Select some risk factors. Verify the panel shows "1 in X" and the GA equivalence statement. Verify it updates when GA or factors change.

- [ ] **Step 7: Commit**

```bash
git add src/lib/calculator/risk-equivalence.ts src/__tests__/lib/calculator/risk-equivalence.test.ts src/components/calculator/risk-context-panel.tsx src/app/calculator/page.tsx
git commit -m "feat(calculator): add risk contextualization panel

Shows adjusted risk as '1 in X' and GA-equivalence for patient
counseling (e.g., 'same risk as low-risk at 41w3d')."
```

---

### Task 7.4: Condition Category SVG Icons (#22)

**Files:**
- Create: `src/components/icons/category-icons.tsx`
- Modify: `src/components/condition/condition-card.tsx`
- Modify: `src/app/page.tsx` (home page category grid)

- [ ] **Step 1: Create the SVG icon set**

File: `src/components/icons/category-icons.tsx`

Create 25 SVG icon components (one per ConditionCategory), all following a consistent design:
- 24x24 viewBox
- 1.5px stroke width
- `currentColor` for stroke (inherits text color)
- No fill (outline style)
- Each wrapped as a React component

Export a lookup function:
```typescript
export function CategoryIcon({ category, className }: { category: ConditionCategory; className?: string }) {
  const Icon = icons[category] ?? DefaultIcon;
  return <Icon className={className} />;
}
```

Icons:
- `hypertensive` — blood pressure cuff
- `diabetes` — glucose meter / drop
- `cardiac_*` — heart variants
- `renal` — kidney
- `hepatic` — liver
- `hematologic` — blood cells
- `neurologic` — brain
- `pulmonary` — lungs
- `fetal_*` — fetus outline
- `placental_uterine` — uterus
- `multiple_gestation` — twin circles
- etc.

Use the `@svg-icon-engineering` skill for design guidance.

- [ ] **Step 2: Add icons to condition cards**

File: `src/components/condition/condition-card.tsx`

Import `CategoryIcon`. Add it in the card header, before the condition name:
```tsx
<CategoryIcon category={condition.category} className="h-4 w-4 shrink-0 text-muted-foreground" />
```

- [ ] **Step 3: Add icons to home page category grid**

File: `src/app/page.tsx`

Import `CategoryIcon`. Add it inside each category Card:
```tsx
<CategoryIcon category={cat} className="h-5 w-5 text-muted-foreground" />
```

- [ ] **Step 4: Verify**

Navigate to home page and conditions list. Verify icons render for each category and look consistent.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/category-icons.tsx src/components/condition/condition-card.tsx src/app/page.tsx
git commit -m "feat: add SVG icon set for 25 condition categories

Consistent outline icons for each medical category, displayed
on condition cards and the home page category grid."
```

---

### Task 7.5: Animated Hero Visualization (#24)

**Files:**
- Create: `src/components/layout/animated-hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create AnimatedHero component**

File: `src/components/layout/animated-hero.tsx`

A `"use client"` component using Framer Motion (already in deps). Renders two animated SVG paths representing diverging risk curves:
- Baseline curve: gently rising, purple gradient
- Adjusted curve: more steeply rising, pink gradient
- The curves slowly separate on mount (2s animation)
- Subtle parallax on scroll using `useScroll` from Framer Motion
- Small animated dots at data points that pulse gently
- Very subtle — opacity ~0.15, positioned behind the hero text

Replace the existing `<HeroMotif>` import.

- [ ] **Step 2: Swap in the animated hero**

File: `src/app/page.tsx`

Replace `<HeroMotif>` with `<AnimatedHero>` in the hero section. Keep the same CSS positioning (`absolute inset-0 pointer-events-none z-0`).

- [ ] **Step 3: Verify**

Load the home page. Verify:
- Curves animate on mount
- Subtle and non-distracting
- Works in both light and dark mode
- Doesn't impact scroll performance

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/animated-hero.tsx src/app/page.tsx
git commit -m "feat: add animated diverging-curves hero visualization

Replaces static hero motif with subtly animated risk curves
that separate on mount, telling the Kairos visual story."
```

---

## Summary: Full Task Dependency Graph

```
Chunk 1 (Calculator Core) ─── no dependencies
  Task 1.1: Mortality Crossover Chart
  Task 1.2: NNT Panel
  Task 1.3: Neonatal Counterbalance Toggle

Chunk 2 (Condition ↔ Calculator) ─── builds on calculator page changes from Chunk 1
  Task 2.1: Deep Link (condition → calculator)
  Task 2.2: Condition Recommendations (depends on 2.1 mapping)
  Task 2.3: Calculator Presets

Chunk 3 (Physiology) ─── independent
  Task 3.1: Convergence Chart
  Task 3.2: Physiology Timeline (depends on 3.1 page)

Chunk 4 (Compare & Analysis) ─── independent
  Task 4.1: Scenario Compare
  Task 4.2: GA Timeline Bars
  Task 4.3: Guideline Divergence

Chunk 5 (Data Enrichment) ─── independent
  Task 5.1: PubMed Integration
  Task 5.2: Clinical Trials
  Task 5.3: ICD-10 Codes
  Task 5.4: Data Quality Dashboard

Chunk 6 (Search & Navigation) ─── independent
  Task 6.1: Command Palette
  Task 6.2: Related Conditions

Chunk 7 (UX & Visual Polish) ─── some depend on calculator page from Chunk 1
  Task 7.1: Factor Preview Sparkline
  Task 7.2: Animated Curve Transitions
  Task 7.3: Risk Contextualization Panel
  Task 7.4: Category SVG Icons
  Task 7.5: Animated Hero
```

**Recommended execution order:** Chunks 1 → 2 → (3, 4, 5, 6 in parallel) → 7

**Total tasks:** 22 (matching the 22 improvements)
**Estimated commits:** 22
