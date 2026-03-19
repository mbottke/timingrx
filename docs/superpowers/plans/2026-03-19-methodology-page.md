# Methodology Visualization Page — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dual-track interactive methodology page at `/methodology` that explains TimingRx's risk calculation through animated visualizations (left) and live formula breakdowns (right), with a shared factor toolbar driving both tracks simultaneously.

**Architecture:** Client-side React page using a shared context provider (`MethodologyContext`) for state. Six scrollable sections each contain a visual component (framer-motion animated Recharts charts and custom SVG gauges) and a math component (dynamic formula displays with animated numbers). A sticky toolbar at top provides GA and factor controls. IntersectionObserver-based scroll spy drives section dot navigation.

**Tech Stack:** Next.js 16 App Router (client page), React 19, framer-motion (new dep), Recharts (existing), Tailwind CSS, Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-methodology-page-design.md`

---

## File Map

### New Files

| File | Responsibility |
|---|---|
| `src/app/methodology/page.tsx` | Page shell — metadata, layout grid, section composition |
| `src/components/methodology/methodology-provider.tsx` | React context: shared state, derived computations |
| `src/components/methodology/factor-toolbar.tsx` | Sticky toolbar with GA selector + factor toggle pills |
| `src/components/methodology/section-nav.tsx` | Left-edge dot navigation with scroll spy |
| `src/components/methodology/section-baseline.tsx` | Section 1: Muglu baseline curve (visual + math) |
| `src/components/methodology/section-multiplication.tsx` | Section 2: Factor multiplication model |
| `src/components/methodology/section-ci-propagation.tsx` | Section 3: CI quadrature propagation |
| `src/components/methodology/section-confidence.tsx` | Section 4: 5-component confidence scorer |
| `src/components/methodology/section-or-correction.tsx` | Section 5: Zhang & Yu OR→RR correction |
| `src/components/methodology/section-grade-mapping.tsx` | Section 6: Grade bar and scenario showcase |
| `src/components/methodology/animated-number.tsx` | Reusable smooth number counting component |
| `src/components/methodology/formula-block.tsx` | Styled formula display with live value injection |
| `src/components/methodology/teaching-callout.tsx` | Expandable educational callout box |
| `src/components/methodology/confidence-gauges.tsx` | Five vertical gauge meters |
| `src/components/methodology/scenario-strip.tsx` | Pre-built scenario quick-load buttons |
| `src/components/methodology/mobile-track-tabs.tsx` | Mobile tab switcher for Visual/Math tracks (<1024px) |
| `src/data/methodology/factor-colors.ts` | Factor color palette (single source of truth) |
| `src/data/methodology/scenarios.ts` | Pre-built scenario definitions |
| `src/__tests__/components/methodology/animated-number.test.tsx` | AnimatedNumber unit tests |
| `src/__tests__/components/methodology/methodology-provider.test.tsx` | Context + derived state tests |
| `src/__tests__/components/methodology/formula-block.test.tsx` | Formula rendering tests |

### Modified Files

| File | Change |
|---|---|
| `src/components/layout/header.tsx` | Add "Methodology" nav link |
| `package.json` | Add `framer-motion` dependency |

### Notes on spec file map deviations
- `animated-curve.tsx` from spec is inlined into `section-multiplication.tsx` (the curve logic is section-specific, not reusable across sections)
- `uncertainty-meter.tsx` from spec is replaced by a simpler horizontal CI-width bar in `section-ci-propagation.tsx` (circular gauge was over-engineered for the information conveyed; can be enhanced later)

---

## Chunk 1: Foundation — Dependencies, Data, Context, and Shared Components

### Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install framer-motion**

Run: `cd "/Users/michaelbottke/Desktop/Family Medicine Residency/Lectures/Post-Dates Risks and Management/timingrx" && pnpm add framer-motion`

Expected: framer-motion added to dependencies in package.json

- [ ] **Step 2: Verify installation**

Run: `pnpm exec tsc --noEmit 2>&1 | head -5`

Expected: No errors (or existing errors only)

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add framer-motion for methodology page animations"
```

---

### Task 2: Factor color palette data

**Files:**
- Create: `src/data/methodology/factor-colors.ts`

- [ ] **Step 1: Create factor color palette**

```typescript
// src/data/methodology/factor-colors.ts

/**
 * Single source of truth for factor colors in the methodology page.
 * Colors are chosen for accessibility (WCAG AA contrast on white background).
 * Maps factor categories to colors, with a per-factor-id override for specificity.
 */

export interface FactorColor {
  hex: string;
  name: string;
  /** Tailwind class for text-[color] */
  textClass: string;
  /** Tailwind class for bg-[color] */
  bgClass: string;
  /** Tailwind class for border-[color] */
  borderClass: string;
}

const PALETTE: Record<string, FactorColor> = {
  amber: {
    hex: "#f59e0b",
    name: "Amber",
    textClass: "text-amber-500",
    bgClass: "bg-amber-500",
    borderClass: "border-amber-500",
  },
  blue: {
    hex: "#3b82f6",
    name: "Blue",
    textClass: "text-blue-500",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500",
  },
  purple: {
    hex: "#8b5cf6",
    name: "Purple",
    textClass: "text-violet-500",
    bgClass: "bg-violet-500",
    borderClass: "border-violet-500",
  },
  rose: {
    hex: "#f43f5e",
    name: "Rose",
    textClass: "text-rose-500",
    bgClass: "bg-rose-500",
    borderClass: "border-rose-500",
  },
  teal: {
    hex: "#14b8a6",
    name: "Teal",
    textClass: "text-teal-500",
    bgClass: "bg-teal-500",
    borderClass: "border-teal-500",
  },
  slate: {
    hex: "#64748b",
    name: "Slate",
    textClass: "text-slate-500",
    bgClass: "bg-slate-500",
    borderClass: "border-slate-500",
  },
  indigo: {
    hex: "#6366f1",
    name: "Indigo",
    textClass: "text-indigo-500",
    bgClass: "bg-indigo-500",
    borderClass: "border-indigo-500",
  },
  emerald: {
    hex: "#10b981",
    name: "Emerald",
    textClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
  },
};

/** Maps factor IDs to their assigned color key */
const FACTOR_COLOR_MAP: Record<string, string> = {
  // Age factors → amber
  age_35_39: "amber",
  age_gte_40: "amber",
  age_gte_45: "amber",
  // BMI factors → blue
  bmi_30_34: "blue",
  bmi_35_39: "blue",
  bmi_gte_40: "blue",
  // Metabolic → purple
  preexisting_diabetes: "purple",
  // Cardiovascular → rose
  chronic_hypertension: "rose",
  // Fetal → teal
  sga_fetus: "teal",
  // History → slate
  prior_stillbirth: "slate",
  // Parity → indigo
  nulliparity: "indigo",
  // Social → emerald
  smoking: "emerald",
  black_race: "emerald",
};

const PALETTE_KEYS = Object.keys(PALETTE);

/**
 * Get the color for a given factor ID.
 * Falls back to cycling through the palette for unknown factors.
 */
export function getFactorColor(factorId: string): FactorColor {
  const key = FACTOR_COLOR_MAP[factorId];
  if (key && PALETTE[key]) return PALETTE[key];

  // Fallback: hash the factorId to pick a color deterministically
  let hash = 0;
  for (let i = 0; i < factorId.length; i++) {
    hash = (hash * 31 + factorId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % PALETTE_KEYS.length;
  return PALETTE[PALETTE_KEYS[idx]];
}

export { PALETTE, FACTOR_COLOR_MAP };
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/data/methodology/factor-colors.ts
git commit -m "feat(methodology): add factor color palette data"
```

---

### Task 3: Pre-built scenario definitions

**Files:**
- Create: `src/data/methodology/scenarios.ts`

- [ ] **Step 1: Create scenario data**

```typescript
// src/data/methodology/scenarios.ts

export interface MethodologyScenario {
  id: string;
  label: string;
  description: string;
  activeFactorIds: string[];
  applyInteractions: boolean;
  expectedGrade: string;
  expectedScoreApprox: number;
}

export const methodologyScenarios: MethodologyScenario[] = [
  {
    id: "baseline",
    label: "Baseline only",
    description: "No risk factors — Muglu curve alone",
    activeFactorIds: [],
    applyInteractions: false,
    expectedGrade: "A",
    expectedScoreApprox: 95,
  },
  {
    id: "age_40",
    label: "Age ≥40",
    description: "Single well-studied factor",
    activeFactorIds: ["age_gte_40"],
    applyInteractions: false,
    expectedGrade: "B",
    expectedScoreApprox: 84,
  },
  {
    id: "age_bmi",
    label: "Age ≥40 + BMI 35",
    description: "Two factors, multiplicative model",
    activeFactorIds: ["age_gte_40", "bmi_35_39"],
    applyInteractions: false,
    expectedGrade: "B",
    expectedScoreApprox: 80,
  },
  {
    id: "three_factors",
    label: "Age + BMI + DM",
    description: "Three factors with shared pathophysiology",
    activeFactorIds: ["age_gte_40", "bmi_gte_40", "preexisting_diabetes"],
    applyInteractions: true,
    expectedGrade: "C",
    expectedScoreApprox: 58,
  },
  {
    id: "five_factors",
    label: "5 factors",
    description: "High complexity, strained model",
    activeFactorIds: [
      "age_gte_40",
      "bmi_gte_40",
      "preexisting_diabetes",
      "chronic_hypertension",
      "prior_stillbirth",
    ],
    applyInteractions: true,
    expectedGrade: "D",
    expectedScoreApprox: 42,
  },
  {
    id: "maximum_complexity",
    label: "Maximum complexity",
    description: "7 factors — model at its limits",
    activeFactorIds: [
      "age_gte_40",
      "bmi_gte_40",
      "preexisting_diabetes",
      "chronic_hypertension",
      "prior_stillbirth",
      "sga_fetus",
      "smoking",
    ],
    applyInteractions: true,
    expectedGrade: "F",
    expectedScoreApprox: 28,
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/methodology/scenarios.ts
git commit -m "feat(methodology): add pre-built scenario definitions"
```

---

### Task 4: MethodologyContext provider (with tests)

**Files:**
- Create: `src/components/methodology/methodology-provider.tsx`
- Test: `src/__tests__/components/methodology/methodology-provider.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// src/__tests__/components/methodology/methodology-provider.test.tsx
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  MethodologyProvider,
  useMethodology,
} from "@/components/methodology/methodology-provider";
import { w } from "@/data/helpers";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <MethodologyProvider>{children}</MethodologyProvider>;
}

describe("MethodologyContext", () => {
  it("provides default state with baseline-only calculation", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });
    expect(result.current.ga).toBe(w(39));
    expect(result.current.activeFactorIds).toEqual([]);
    expect(result.current.riskCurve).toHaveLength(6);
    expect(result.current.selectedGaCalculation.baselineRiskPer1000).toBeGreaterThan(0);
    expect(result.current.stepByStepBreakdown).toEqual([]);
  });

  it("updates risk curve when a factor is toggled", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });
    const baselineRisk = result.current.selectedGaCalculation.adjustedRiskPer1000;

    act(() => {
      result.current.toggleFactor("age_gte_40");
    });

    expect(result.current.activeFactorIds).toEqual(["age_gte_40"]);
    expect(
      result.current.selectedGaCalculation.adjustedRiskPer1000
    ).toBeGreaterThan(baselineRisk);
  });

  it("computes stepByStepBreakdown with correct cascading values", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("age_gte_40");
      result.current.toggleFactor("bmi_35_39");
    });

    const steps = result.current.stepByStepBreakdown;
    expect(steps).toHaveLength(2);

    // First step starts from baseline
    expect(steps[0].factorId).toBe("age_gte_40");
    expect(steps[0].riskBefore).toBeCloseTo(
      result.current.selectedGaCalculation.baselineRiskPer1000,
      1
    );
    expect(steps[0].riskAfter).toBeCloseTo(steps[0].riskBefore * 1.88, 1);

    // Second step chains from first
    expect(steps[1].factorId).toBe("bmi_35_39");
    expect(steps[1].riskBefore).toBeCloseTo(steps[0].riskAfter, 1);
    expect(steps[1].riskAfter).toBeCloseTo(steps[1].riskBefore * 2.1, 1);
  });

  it("loads a scenario", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.loadScenario("three_factors");
    });

    expect(result.current.activeFactorIds).toEqual([
      "age_gte_40",
      "bmi_gte_40",
      "preexisting_diabetes",
    ]);
    expect(result.current.applyInteractions).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/__tests__/components/methodology/methodology-provider.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the context provider**

```typescript
// src/components/methodology/methodology-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { GestationalAgeDays, RiskCalculation } from "@/data/types";
import {
  calculateRisk,
  calculateRiskCurve,
  interpolateBaseline,
} from "@/lib/calculator/risk-engine";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { getFactorColor } from "@/data/methodology/factor-colors";
import { methodologyScenarios } from "@/data/methodology/scenarios";
import { w } from "@/data/helpers";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

export interface StepBreakdown {
  factorId: string;
  label: string;
  multiplier: number;
  riskBefore: number;
  riskAfter: number;
  color: string;
  /** True for interaction adjustment steps (renders with dotted connector) */
  isInteraction?: boolean;
}

interface MethodologyContextValue {
  // Mutable state
  ga: GestationalAgeDays;
  activeFactorIds: string[];
  applyInteractions: boolean;

  // Actions
  setGA: (ga: GestationalAgeDays) => void;
  toggleFactor: (factorId: string) => void;
  setApplyInteractions: (apply: boolean) => void;
  loadScenario: (scenarioId: string) => void;
  reset: () => void;

  // Derived
  riskCurve: RiskCalculation[];
  selectedGaCalculation: RiskCalculation;
  stepByStepBreakdown: StepBreakdown[];
}

const MethodologyContext = createContext<MethodologyContextValue | null>(null);

export function MethodologyProvider({ children }: { children: ReactNode }) {
  const [ga, setGA] = useState<GestationalAgeDays>(w(39) as GestationalAgeDays);
  const [activeFactorIds, setActiveFactorIds] = useState<string[]>([]);
  const [applyInteractions, setApplyInteractions] = useState(false);

  const toggleFactor = useCallback((factorId: string) => {
    setActiveFactorIds((prev) =>
      prev.includes(factorId)
        ? prev.filter((id) => id !== factorId)
        : [...prev, factorId]
    );
  }, []);

  const loadScenario = useCallback((scenarioId: string) => {
    const scenario = methodologyScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setActiveFactorIds(scenario.activeFactorIds);
    setApplyInteractions(scenario.applyInteractions);
  }, []);

  const reset = useCallback(() => {
    setActiveFactorIds([]);
    setApplyInteractions(false);
    setGA(w(39) as GestationalAgeDays);
  }, []);

  const riskCurve = useMemo(
    () => calculateRiskCurve({ activeFactorIds, applyInteractions }),
    [activeFactorIds, applyInteractions]
  );

  const selectedGaCalculation = useMemo(
    () => calculateRisk({ ga, activeFactorIds, applyInteractions }),
    [ga, activeFactorIds, applyInteractions]
  );

  const stepByStepBreakdown = useMemo<StepBreakdown[]>(() => {
    const baseline = interpolateBaseline(ga);
    const steps: StepBreakdown[] = [];
    let cumulativeRisk = baseline;

    // Factor steps
    for (const factorId of activeFactorIds) {
      const factor = factorMap.get(factorId);
      if (!factor) continue;

      const riskBefore = cumulativeRisk;
      const riskAfter = riskBefore * factor.multiplier;
      cumulativeRisk = riskAfter;

      steps.push({
        factorId,
        label: factor.label,
        multiplier: factor.multiplier,
        riskBefore,
        riskAfter,
        color: getFactorColor(factorId).hex,
      });
    }

    // Interaction adjustment steps (only when applyInteractions is true)
    if (applyInteractions) {
      const { hypothesizedInteractions } = require("@/data/risk-models/hypothesized-interactions");
      const activeIdSet = new Set(activeFactorIds);
      for (const interaction of hypothesizedInteractions) {
        if (
          activeIdSet.has(interaction.factorIds[0]) &&
          activeIdSet.has(interaction.factorIds[1])
        ) {
          const riskBefore = cumulativeRisk;
          const riskAfter = riskBefore * interaction.interactionMultiplier;
          cumulativeRisk = riskAfter;

          const f0 = factorMap.get(interaction.factorIds[0]);
          const f1 = factorMap.get(interaction.factorIds[1]);
          steps.push({
            factorId: `interaction_${interaction.factorIds[0]}_${interaction.factorIds[1]}`,
            label: `${f0?.label ?? interaction.factorIds[0]} × ${f1?.label ?? interaction.factorIds[1]} interaction`,
            multiplier: interaction.interactionMultiplier,
            riskBefore,
            riskAfter,
            color: "#94a3b8", // slate for interactions
            isInteraction: true,
          });
        }
      }
    }

    return steps;
  }, [ga, activeFactorIds, applyInteractions]);

  const value = useMemo<MethodologyContextValue>(
    () => ({
      ga,
      activeFactorIds,
      applyInteractions,
      setGA,
      toggleFactor,
      setApplyInteractions,
      loadScenario,
      reset,
      riskCurve,
      selectedGaCalculation,
      stepByStepBreakdown,
    }),
    [
      ga,
      activeFactorIds,
      applyInteractions,
      toggleFactor,
      loadScenario,
      reset,
      riskCurve,
      selectedGaCalculation,
      stepByStepBreakdown,
    ]
  );

  return (
    <MethodologyContext.Provider value={value}>
      {children}
    </MethodologyContext.Provider>
  );
}

export function useMethodology(): MethodologyContextValue {
  const ctx = useContext(MethodologyContext);
  if (!ctx) {
    throw new Error("useMethodology must be used within MethodologyProvider");
  }
  return ctx;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run src/__tests__/components/methodology/methodology-provider.test.tsx`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/methodology/methodology-provider.tsx src/__tests__/components/methodology/methodology-provider.test.tsx
git commit -m "feat(methodology): add MethodologyContext with derived state and tests"
```

---

### Task 5: AnimatedNumber component (with tests)

**Files:**
- Create: `src/components/methodology/animated-number.tsx`
- Test: `src/__tests__/components/methodology/animated-number.test.tsx`

- [ ] **Step 1: Write failing test**

```typescript
// src/__tests__/components/methodology/animated-number.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedNumber } from "@/components/methodology/animated-number";

describe("AnimatedNumber", () => {
  it("renders the target value", () => {
    render(<AnimatedNumber value={1.58} decimals={2} />);
    // framer-motion spring will animate, but the final rendered value should be the target
    // In test environment without animation, it should render the value directly
    expect(screen.getByText("1.58")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AnimatedNumber value={42} decimals={0} className="text-red-500" />
    );
    const el = screen.getByText("42");
    expect(el).toHaveClass("text-red-500");
  });

  it("renders suffix when provided", () => {
    render(
      <AnimatedNumber value={0.87} decimals={2} suffix=" per 1,000" />
    );
    expect(screen.getByText(/0\.87/)).toBeInTheDocument();
    expect(screen.getByText(/per 1,000/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/__tests__/components/methodology/animated-number.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement AnimatedNumber**

```typescript
// src/components/methodology/animated-number.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSpring, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  /** Spring stiffness — higher = snappier. Default 200 */
  stiffness?: number;
  /** Spring damping — higher = less bounce. Default 25 */
  damping?: number;
}

export function AnimatedNumber({
  value,
  decimals = 2,
  className,
  suffix,
  stiffness = 200,
  damping = 25,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, { stiffness, damping });
  const display = useTransform(springValue, (v) => v.toFixed(decimals));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = suffix ? `${v}${suffix}` : v;
      }
    });
    return unsubscribe;
  }, [display, suffix]);

  // Initial render with the target value (for SSR/test environments)
  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run src/__tests__/components/methodology/animated-number.test.tsx`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/methodology/animated-number.tsx src/__tests__/components/methodology/animated-number.test.tsx
git commit -m "feat(methodology): add AnimatedNumber component with spring physics"
```

---

### Task 6: FormulaBlock and TeachingCallout components

**Files:**
- Create: `src/components/methodology/formula-block.tsx`
- Create: `src/components/methodology/teaching-callout.tsx`

- [ ] **Step 1: Create FormulaBlock**

```typescript
// src/components/methodology/formula-block.tsx
"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormulaBlockProps {
  /** Title shown at the top of the formula box */
  title: string;
  /** Border color (hex) for the left accent */
  accentColor?: string;
  children: ReactNode;
  /** Unique key for AnimatePresence transitions */
  layoutId?: string;
}

export function FormulaBlock({
  title,
  accentColor = "#64748b",
  children,
  layoutId,
}: FormulaBlockProps) {
  return (
    <motion.div
      layout={!!layoutId}
      layoutId={layoutId}
      className="rounded-md border bg-muted/30 overflow-hidden"
      style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
    >
      <div className="px-3 py-1.5 border-b bg-muted/50">
        <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="px-3 py-2 font-mono text-xs leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

interface FormulaLineProps {
  children: ReactNode;
  /** Delay before appearing (seconds) */
  delay?: number;
  /** Whether this line is highlighted */
  highlight?: boolean;
  highlightColor?: string;
}

export function FormulaLine({
  children,
  delay = 0,
  highlight = false,
  highlightColor,
}: FormulaLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay, duration: 0.2 }}
      className={`py-0.5 ${highlight ? "rounded px-1 -mx-1" : ""}`}
      style={
        highlight
          ? { backgroundColor: `${highlightColor ?? "#f59e0b"}15` }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

export { AnimatePresence };
```

- [ ] **Step 2: Create TeachingCallout**

```typescript
// src/components/methodology/teaching-callout.tsx
"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

interface TeachingCalloutProps {
  /** Always-visible summary text */
  summary: string | ReactNode;
  /** Expandable detail content (only for expandable callouts) */
  children?: ReactNode;
  /** Visual variant */
  variant?: "insight" | "warning" | "note";
  /** If true, the callout is always expanded (no toggle) */
  alwaysExpanded?: boolean;
}

const variantStyles = {
  insight: {
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    icon: "💡",
  },
  warning: {
    border: "border-amber-200 dark:border-amber-800",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    icon: "⚠️",
  },
  note: {
    border: "border-slate-200 dark:border-slate-800",
    bg: "bg-slate-50/50 dark:bg-slate-950/20",
    icon: "📝",
  },
};

export function TeachingCallout({
  summary,
  children,
  variant = "insight",
  alwaysExpanded = false,
}: TeachingCalloutProps) {
  const [open, setOpen] = useState(alwaysExpanded);
  const style = variantStyles[variant];
  const hasExpandable = !!children && !alwaysExpanded;

  return (
    <div className={`rounded-md border ${style.border} ${style.bg} p-3`}>
      <button
        onClick={hasExpandable ? () => setOpen(!open) : undefined}
        className={`flex items-start gap-2 w-full text-left text-xs leading-relaxed ${
          hasExpandable ? "cursor-pointer" : "cursor-default"
        }`}
        aria-expanded={hasExpandable ? open : undefined}
      >
        <span className="shrink-0 mt-0.5">{style.icon}</span>
        <span className="flex-1">{summary}</span>
        {hasExpandable && (
          <ChevronDownIcon
            className={`shrink-0 h-3.5 w-3.5 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      <AnimatePresence>
        {(open || alwaysExpanded) && children && (
          <motion.div
            initial={alwaysExpanded ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pl-6 text-xs text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 4: Commit**

```bash
git add src/components/methodology/formula-block.tsx src/components/methodology/teaching-callout.tsx
git commit -m "feat(methodology): add FormulaBlock and TeachingCallout shared components"
```

---

### Task 7: Add Methodology nav link to header

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Add nav link**

In `src/components/layout/header.tsx`, add a new `<Link>` after the "Compare" link inside the `<nav>` element (around line 40):

```tsx
<Link
  href="/methodology"
  className="text-muted-foreground transition-colors hover:text-foreground"
>
  Methodology
</Link>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat(methodology): add Methodology link to nav header"
```

---

## Chunk 2: Section Components — Toolbar, Navigation, and Sections 1-3

### Task 8: Factor toolbar

**Files:**
- Create: `src/components/methodology/factor-toolbar.tsx`

- [ ] **Step 1: Implement the sticky toolbar**

```typescript
// src/components/methodology/factor-toolbar.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { getFactorColor } from "@/data/methodology/factor-colors";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { w } from "@/data/helpers";
import type { GestationalAgeDays } from "@/data/types";
import { Switch } from "@/components/ui/switch";

export function FactorToolbar() {
  const {
    ga,
    setGA,
    activeFactorIds,
    toggleFactor,
    applyInteractions,
    setApplyInteractions,
    reset,
  } = useMethodology();

  return (
    <div className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 lg:px-6">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3">
        {/* GA selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">GA:</span>
          <button
            onClick={() => setGA(Math.max(w(37), ga - 7) as GestationalAgeDays)}
            className="rounded px-1.5 py-0.5 text-xs border hover:bg-accent/50"
            aria-label="Decrease GA by 1 week"
          >
            −
          </button>
          <span className="font-mono text-sm font-semibold min-w-[4ch] text-center">
            {gaToDisplay(ga)}
          </span>
          <button
            onClick={() => setGA(Math.min(w(42), ga + 7) as GestationalAgeDays)}
            className="rounded px-1.5 py-0.5 text-xs border hover:bg-accent/50"
            aria-label="Increase GA by 1 week"
          >
            +
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border" />

        {/* Factor pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {riskFactorMultipliers.map((factor) => {
            const isActive = activeFactorIds.includes(factor.id);
            const color = getFactorColor(factor.id);
            return (
              <button
                key={factor.id}
                onClick={() => toggleFactor(factor.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: color.hex,
                        borderColor: color.hex,
                      }
                    : undefined
                }
                aria-pressed={isActive}
              >
                {factor.label}
                <span className="ml-1 opacity-70">×{factor.multiplier}</span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border" />

        {/* Interactions toggle */}
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-muted-foreground" htmlFor="meth-interactions">
            Interactions
          </label>
          <Switch
            id="meth-interactions"
            checked={applyInteractions}
            onCheckedChange={setApplyInteractions}
          />
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="text-[10px] text-muted-foreground hover:text-foreground underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/factor-toolbar.tsx
git commit -m "feat(methodology): add sticky factor toolbar"
```

---

### Task 9: Section navigation (scroll spy)

**Files:**
- Create: `src/components/methodology/section-nav.tsx`

- [ ] **Step 1: Implement section nav with IntersectionObserver**

```typescript
// src/components/methodology/section-nav.tsx
"use client";

import { useState, useEffect } from "react";

export const SECTION_IDS = [
  "baseline",
  "multiplication",
  "ci-propagation",
  "confidence",
  "or-correction",
  "grade-mapping",
] as const;

const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
  baseline: "Baseline",
  multiplication: "Factors",
  "ci-propagation": "Uncertainty",
  confidence: "Confidence",
  "or-correction": "Correction",
  "grade-mapping": "Grades",
};

export function SectionNav() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of SECTION_IDS) {
      const el = document.getElementById(`section-${id}`);
      if (!el) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(id);
            }
          }
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      className="fixed left-2 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-2"
      aria-label="Section navigation"
    >
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => {
            document
              .getElementById(`section-${id}`)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`group flex items-center gap-2 transition-all ${
            active === id ? "scale-110" : ""
          }`}
          aria-label={`Go to ${SECTION_LABELS[id]}`}
          aria-current={active === id ? "true" : undefined}
        >
          <span
            className={`block rounded-full transition-all ${
              active === id
                ? "w-3 h-3 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
            }`}
          />
          <span
            className={`text-[10px] transition-opacity ${
              active === id
                ? "opacity-100 font-medium text-foreground"
                : "opacity-0 group-hover:opacity-100 text-muted-foreground"
            }`}
          >
            {i + 1}. {SECTION_LABELS[id]}
          </span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-nav.tsx
git commit -m "feat(methodology): add scroll-spy section navigation"
```

---

### Task 10: Section 1 — Muglu Baseline

**Files:**
- Create: `src/components/methodology/section-baseline.tsx`

- [ ] **Step 1: Implement Section 1**

This section contains:
- **Visual track:** Animated Recharts chart rendering the Muglu baseline curve with data points, CI band, and risk zone shading
- **Math track:** Formula display, data table with highlighted current GA row, and teaching callout about the fetuses-at-risk denominator

```typescript
// src/components/methodology/section-baseline.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { chartColors } from "@/components/charts/chart-theme";

export function SectionBaseline() {
  const { ga, selectedGaCalculation } = useMethodology();

  const data = baselineStillbirthCurve.map((p) => ({
    ga: gaToDisplay(p.ga),
    risk: p.riskPer1000,
    ciLow: p.ci95Low,
    ciHigh: p.ci95High,
  }));

  const currentGADisplay = gaToDisplay(ga);

  return (
    <section id="section-baseline" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        1. The Foundation — Muglu Baseline Curve
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        Everything starts with the highest-quality baseline stillbirth risk data
        available.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-lg border bg-card p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <ReferenceArea x1="37w0d" x2="39w0d" fill={chartColors.safe} fillOpacity={1} />
                  <ReferenceArea x1="39w0d" x2="41w0d" fill={chartColors.caution} fillOpacity={1} />
                  <ReferenceArea x1="41w0d" x2="42w0d" fill={chartColors.danger} fillOpacity={1} />

                  <ReferenceLine
                    x={currentGADisplay}
                    stroke={chartColors.text}
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />

                  <XAxis
                    dataKey="ga"
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                    domain={[0, 5]}
                    label={{
                      value: "per 1,000",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fill: chartColors.text,
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      if (!d) return null;
                      return (
                        <div className="rounded border bg-background p-2 shadow text-xs">
                          <p className="font-medium">{d.ga}</p>
                          <p>Risk: {d.risk.toFixed(2)} per 1,000</p>
                          <p className="text-muted-foreground">
                            CI: {d.ciLow.toFixed(2)}–{d.ciHigh.toFixed(2)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ciHigh"
                    stroke="none"
                    fill={chartColors.ci}
                    fillOpacity={0.5}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke={chartColors.baseline}
                    strokeWidth={2.5}
                    dot={{ fill: chartColors.baseline, r: 4 }}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Muglu et al. 2019, PLOS Medicine — n = 15,458,874 pregnancies
            </p>
          </div>
        </motion.div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          <FormulaBlock title="Prospective Stillbirth Risk">
            <div className="whitespace-pre">
              {"          stillbirths at week X\n"}
              {"Risk = ─────────────────────────────\n"}
              {"       ongoing pregnancies at week X"}
            </div>
          </FormulaBlock>

          {/* Data table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-1.5 text-left font-medium">GA</th>
                  <th className="px-3 py-1.5 text-right font-medium">
                    Risk / 1,000
                  </th>
                  <th className="px-3 py-1.5 text-right font-medium">95% CI</th>
                </tr>
              </thead>
              <tbody>
                {baselineStillbirthCurve.map((point) => {
                  const display = gaToDisplay(point.ga);
                  const isCurrentWeek = display === currentGADisplay;
                  return (
                    <tr
                      key={point.ga}
                      className={`border-t transition-colors ${
                        isCurrentWeek
                          ? "bg-primary/10 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-1.5">{display}</td>
                      <td className="px-3 py-1.5 text-right font-mono">
                        {point.riskPer1000.toFixed(2)}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                        {point.ci95Low.toFixed(2)}–{point.ci95High.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Current GA callout */}
          <div className="rounded-md border bg-primary/5 p-3 text-sm">
            <span className="text-muted-foreground">At {currentGADisplay}:</span>{" "}
            <AnimatedNumber
              value={selectedGaCalculation.baselineRiskPer1000}
              decimals={2}
              className="font-mono font-bold"
              suffix=" per 1,000"
            />
          </div>

          <TeachingCallout
            summary="The critical methodological insight: the denominator is ongoing pregnancies, not deliveries that week."
            variant="insight"
          >
            <p className="mb-2">
              Prior to Smith (2001), many studies divided stillbirths by deliveries
              at that gestational age. This paradoxically made post-term risk appear
              to <em>decrease</em> because the denominator of deliveries shrinks as
              fewer women remain undelivered.
            </p>
            <p>
              The &ldquo;fetuses-at-risk&rdquo; approach (Smith 2001, AJOG) uses
              ongoing pregnancies as the denominator, correctly showing that
              stillbirth risk rises monotonically and steeply after 40 weeks. Muglu
              et al. pooled 13 cohort studies using this methodology via
              random-effects meta-analysis (DerSimonian-Laird).
            </p>
          </TeachingCallout>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/section-baseline.tsx
git commit -m "feat(methodology): add Section 1 — Muglu baseline with animated chart and math"
```

---

### Task 11: Section 2 — Factor Multiplication

**Files:**
- Create: `src/components/methodology/section-multiplication.tsx`

- [ ] **Step 1: Implement Section 2**

This is the most complex section: layered risk curve with per-factor animations, cascading math display.

```typescript
// src/components/methodology/section-multiplication.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock, FormulaLine, AnimatePresence } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { getFactorColor } from "@/data/methodology/factor-colors";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { chartColors } from "@/components/charts/chart-theme";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function SectionMultiplication() {
  const {
    ga,
    activeFactorIds,
    riskCurve,
    selectedGaCalculation,
    stepByStepBreakdown,
  } = useMethodology();

  const hasFactors = activeFactorIds.length > 0;

  // Build chart data: baseline + adjusted
  const chartData = baselineStillbirthCurve.map((p, i) => ({
    ga: gaToDisplay(p.ga),
    baseline: p.riskPer1000,
    adjusted: riskCurve[i]?.adjustedRiskPer1000 ?? p.riskPer1000,
  }));

  const maxY = Math.max(...chartData.map((d) => Math.max(d.baseline, d.adjusted)));
  const yMax = Math.ceil(maxY * 1.3 * 10) / 10;

  return (
    <section id="section-multiplication" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        2. Multiplying Risk — The Factor Model
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        Each risk factor multiplies the baseline by its published adjusted odds
        ratio. Toggle factors in the toolbar above to watch the curve lift.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK */}
        <div className="rounded-lg border bg-card p-4">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <ReferenceArea x1="37w0d" x2="39w0d" fill={chartColors.safe} fillOpacity={1} />
                <ReferenceArea x1="39w0d" x2="41w0d" fill={chartColors.caution} fillOpacity={1} />
                <ReferenceArea x1="41w0d" x2="42w0d" fill={chartColors.danger} fillOpacity={1} />

                <XAxis dataKey="ga" tick={{ fill: chartColors.text, fontSize: 11 }} />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  domain={[0, yMax]}
                  label={{
                    value: "per 1,000",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: chartColors.text,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    if (!d) return null;
                    return (
                      <div className="rounded border bg-background p-2 shadow text-xs space-y-0.5">
                        <p className="font-medium">{d.ga}</p>
                        <p>Baseline: {d.baseline.toFixed(2)}</p>
                        {hasFactors && (
                          <p className="text-[var(--risk-high)] font-medium">
                            Adjusted: {d.adjusted.toFixed(2)}
                          </p>
                        )}
                        {hasFactors && (
                          <p className="text-muted-foreground">
                            ×{(d.adjusted / d.baseline).toFixed(2)} multiplier
                          </p>
                        )}
                      </div>
                    );
                  }}
                />

                {/* Baseline (dashed when factors active) */}
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke={chartColors.baseline}
                  strokeWidth={hasFactors ? 1.5 : 2.5}
                  strokeDasharray={hasFactors ? "6 3" : undefined}
                  dot={{ fill: chartColors.baseline, r: hasFactors ? 2 : 4 }}
                  isAnimationActive={true}
                  animationDuration={600}
                />

                {/* Adjusted (only when factors active) */}
                {hasFactors && (
                  <Line
                    type="monotone"
                    dataKey="adjusted"
                    stroke={chartColors.adjusted}
                    strokeWidth={2.5}
                    dot={{ fill: chartColors.adjusted, r: 4, strokeWidth: 2, stroke: "#fff" }}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Factor legend */}
          {hasFactors && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mt-3"
            >
              {stepByStepBreakdown.map((step) => (
                <span
                  key={step.factorId}
                  className="flex items-center gap-1 text-[10px]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                  {step.label} (×{step.multiplier})
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          <FormulaBlock title="Step-by-Step Multiplication">
            <div className="space-y-1">
              {/* Baseline line (always shown) */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Baseline at {gaToDisplay(ga)}:
                </span>
                <AnimatedNumber
                  value={selectedGaCalculation.baselineRiskPer1000}
                  decimals={2}
                  className="font-semibold"
                  suffix=" per 1,000"
                />
              </div>

              {/* Factor lines (animate in/out) */}
              <AnimatePresence mode="popLayout">
                {stepByStepBreakdown.map((step, i) => {
                  const color = getFactorColor(step.factorId);
                  return (
                    <FormulaLine
                      key={step.factorId}
                      delay={i * 0.1}
                      highlight
                      highlightColor={color.hex}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          <span style={{ color: color.hex }}>
                            × {step.label}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            (aOR {step.multiplier})
                          </span>
                        </span>
                        <span className="font-mono">
                          <AnimatedNumber
                            value={step.riskBefore}
                            decimals={2}
                            className="text-muted-foreground"
                          />
                          <span className="text-muted-foreground"> → </span>
                          <AnimatedNumber
                            value={step.riskAfter}
                            decimals={2}
                            className="font-semibold"
                          />
                        </span>
                      </div>
                    </FormulaLine>
                  );
                })}
              </AnimatePresence>

              {/* Result separator */}
              {hasFactors && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t pt-1 mt-1"
                >
                  <div className="flex justify-between font-semibold">
                    <span>Adjusted risk:</span>
                    <AnimatedNumber
                      value={selectedGaCalculation.adjustedRiskPer1000}
                      decimals={2}
                      className="text-[var(--risk-high)]"
                      suffix=" per 1,000"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </FormulaBlock>

          <TeachingCallout
            summary="When logistic regression models show independently significant adjusted odds ratios without significant interaction terms, the log-odds are additive — meaning odds ratios are multiplicative."
            variant="insight"
            alwaysExpanded
          >
            <p>
              This is the same approach used in the Framingham cardiovascular risk
              calculator and the FMF preeclampsia screener. For the rare-disease
              assumption (stillbirth &lt;1%), OR approximates RR, making
              multiplication of published ORs a defensible approach.
            </p>
          </TeachingCallout>

          {!hasFactors && (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              Toggle risk factors in the toolbar above to see the multiplication
              cascade
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/section-multiplication.tsx
git commit -m "feat(methodology): add Section 2 — factor multiplication with layered curve"
```

---

### Task 12: Section 3 — CI Propagation

**Files:**
- Create: `src/components/methodology/section-ci-propagation.tsx`

- [ ] **Step 1: Implement Section 3**

```typescript
// src/components/methodology/section-ci-propagation.tsx
"use client";

import { useMemo } from "react";
import { useMethodology } from "./methodology-provider";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock, FormulaLine, AnimatePresence } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { getFactorColor } from "@/data/methodology/factor-colors";
import { motion } from "framer-motion";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

interface VarianceEntry {
  factorId: string;
  label: string;
  color: string;
  variance: number;
  proportion: number; // of total
}

export function SectionCIPropagation() {
  const { activeFactorIds, selectedGaCalculation } = useMethodology();
  const hasFactors = activeFactorIds.length > 0;

  // Compute per-factor variance contributions
  const varianceBreakdown = useMemo<VarianceEntry[]>(() => {
    const entries: VarianceEntry[] = [];
    let totalVar = 0;

    // Baseline variance
    const baseCI = selectedGaCalculation.adjustedRiskCI95;
    // We'll compute per-factor variance from CI
    for (const factorId of activeFactorIds) {
      const factor = factorMap.get(factorId);
      if (!factor?.ci95 || factor.ci95[0] <= 0 || factor.ci95[1] <= 0) continue;

      const v = Math.pow(
        (Math.log(factor.ci95[1]) - Math.log(factor.ci95[0])) / (2 * 1.96),
        2
      );
      totalVar += v;
      entries.push({
        factorId,
        label: factor.label,
        color: getFactorColor(factorId).hex,
        variance: v,
        proportion: 0, // computed below
      });
    }

    // Compute proportions
    for (const entry of entries) {
      entry.proportion = totalVar > 0 ? entry.variance / totalVar : 0;
    }

    return entries;
  }, [activeFactorIds, selectedGaCalculation]);

  const totalVariance = varianceBreakdown.reduce((s, e) => s + e.variance, 0);
  const combinedSE = Math.sqrt(totalVariance);

  return (
    <section id="section-ci-propagation" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        3. Quantifying Uncertainty — CI Propagation
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        Each factor adds uncertainty. We propagate confidence intervals using
        log-scale quadrature — the same method used in metrology and particle
        physics.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK — CI width gauge */}
        <div className="rounded-lg border bg-card p-4 space-y-6">
          {/* CI Band visualization */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              95% Confidence Interval Width
            </p>
            <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
              {/* Center line = point estimate */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground/30" />

              {/* CI band */}
              <motion.div
                className="absolute top-1 bottom-1 rounded bg-[var(--risk-high)]/20 border border-[var(--risk-high)]/30"
                animate={{
                  left: `${50 - Math.min(40, totalVariance * 800)}%`,
                  right: `${50 - Math.min(40, totalVariance * 800)}%`,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />

              {/* Point estimate marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--risk-high)]" />
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{selectedGaCalculation.adjustedRiskCI95[0].toFixed(2)}</span>
              <AnimatedNumber
                value={selectedGaCalculation.adjustedRiskPer1000}
                decimals={2}
                className="font-semibold text-foreground"
              />
              <span>{selectedGaCalculation.adjustedRiskCI95[1].toFixed(2)}</span>
            </div>
          </div>

          {/* Per-factor variance bars */}
          {hasFactors && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Uncertainty contribution by factor
              </p>
              {varianceBreakdown.map((entry) => (
                <div key={entry.factorId} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span style={{ color: entry.color }}>{entry.label}</span>
                    <span className="font-mono text-muted-foreground">
                      {(entry.proportion * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: entry.color }}
                      animate={{ width: `${entry.proportion * 100}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          <FormulaBlock title="Log-Scale Quadrature (GUM Standard)">
            <div className="whitespace-pre text-[10px] leading-relaxed mb-3">
              {"For each factor i with RR_i and 95% CI [L_i, U_i]:\n\n"}
              {"  Var(ln(RR_i)) = [(ln(U_i) − ln(L_i)) / (2 × 1.96)]²"}
            </div>

            <AnimatePresence mode="popLayout">
              {varianceBreakdown.map((entry, i) => {
                const factor = factorMap.get(entry.factorId);
                return (
                  <FormulaLine
                    key={entry.factorId}
                    delay={i * 0.1}
                    highlight
                    highlightColor={entry.color}
                  >
                    <div className="flex justify-between text-[10px]">
                      <span style={{ color: entry.color }}>{entry.label}:</span>
                      <span className="font-mono">
                        Var = {entry.variance.toFixed(5)}
                      </span>
                    </div>
                    {factor?.ci95 && (
                      <div className="text-[9px] text-muted-foreground ml-2">
                        CI [{factor.ci95[0]}, {factor.ci95[1]}]
                      </div>
                    )}
                  </FormulaLine>
                );
              })}
            </AnimatePresence>

            {hasFactors && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t mt-2 pt-2 space-y-1 text-[10px]"
              >
                <div className="flex justify-between">
                  <span>Combined Var:</span>
                  <span className="font-mono">
                    <AnimatedNumber value={totalVariance} decimals={5} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Combined SE:</span>
                  <span className="font-mono">
                    <AnimatedNumber value={combinedSE} decimals={4} />
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>95% CI:</span>
                  <span className="font-mono">
                    [{selectedGaCalculation.adjustedRiskCI95[0].toFixed(2)},{" "}
                    {selectedGaCalculation.adjustedRiskCI95[1].toFixed(2)}] per
                    1,000
                  </span>
                </div>
              </motion.div>
            )}
          </FormulaBlock>

          <TeachingCallout
            summary="This is the same uncertainty propagation formula used in metrology (GUM standard, JCGM 100:2008) and particle physics."
            variant="insight"
            alwaysExpanded
          >
            <p>
              When multiplying independent measurements, relative uncertainties add
              in quadrature — the square root of the sum of squares. On the log
              scale, multiplication becomes addition, so{" "}
              <code className="text-[10px]">Var(ln(product)) = Σ Var(ln(RR_i))</code>.
              This assumes independence between factors. Correlated factors would
              require covariance terms, which are generally unavailable from
              published studies.
            </p>
          </TeachingCallout>

          {!hasFactors && (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              Toggle risk factors to see uncertainty propagation
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/section-ci-propagation.tsx
git commit -m "feat(methodology): add Section 3 — CI propagation with variance breakdown"
```

---

## Chunk 3: Sections 4-6 and Page Assembly

### Task 13: Confidence gauges component

**Files:**
- Create: `src/components/methodology/confidence-gauges.tsx`

- [ ] **Step 1: Implement the 5 vertical gauges**

```typescript
// src/components/methodology/confidence-gauges.tsx
"use client";

import { motion } from "framer-motion";
import type { ConfidenceScore } from "@/data/types";

const gaugeConfig = [
  { key: "evidenceQuality" as const, abbr: "EQ", label: "Evidence Quality", color: "#3b82f6" },
  { key: "modelValidity" as const, abbr: "MV", label: "Model Validity", color: "#8b5cf6" },
  { key: "interactionPenalty" as const, abbr: "IP", label: "Interaction Penalty", color: "#f59e0b" },
  { key: "magnitudePlausibility" as const, abbr: "MP", label: "Magnitude Plausibility", color: "#14b8a6" },
  { key: "rareDiseaseValidity" as const, abbr: "RP", label: "Rare-Disease Validity", color: "#f43f5e" },
];

const gradeColors: Record<string, string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

interface Props {
  confidence: ConfidenceScore;
}

export function ConfidenceGauges({ confidence }: Props) {
  return (
    <div className="space-y-4">
      {/* Five gauges */}
      <div className="flex items-end justify-center gap-4">
        {gaugeConfig.map(({ key, abbr, color }) => {
          const value = confidence.breakdown[key];
          const pct = Math.round(value * 100);
          const isLow = value < 0.8;
          const isVeryLow = value < 0.6;

          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-medium text-muted-foreground">
                {abbr}
              </span>
              {/* Gauge bar */}
              <div className="relative w-8 h-24 bg-muted rounded overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded"
                  style={{ backgroundColor: color }}
                  animate={{
                    height: `${pct}%`,
                    opacity: isVeryLow ? 0.6 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
                {/* Warning pulse for low values */}
                {isLow && (
                  <motion.div
                    className="absolute inset-0 rounded"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: 2, duration: 0.3 }}
                    style={{ backgroundColor: "#ef4444" }}
                  />
                )}
              </div>
              <span className="text-[10px] font-mono">{value.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Multiplication chain */}
      <div className="flex items-center justify-center gap-1 text-xs font-mono flex-wrap">
        {gaugeConfig.map(({ key, color }, i) => (
          <span key={key} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground">×</span>}
            <span
              className="rounded px-1.5 py-0.5"
              style={{
                color,
                backgroundColor: `${color}15`,
              }}
            >
              {confidence.breakdown[key].toFixed(2)}
            </span>
          </span>
        ))}
        <span className="text-muted-foreground ml-1">= </span>
        <motion.span
          className="rounded-full px-2 py-0.5 text-white font-semibold"
          style={{
            backgroundColor: gradeColors[confidence.grade] ?? "#64748b",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          key={confidence.score}
        >
          {confidence.score} → Grade {confidence.grade}
        </motion.span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/confidence-gauges.tsx
git commit -m "feat(methodology): add 5-gauge confidence visualization"
```

---

### Task 14: Section 4 — Confidence Scorer

**Files:**
- Create: `src/components/methodology/section-confidence.tsx`

- [ ] **Step 1: Implement Section 4**

```typescript
// src/components/methodology/section-confidence.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { ConfidenceGauges } from "./confidence-gauges";
import { FormulaBlock } from "./formula-block";
import { AnimatedNumber } from "./animated-number";
import { TeachingCallout } from "./teaching-callout";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { motion } from "framer-motion";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

export function SectionConfidence() {
  const { activeFactorIds, selectedGaCalculation } = useMethodology();
  const { confidenceScore } = selectedGaCalculation;
  const n = activeFactorIds.length;

  // Compute EQ inputs for display
  const R_BASELINE = 0.95;
  const reliabilities = activeFactorIds
    .map((id) => factorMap.get(id))
    .filter((f) => f !== undefined)
    .map((f) => ({ label: f.label, r: f.dataReliability }));

  const sumR = reliabilities.reduce((s, f) => s + f.r, 0);
  const eq = (R_BASELINE + sumR) / (1 + n);

  return (
    <section id="section-confidence" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        4. The Confidence Scorer — 5 Lenses of Trust
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        Beyond the point estimate, how much should you trust this number? Five
        independent components assess different sources of uncertainty.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK */}
        <div className="rounded-lg border bg-card p-4">
          <ConfidenceGauges confidence={confidenceScore} />
        </div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          <FormulaBlock title="Score = 100 × EQ × MV × IP × MP × RP" accentColor="#6366f1">
            <div className="text-[10px] leading-relaxed">
              <span className="font-semibold">= 100 × </span>
              <AnimatedNumber value={confidenceScore.breakdown.evidenceQuality} decimals={3} className="text-blue-500" />
              <span> × </span>
              <AnimatedNumber value={confidenceScore.breakdown.modelValidity} decimals={3} className="text-violet-500" />
              <span> × </span>
              <AnimatedNumber value={confidenceScore.breakdown.interactionPenalty} decimals={3} className="text-amber-500" />
              <span> × </span>
              <AnimatedNumber value={confidenceScore.breakdown.magnitudePlausibility} decimals={3} className="text-teal-500" />
              <span> × </span>
              <AnimatedNumber value={confidenceScore.breakdown.rareDiseaseValidity} decimals={3} className="text-rose-500" />
              <span className="font-semibold"> = </span>
              <AnimatedNumber value={confidenceScore.score} decimals={0} className="font-bold" />
            </div>
          </FormulaBlock>

          {/* EQ detail */}
          <FormulaBlock title="EQ — Evidence Quality" accentColor="#3b82f6">
            <div className="text-[10px] space-y-0.5">
              <div>EQ = (R_baseline + Σ R_i) / (1 + n)</div>
              <div className="text-muted-foreground">
                R_baseline = 0.95 (Muglu, n=15M)
              </div>
              {reliabilities.map((r) => (
                <div key={r.label} className="text-muted-foreground">
                  R_{r.label} = {r.r.toFixed(2)}
                </div>
              ))}
              <div className="font-semibold mt-1">
                EQ = ({R_BASELINE} + {sumR.toFixed(2)}) / {1 + n} ={" "}
                <AnimatedNumber value={eq} decimals={3} />
              </div>
            </div>
          </FormulaBlock>

          {/* MV detail */}
          <FormulaBlock title="MV — Model Validity" accentColor="#8b5cf6">
            <div className="text-[10px] space-y-0.5">
              <div>MV = max(0.40, 1.0 − 0.03n − 0.005n²)</div>
              <div>
                = max(0.40, 1.0 − {(0.03 * n).toFixed(2)} − {(0.005 * n * n).toFixed(3)})
              </div>
              <div className="font-semibold">
                = <AnimatedNumber value={confidenceScore.breakdown.modelValidity} decimals={3} />
              </div>
              <div className="text-muted-foreground mt-1">
                n = {n} factor{n !== 1 ? "s" : ""}{" "}
                {n <= 2
                  ? "→ independence plausible"
                  : n <= 4
                    ? "→ independence assumption weakening"
                    : "→ significant extrapolation"}
              </div>
            </div>
          </FormulaBlock>

          <TeachingCallout
            summary="No existing clinical risk calculator provides individual-level confidence scoring. This is a novel feature."
            variant="insight"
          >
            <p>
              Framingham, QRISK3, the Pooled Cohort Equations, and the FMF
              preeclampsia screener all deliver point estimates only. The
              5-component formula was calibrated against 10 realistic clinical
              scenarios to ensure grades align with clinical intuition about when
              to trust a composite estimate.
            </p>
          </TeachingCallout>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-confidence.tsx
git commit -m "feat(methodology): add Section 4 — confidence scorer with 5 gauges"
```

---

### Task 15: Section 5 — OR→RR Correction

**Files:**
- Create: `src/components/methodology/section-or-correction.tsx`

- [ ] **Step 1: Implement Section 5**

```typescript
// src/components/methodology/section-or-correction.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { motion } from "framer-motion";
import { CheckCircleIcon, AlertTriangleIcon } from "lucide-react";

export function SectionORCorrection() {
  const { activeFactorIds, selectedGaCalculation } = useMethodology();
  const hasFactors = activeFactorIds.length > 0;

  const adjustedRisk = selectedGaCalculation.adjustedRiskPer1000;
  const adjustedProportion = adjustedRisk / 1000;
  const correctedRisk = selectedGaCalculation.orCorrectedRiskPer1000;
  const isTriggered = correctedRisk !== undefined;

  const combinedMultiplier = adjustedRisk / selectedGaCalculation.baselineRiskPer1000;
  const baselineProportion = selectedGaCalculation.baselineRiskPer1000 / 1000;

  // Divergence calculation
  const divergencePct = isTriggered && correctedRisk > 0
    ? (((adjustedRisk - correctedRisk) / correctedRisk) * 100)
    : 0;

  return (
    <section id="section-or-correction" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        5. The Safety Net — OR → RR Correction
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        When combined risk gets high enough, the odds ratio no longer
        approximates the relative risk. Zhang & Yu (1998) provide a correction.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK */}
        <div className="rounded-lg border bg-card p-4">
          {!isTriggered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 gap-3"
            >
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Rare-disease assumption holds
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Combined adjusted risk is{" "}
                <span className="font-mono">
                  {(adjustedProportion * 100).toFixed(2)}%
                </span>
                , well below the 1% threshold where OR and RR diverge
                meaningfully.
              </p>

              {/* Threshold bar */}
              <div className="w-full max-w-xs mt-2">
                <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                  <span>0%</span>
                  <span>1% threshold</span>
                  <span>5%</span>
                </div>
                <div className="h-2 bg-muted rounded-full relative">
                  <div className="absolute left-[20%] top-0 bottom-0 w-px bg-amber-400" />
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-green-500 rounded-full"
                    animate={{ width: `${Math.min(100, adjustedProportion * 100 * 20)}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 py-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  OR overestimates RR by{" "}
                  <AnimatedNumber value={divergencePct} decimals={1} suffix="%" className="font-bold" />
                </p>
              </div>

              {/* Comparison bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground">OR-based (raw)</span>
                    <AnimatedNumber value={adjustedRisk} decimals={2} className="font-mono" suffix=" /1,000" />
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--risk-high)]/60 rounded-full"
                      animate={{ width: `${Math.min(100, adjustedRisk * 5)}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-medium">Corrected RR</span>
                    <AnimatedNumber value={correctedRisk} decimals={2} className="font-mono font-semibold" suffix=" /1,000" />
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--risk-high)] rounded-full"
                      animate={{ width: `${Math.min(100, correctedRisk * 5)}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          <FormulaBlock title="Zhang & Yu (1998) Correction" accentColor="#f43f5e">
            <div className="text-[10px] space-y-1">
              <div className="whitespace-pre">
                {"RR = OR / [(1 − P₀) + (P₀ × OR)]\n\n"}
                {"Where P₀ = baseline risk (proportion)"}
              </div>

              {hasFactors && (
                <div className="border-t mt-2 pt-2 space-y-0.5">
                  <div>P₀ = {baselineProportion.toFixed(5)}</div>
                  <div>Combined OR = {combinedMultiplier.toFixed(2)}</div>
                  <div>
                    Denominator = (1 − {baselineProportion.toFixed(5)}) + (
                    {baselineProportion.toFixed(5)} × {combinedMultiplier.toFixed(2)})
                  </div>
                  <div>
                    ={" "}
                    {(
                      1 - baselineProportion + baselineProportion * combinedMultiplier
                    ).toFixed(5)}
                  </div>
                  {isTriggered && (
                    <div className="font-semibold mt-1">
                      Corrected risk:{" "}
                      <AnimatedNumber value={correctedRisk} decimals={2} suffix=" per 1,000" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormulaBlock>

          {/* Threshold table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-[10px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-2 py-1 text-left">Combined risk</th>
                  <th className="px-2 py-1 text-right">Divergence</th>
                  <th className="px-2 py-1 text-right">Impact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "<1%", div: "<0.5%", impact: "Negligible", threshold: 0.01 },
                  { range: "1–5%", div: "0.5–3%", impact: "Minor", threshold: 0.05 },
                  { range: "5–10%", div: "3–8%", impact: "Moderate", threshold: 0.10 },
                  { range: "10–20%", div: "8–20%", impact: "Significant", threshold: 0.20 },
                  { range: ">20%", div: ">20%", impact: "Substantial", threshold: 1.0 },
                ].map((row) => {
                  const isActive = adjustedProportion < row.threshold &&
                    (row.threshold === 0.01 || adjustedProportion >= (row.threshold === 0.05 ? 0.01 : row.threshold === 0.10 ? 0.05 : row.threshold === 0.20 ? 0.10 : 0.20));
                  return (
                    <tr
                      key={row.range}
                      className={`border-t ${isActive ? "bg-primary/10 font-medium" : ""}`}
                    >
                      <td className="px-2 py-1">{row.range}</td>
                      <td className="px-2 py-1 text-right font-mono">{row.div}</td>
                      <td className="px-2 py-1 text-right">{row.impact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TeachingCallout
            summary="The correction matters most when many factors stack at later gestational ages."
            variant="warning"
          >
            <p>
              A combined OR of 50 at 42 weeks (P₀=0.318%) gives a raw risk of
              15.9/1,000. The corrected RR gives 15.5/1,000 — a 2.5% overestimation.
              At extreme values (OR&gt;100), the divergence can exceed 10%.
            </p>
          </TeachingCallout>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-or-correction.tsx
git commit -m "feat(methodology): add Section 5 — OR→RR correction with divergence meter"
```

---

### Task 16: Scenario strip and Section 6 — Grade Mapping

**Files:**
- Create: `src/components/methodology/scenario-strip.tsx`
- Create: `src/components/methodology/section-grade-mapping.tsx`

- [ ] **Step 1: Create ScenarioStrip**

```typescript
// src/components/methodology/scenario-strip.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { methodologyScenarios } from "@/data/methodology/scenarios";
import { motion } from "framer-motion";

export function ScenarioStrip() {
  const { loadScenario, activeFactorIds, applyInteractions } = useMethodology();

  return (
    <div className="flex flex-wrap gap-2">
      {methodologyScenarios.map((scenario) => {
        const isActive =
          JSON.stringify(scenario.activeFactorIds) === JSON.stringify(activeFactorIds) &&
          scenario.applyInteractions === applyInteractions;

        return (
          <motion.button
            key={scenario.id}
            onClick={() => loadScenario(scenario.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
              isActive
                ? "border-primary bg-primary/10"
                : "hover:bg-accent/50"
            }`}
          >
            <div className="font-medium">{scenario.label}</div>
            <div className="text-muted-foreground text-[10px]">
              {scenario.description}
            </div>
            <div className="text-[10px] mt-0.5 font-mono text-muted-foreground">
              → Grade {scenario.expectedGrade} (~{scenario.expectedScoreApprox})
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create SectionGradeMapping**

```typescript
// src/components/methodology/section-grade-mapping.tsx
"use client";

import { useMethodology } from "./methodology-provider";
import { ScenarioStrip } from "./scenario-strip";
import { TeachingCallout } from "./teaching-callout";
import { motion } from "framer-motion";

const grades = [
  { grade: "A", min: 85, color: "#22c55e", label: "High confidence" },
  { grade: "B", min: 70, color: "#3b82f6", label: "Moderate confidence" },
  { grade: "C", min: 55, color: "#f59e0b", label: "Limited confidence" },
  { grade: "D", min: 40, color: "#f97316", label: "Low confidence" },
  { grade: "F", min: 0, color: "#ef4444", label: "Very low confidence" },
];

const gradeDescriptions: Record<string, string> = {
  A: "Based primarily on large meta-analytic data with minimal extrapolation",
  B: "Supported by moderate-quality evidence with reasonable assumptions",
  C: "Estimated from multiple evidence sources with significant assumptions",
  D: "Rough estimate; interpret with clinical judgment",
  F: "Highly uncertain; clinical judgment should predominate",
};

export function SectionGradeMapping() {
  const { selectedGaCalculation } = useMethodology();
  const { confidenceScore } = selectedGaCalculation;
  const score = confidenceScore.score;

  // Position on the grade bar (0-100%)
  const position = score;

  return (
    <section id="section-grade-mapping" className="scroll-mt-32 py-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl font-semibold mb-1"
      >
        6. Grade Mapping — What the Letters Mean
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-6">
        The numeric score maps to a letter grade with a specific clinical meaning.
        Try different scenarios to see how the grade changes.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* VISUAL TRACK */}
        <div className="rounded-lg border bg-card p-4 space-y-6">
          {/* Grade bar */}
          <div className="relative">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {grades.map((g, i) => {
                const width =
                  i === grades.length - 1
                    ? g.min
                    : (i === 0 ? 100 - g.min : grades[i - 1].min - g.min);
                return (
                  <div
                    key={g.grade}
                    className="flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: g.color,
                      width: `${i === 0 ? 15 : i === 1 ? 15 : i === 2 ? 15 : i === 3 ? 15 : 40}%`,
                    }}
                  >
                    {g.grade}
                  </div>
                );
              })}
            </div>

            {/* Pointer */}
            <motion.div
              className="absolute -bottom-4 flex flex-col items-center"
              animate={{ left: `${position}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ transform: "translateX(-50%)" }}
            >
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground" />
              <span className="text-[10px] font-bold mt-0.5">
                {score}
              </span>
            </motion.div>
          </div>

          {/* Grade labels */}
          <div className="flex justify-between text-[9px] text-muted-foreground mt-6 pt-2">
            <span>F (&lt;40)</span>
            <span>D (40-54)</span>
            <span>C (55-69)</span>
            <span>B (70-84)</span>
            <span>A (≥85)</span>
          </div>

          {/* Scenario strip */}
          <div>
            <p className="text-xs font-medium mb-2">Try a scenario:</p>
            <ScenarioStrip />
          </div>
        </div>

        {/* MATH TRACK */}
        <div className="space-y-4">
          {/* Grade definitions table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-1.5 text-left">Grade</th>
                  <th className="px-3 py-1.5 text-left">Score</th>
                  <th className="px-3 py-1.5 text-left">Clinical Meaning</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => {
                  const isActive = confidenceScore.grade === g.grade;
                  return (
                    <tr
                      key={g.grade}
                      className={`border-t transition-colors ${
                        isActive ? "bg-primary/10 font-semibold" : ""
                      }`}
                    >
                      <td className="px-3 py-1.5">
                        <span
                          className="inline-block rounded px-1.5 py-0.5 text-white text-[10px] font-bold"
                          style={{ backgroundColor: g.color }}
                        >
                          {g.grade}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 font-mono">
                        {g.grade === "A"
                          ? "≥ 85"
                          : g.grade === "F"
                            ? "< 40"
                            : `${g.min}–${grades[grades.indexOf(g) - 1].min - 1}`}
                      </td>
                      <td className="px-3 py-1.5 text-muted-foreground">
                        {gradeDescriptions[g.grade]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TeachingCallout
            summary="These thresholds were calibrated against 10 realistic clinical scenarios to ensure grades match clinical intuition."
            variant="note"
          >
            <p>
              Scenarios ranged from &ldquo;baseline only&rdquo; (Grade A, score 95) to
              &ldquo;7 stacked factors with hypothesized interactions&rdquo; (Grade F,
              score 28). The polynomial decay in the Model Validity component and
              the stepwise magnitude plausibility thresholds were tuned to produce
              grades that a panel of clinicians would intuitively agree with.
            </p>
          </TeachingCallout>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/scenario-strip.tsx src/components/methodology/section-grade-mapping.tsx
git commit -m "feat(methodology): add Section 6 — grade mapping bar with scenario showcase"
```

---

### Task 17: Page assembly

**Files:**
- Create: `src/app/methodology/page.tsx`

- [ ] **Step 1: Create the page shell**

```typescript
// src/app/methodology/page.tsx
import { MethodologyProvider } from "@/components/methodology/methodology-provider";
import { FactorToolbar } from "@/components/methodology/factor-toolbar";
import { SectionNav } from "@/components/methodology/section-nav";
import { SectionBaseline } from "@/components/methodology/section-baseline";
import { SectionMultiplication } from "@/components/methodology/section-multiplication";
import { SectionCIPropagation } from "@/components/methodology/section-ci-propagation";
import { SectionConfidence } from "@/components/methodology/section-confidence";
import { SectionORCorrection } from "@/components/methodology/section-or-correction";
import { SectionGradeMapping } from "@/components/methodology/section-grade-mapping";

export const metadata = {
  title: "Methodology — TimingRx",
  description:
    "Interactive visualization of how TimingRx calculates stillbirth risk, " +
    "propagates uncertainty, and scores confidence. Dual-track display with " +
    "animated charts and live formula breakdowns.",
};

export default function MethodologyPage() {
  return (
    <MethodologyProvider>
      <FactorToolbar />
      <SectionNav />
      <div className="mx-auto max-w-6xl px-4 lg:px-6 xl:pl-16">
        <div className="py-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            How TimingRx Works
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            An interactive exploration of the risk calculation methodology.
            Toggle risk factors in the toolbar to watch the math and
            visualizations update in real-time.
          </p>
        </div>

        <SectionBaseline />
        <SectionMultiplication />
        <SectionCIPropagation />
        <SectionConfidence />
        <SectionORCorrection />
        <SectionGradeMapping />

        {/* Footer disclaimer */}
        <div className="py-12 border-t mt-12">
          <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
            This methodology page explains the mathematical model underlying
            TimingRx. The model uses published risk ratios applied multiplicatively
            to a meta-analytic baseline. The composite has not been prospectively
            validated. The confidence scorer is a novel feature designed to make
            model limitations transparent. Clinical judgment supersedes all
            calculator output.
          </p>
        </div>
      </div>
    </MethodologyProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Verify production build**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds, `/methodology` route appears in output

- [ ] **Step 4: Commit**

```bash
git add src/app/methodology/page.tsx
git commit -m "feat(methodology): assemble full methodology page with all 6 sections"
```

---

### Task 18: Final integration test

- [ ] **Step 1: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass (existing + new methodology tests)

- [ ] **Step 2: Run production build**

Run: `pnpm build`
Expected: Clean build, methodology page in route list

- [ ] **Step 3: Visual smoke test**

Run: `pnpm start` and visit `http://localhost:3000/methodology`

Verify:
- Page loads with dual-track layout
- Factor toolbar toggles update both visual and math tracks
- Animations are smooth (framer-motion springs)
- Scroll spy dots track section visibility
- Scenarios in Section 6 load correct factors
- Mobile responsive: shrinks to tabbed layout below 1024px
- All teaching callouts expand/collapse

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(methodology): complete dual-track methodology visualization page

Adds /methodology route with 6 interactive sections:
1. Muglu baseline curve with animated data points
2. Factor multiplication with layered curve animation
3. CI propagation with per-factor variance breakdown
4. 5-component confidence scorer with animated gauges
5. OR→RR correction with divergence visualization
6. Grade mapping bar with scenario showcase

Uses framer-motion for smooth animations, shared React context
for live calculator state, and scroll-spy section navigation."
```

---

## Chunk 4: Review Fixes — Mobile Tabs, A11y, Missing Details

These tasks address issues found in plan review.

### Task 19: Mobile track tabs component

**Files:**
- Create: `src/components/methodology/mobile-track-tabs.tsx`

- [ ] **Step 1: Create mobile tab switcher**

```typescript
// src/components/methodology/mobile-track-tabs.tsx
"use client";

import { useState, type ReactNode } from "react";

interface MobileTrackTabsProps {
  visual: ReactNode;
  math: ReactNode;
}

/**
 * On screens <1024px, shows Visual/Math as tabs instead of side-by-side.
 * On >=1024px, renders nothing (the parent grid handles layout).
 */
export function MobileTrackTabs({ visual, math }: MobileTrackTabsProps) {
  const [tab, setTab] = useState<"visual" | "math">("visual");

  return (
    <>
      {/* Tab bar — visible only on mobile */}
      <div className="flex gap-1 mb-3 lg:hidden">
        <button
          onClick={() => setTab("visual")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            tab === "visual"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Visual
        </button>
        <button
          onClick={() => setTab("math")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            tab === "math"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Math
        </button>
      </div>

      {/* Desktop: both visible via grid */}
      <div className="hidden lg:contents">
        {visual}
        {math}
      </div>

      {/* Mobile: show selected tab */}
      <div className="lg:hidden">
        {tab === "visual" ? visual : math}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Update each section to use MobileTrackTabs**

In each section component (section-baseline.tsx, section-multiplication.tsx, etc.), replace the inner grid children pattern:

```tsx
// Before:
<div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
  {/* VISUAL TRACK */}
  <div>...</div>
  {/* MATH TRACK */}
  <div>...</div>
</div>

// After:
<div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
  <MobileTrackTabs
    visual={<div>...</div>}
    math={<div>...</div>}
  />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/mobile-track-tabs.tsx
git add src/components/methodology/section-*.tsx
git commit -m "feat(methodology): add mobile Visual/Math tab switcher for <1024px"
```

---

### Task 20: Reduced motion support

**Files:**
- Modify: all section components

- [ ] **Step 1: Add useReducedMotion to all animated sections**

At the top of each section component, add:

```typescript
import { useReducedMotion } from "framer-motion";
// ...
const prefersReducedMotion = useReducedMotion();
```

Then conditionally disable animations:
- For `motion.div` with `initial`/`animate`: wrap in `initial={prefersReducedMotion ? false : { ... }}`
- For Recharts: `isAnimationActive={!prefersReducedMotion}`
- For AnimatedNumber: pass `stiffness={prefersReducedMotion ? 10000 : 200}` (effectively instant)

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-*.tsx
git commit -m "a11y(methodology): respect prefers-reduced-motion across all sections"
```

---

### Task 21: Keyboard accessibility for toolbar

**Files:**
- Modify: `src/components/methodology/factor-toolbar.tsx`
- Modify: `src/components/methodology/teaching-callout.tsx`

- [ ] **Step 1: Add roving tabindex to factor pills**

Wrap the factor pills in a div with `role="toolbar"` and add an `onKeyDown` handler:

```typescript
function handleToolbarKeyDown(e: React.KeyboardEvent) {
  const pills = Array.from(
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-factor-pill]")
  );
  const current = pills.indexOf(e.target as HTMLButtonElement);
  if (current === -1) return;

  let next = current;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    next = (current + 1) % pills.length;
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    next = (current - 1 + pills.length) % pills.length;
  } else {
    return;
  }

  e.preventDefault();
  pills[next].focus();
}
```

Add `data-factor-pill` attribute to each pill button. Set `tabIndex={i === 0 ? 0 : -1}` for roving focus.

- [ ] **Step 2: Add Escape-to-close in TeachingCallout**

In the TeachingCallout button's `onClick`, also add:

```typescript
onKeyDown={(e) => {
  if (e.key === "Escape" && open) {
    setOpen(false);
    e.stopPropagation();
  }
}}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/factor-toolbar.tsx src/components/methodology/teaching-callout.tsx
git commit -m "a11y(methodology): add roving tabindex and Escape-to-close"
```

---

### Task 22: Add IP/MP/RP formula boxes to Section 4

**Files:**
- Modify: `src/components/methodology/section-confidence.tsx`

- [ ] **Step 1: Add three more FormulaBlock components after the MV box**

```tsx
{/* IP detail */}
<FormulaBlock title="IP — Interaction Penalty" accentColor="#f59e0b">
  <div className="text-[10px] space-y-0.5">
    <div>IP = max(0.75, 1.0 − 0.05H − 0.02P)</div>
    <div>H = {hypothesizedCount} hypothesized, P = {publishedCount} published</div>
    <div className="font-semibold">
      IP = <AnimatedNumber value={confidenceScore.breakdown.interactionPenalty} decimals={3} />
    </div>
  </div>
</FormulaBlock>

{/* MP detail */}
<FormulaBlock title="MP — Magnitude Plausibility" accentColor="#14b8a6">
  <div className="text-[10px] space-y-0.5">
    <div>Stepwise with linear interpolation by combined multiplier</div>
    <div>Combined multiplier = {combinedMultiplier.toFixed(2)}</div>
    <div className="font-semibold">
      MP = <AnimatedNumber value={confidenceScore.breakdown.magnitudePlausibility} decimals={3} />
    </div>
  </div>
</FormulaBlock>

{/* RP detail */}
<FormulaBlock title="RP — Rare-Disease Validity" accentColor="#f43f5e">
  <div className="text-[10px] space-y-0.5">
    <div>OR ≈ RR when combined risk &lt; 1%</div>
    <div>Adjusted risk proportion = {(adjustedRiskProportion * 100).toFixed(3)}%</div>
    <div className="font-semibold">
      RP = <AnimatedNumber value={confidenceScore.breakdown.rareDiseaseValidity} decimals={3} />
    </div>
  </div>
</FormulaBlock>
```

This requires adding `hypothesizedCount`, `publishedCount`, `combinedMultiplier`, and `adjustedRiskProportion` as computed values in the component.

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-confidence.tsx
git commit -m "feat(methodology): add IP/MP/RP formula detail boxes to Section 4"
```

---

### Task 23: Fix Section 3 baseline variance and CI band

**Files:**
- Modify: `src/components/methodology/section-ci-propagation.tsx`
- Modify: `src/components/methodology/section-baseline.tsx`

- [ ] **Step 1: Add baseline variance row to Section 3**

Add a baseline entry at the start of the variance breakdown:

```typescript
// Before the factor loop, add:
const baselineCI = [
  selectedGaCalculation.adjustedRiskCI95[0],
  selectedGaCalculation.adjustedRiskCI95[1],
];
// Compute baseline variance from the Muglu CI at current GA
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
// Find nearest baseline point
const nearestBaseline = baselineStillbirthCurve.reduce((prev, curr) =>
  Math.abs(curr.ga - ga) < Math.abs(prev.ga - ga) ? curr : prev
);
const baselineVar =
  nearestBaseline.ci95Low > 0 && nearestBaseline.ci95High > 0
    ? Math.pow(
        (Math.log(nearestBaseline.ci95High) - Math.log(nearestBaseline.ci95Low)) / (2 * 1.96),
        2
      )
    : 0;
```

Prepend `{ factorId: "baseline", label: "Baseline (Muglu)", color: "#94a3b8", variance: baselineVar, proportion: 0 }` to the entries array, then recompute proportions including baseline.

- [ ] **Step 2: Fix CI band in Section 1 chart**

Replace the single `<Area dataKey="ciHigh">` with a proper CI band between ciLow and ciHigh using Recharts Area with a custom shape or two stacked areas:

```tsx
{/* CI band: render area from ciLow to ciHigh */}
<Area
  type="monotone"
  dataKey="ciLow"
  stroke="none"
  fill="transparent"
  fillOpacity={0}
/>
<Area
  type="monotone"
  dataKey="ciHigh"
  stroke="none"
  fill={chartColors.ci}
  fillOpacity={0.5}
  baseLine={data.map((d) => d.ciLow)}
/>
```

Note: Recharts doesn't natively support `baseLine` as an array — use the Recharts `<Area>` `stackId` approach or a custom `<ReferenceArea>` per segment. The simplest correct approach is to render an Area for ciHigh and subtract with a white Area for ciLow:

```tsx
<Area type="monotone" dataKey="ciHigh" stroke="none" fill={chartColors.ci} fillOpacity={0.4} />
<Area type="monotone" dataKey="ciLow" stroke="none" fill="var(--background)" fillOpacity={1} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/section-ci-propagation.tsx src/components/methodology/section-baseline.tsx
git commit -m "fix(methodology): add baseline variance row and fix CI band rendering"
```

---

### Task 24: Fix grade bar pointer alignment

**Files:**
- Modify: `src/components/methodology/section-grade-mapping.tsx`

- [ ] **Step 1: Make grade zones proportional to score ranges**

Replace the hardcoded widths with proportional values:

```tsx
const grades = [
  { grade: "F", min: 0, max: 39, color: "#ef4444", label: "Very low", widthPct: 40 },
  { grade: "D", min: 40, max: 54, color: "#f97316", label: "Low", widthPct: 15 },
  { grade: "C", min: 55, max: 69, color: "#f59e0b", label: "Limited", widthPct: 15 },
  { grade: "B", min: 70, max: 84, color: "#3b82f6", label: "Moderate", widthPct: 15 },
  { grade: "A", min: 85, max: 100, color: "#22c55e", label: "High", widthPct: 15 },
];
```

Render each zone with `width: ${grade.widthPct}%`. The pointer position maps from score (0-100) to percentage (0-100%) directly since the bar is proportional:

```tsx
// Score 0 → left edge of F zone (0%)
// Score 39 → right edge of F zone (40%)
// Score 40 → left edge of D zone (40%)
// Score 100 → right edge of A zone (100%)
function scoreToPosition(score: number): number {
  for (const g of grades) {
    if (score >= g.min && score <= g.max) {
      const zoneStart = grades.slice(0, grades.indexOf(g)).reduce((s, z) => s + z.widthPct, 0);
      const progress = (score - g.min) / (g.max - g.min + 1);
      return zoneStart + progress * g.widthPct;
    }
  }
  return 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-grade-mapping.tsx
git commit -m "fix(methodology): align grade bar pointer position with proportional zones"
```

---

### Task 25: Add interaction steps to Section 2 cascade display

**Files:**
- Modify: `src/components/methodology/section-multiplication.tsx`

- [ ] **Step 1: Render interaction steps with dotted style**

In the FormulaBlock's AnimatePresence loop, check `step.isInteraction` and render differently:

```tsx
{stepByStepBreakdown.map((step, i) => {
  const color = step.isInteraction ? "#94a3b8" : getFactorColor(step.factorId).hex;
  return (
    <FormulaLine
      key={step.factorId}
      delay={i * 0.1}
      highlight
      highlightColor={color}
    >
      <div className="flex justify-between items-center">
        <span className={step.isInteraction ? "italic" : ""}>
          {step.isInteraction && (
            <span className="text-muted-foreground mr-1">↳</span>
          )}
          <span style={{ color }}>
            × {step.label}
          </span>
          <span className="text-muted-foreground ml-1">
            ({step.isInteraction ? "interaction" : "aOR"} {step.multiplier})
          </span>
        </span>
        <span className="font-mono">
          <AnimatedNumber value={step.riskBefore} decimals={2} className="text-muted-foreground" />
          <span className="text-muted-foreground"> → </span>
          <AnimatedNumber value={step.riskAfter} decimals={2} className="font-semibold" />
        </span>
      </div>
    </FormulaLine>
  );
})}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/section-multiplication.tsx
git commit -m "feat(methodology): show interaction adjustment steps in Section 2 cascade"
```
