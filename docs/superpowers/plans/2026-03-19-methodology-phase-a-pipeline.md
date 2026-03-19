# Phase A — Pipeline View Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated SVG pipeline visualization as the second tab on the `/methodology` page, showing risk calculation as a top-to-bottom data flow with a Canvas particle system, while restructuring the page into a 3-tab layout (Explorer / Pipeline / Timeline).

**Architecture:** The existing page.tsx becomes a server shell delegating to a new MethodologyPageContent client component that manages tab state via URL query params. The pipeline itself is a layered SVG (stages + pipes) with a Canvas overlay (particles), both driven by the shared MethodologyContext. A layout hook computes all stage coordinates, consumed by both layers.

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion (installed), Canvas API (native), SVG, existing MethodologyContext

**Spec:** `docs/superpowers/specs/2026-03-19-methodology-phase-a-pipeline-design.md`

---

## File Map

### New Files

| File | Responsibility |
|---|---|
| `src/components/methodology/methodology-page-content.tsx` | Client component: tab state (URL sync), conditional rendering of Explorer/Pipeline/Timeline |
| `src/components/methodology/methodology-tabs.tsx` | WAI-ARIA tablist with keyboard navigation |
| `src/components/methodology/pipeline/use-pipeline-layout.ts` | Hook: computes StageLayout[] coordinates from context state + container width |
| `src/components/methodology/pipeline/pipeline-view.tsx` | Main container: relative div with SVG + Canvas layers |
| `src/components/methodology/pipeline/pipeline-stage.tsx` | SVG stage nodes: Muglu input, multiplier gates, CI chamber, output |
| `src/components/methodology/pipeline/pipeline-filters.tsx` | SVG: 5 parallel confidence filter columns with branching pipes |
| `src/components/methodology/pipeline/pipeline-pipes.tsx` | SVG pipe paths connecting stages with animated dash |
| `src/components/methodology/pipeline/pipeline-hover-card.tsx` | Hover popover positioned near stage |
| `src/components/methodology/pipeline/particle-system.tsx` | Canvas particle spawner, animator, trail renderer |
| `src/components/methodology/pipeline/pipeline-mobile.tsx` | Card-based fallback for <768px |
| `src/components/methodology/pipeline/pipeline-types.ts` | StageType, StageLayout, Particle interfaces |
| `src/components/methodology/pipeline/pipeline-utils.ts` | lerpColor, hexToRgb, gradeColor map |
| `src/__tests__/components/methodology/use-pipeline-layout.test.ts` | Layout hook unit tests |
| `src/__tests__/components/methodology/pipeline-utils.test.ts` | Color utility tests |

### Modified Files

| File | Change |
|---|---|
| `src/app/methodology/page.tsx` | Simplify to server shell: metadata + MethodologyProvider + MethodologyPageContent |

---

## Chunk 1: Page Restructuring — Tabs and Content Shell

### Task 1: Pipeline types and utilities

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-types.ts`
- Create: `src/components/methodology/pipeline/pipeline-utils.ts`
- Test: `src/__tests__/components/methodology/pipeline-utils.test.ts`

- [ ] **Step 1: Write utility tests**

```typescript
// src/__tests__/components/methodology/pipeline-utils.test.ts
import { describe, it, expect } from "vitest";
import { hexToRgb, lerpColor, gradeToColor } from "@/components/methodology/pipeline/pipeline-utils";

describe("hexToRgb", () => {
  it("parses 6-char hex", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });
  it("parses without hash", () => {
    expect(hexToRgb("3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
  });
  it("parses rgb() format", () => {
    expect(hexToRgb("rgb(128,128,128)")).toEqual({ r: 128, g: 128, b: 128 });
  });
});

describe("lerpColor", () => {
  it("returns from color at t=0", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("rgb(0,0,0)");
  });
  it("returns to color at t=1", () => {
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("rgb(255,255,255)");
  });
  it("returns midpoint at t=0.5", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("rgb(128,128,128)");
  });
});

describe("gradeToColor", () => {
  it("maps A to emerald", () => {
    expect(gradeToColor("A")).toBe("#22c55e");
  });
  it("maps F to red", () => {
    expect(gradeToColor("F")).toBe("#ef4444");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/__tests__/components/methodology/pipeline-utils.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create types file**

```typescript
// src/components/methodology/pipeline/pipeline-types.ts

export type StageType = "muglu" | "gate" | "interaction" | "ci" | "filter" | "output";

export interface StageLayout {
  id: string;
  type: StageType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  pipeInY?: number;
  pipeOutY?: number;
  // Data for rendering
  label?: string;
  value?: number;
  multiplier?: number;
  cumulativeRisk?: number;
  isInteraction?: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  trailOpacity: number;
  glowRadius: number;
  /** Index into the pipeline path (0 = start, 1 = end) */
  progress: number;
  /** Position history for trail rendering (newest first) */
  history: Array<{ x: number; y: number }>;
  /** Which stage the particle is currently passing through */
  currentStageIndex: number;
}

export interface PipeSegment {
  id: string;
  fromStageId: string;
  toStageId: string;
  path: string; // SVG path d attribute
  strokeWidth: number;
  color: string;
}
```

- [ ] **Step 4: Create utils file**

```typescript
// src/components/methodology/pipeline/pipeline-utils.ts

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(color: string): RGB {
  // Handle rgb(r,g,b) format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  }
  // Handle hex format
  const clean = color.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function lerpColor(from: string, to: string, t: number): string {
  const f = hexToRgb(from);
  const t2 = hexToRgb(to);
  const r = Math.round(f.r + (t2.r - f.r) * t);
  const g = Math.round(f.g + (t2.g - f.g) * t);
  const b = Math.round(f.b + (t2.b - f.b) * t);
  return `rgb(${r},${g},${b})`;
}

const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

export function gradeToColor(grade: string): string {
  return GRADE_COLORS[grade] ?? "#64748b";
}

/** Confidence filter config: abbreviation → codebase field + color */
export const FILTER_CONFIG = [
  { key: "evidenceQuality" as const, abbr: "EQ", color: "#3b82f6" },
  { key: "modelValidity" as const, abbr: "MV", color: "#8b5cf6" },
  { key: "interactionPenalty" as const, abbr: "IP", color: "#f59e0b" },
  { key: "magnitudePlausibility" as const, abbr: "MP", color: "#14b8a6" },
  { key: "rareDiseaseValidity" as const, abbr: "RP", color: "#f43f5e" },
] as const;

/** Interaction gates use hardcoded slate, ignoring StepBreakdown.color */
export const INTERACTION_COLOR = "#64748b";
```

- [ ] **Step 5: Run tests**

Run: `pnpm vitest run src/__tests__/components/methodology/pipeline-utils.test.ts`
Expected: All PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-types.ts src/components/methodology/pipeline/pipeline-utils.ts src/__tests__/components/methodology/pipeline-utils.test.ts
git commit -m "feat(pipeline): add types and color utilities with tests"
```

---

### Task 2: Methodology tabs component

**Files:**
- Create: `src/components/methodology/methodology-tabs.tsx`

- [ ] **Step 1: Implement WAI-ARIA tablist**

```typescript
// src/components/methodology/methodology-tabs.tsx
"use client";

import { useRef, useCallback } from "react";

export type TabId = "explorer" | "pipeline" | "timeline";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "explorer", label: "Interactive Explorer" },
  { id: "pipeline", label: "Pipeline View" },
  { id: "timeline", label: "Timeline" },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MethodologyTabs({ activeTab, onTabChange }: Props) {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % TABS.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = TABS.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      onTabChange(TABS[nextIndex].id);

      // Focus the new tab button
      const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]'
      );
      buttons?.[nextIndex]?.focus();
    },
    [activeTab, onTabChange]
  );

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Methodology views"
      className="flex gap-1 border-b pb-px"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab, i) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export { TABS };
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/methodology-tabs.tsx
git commit -m "feat(pipeline): add WAI-ARIA methodology tabs component"
```

---

### Task 3: MethodologyPageContent client shell + refactor page.tsx

**Files:**
- Create: `src/components/methodology/methodology-page-content.tsx`
- Modify: `src/app/methodology/page.tsx`

- [ ] **Step 1: Create the client component shell**

```typescript
// src/components/methodology/methodology-page-content.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import { FactorToolbar } from "./factor-toolbar";
import { SectionNav } from "./section-nav";
import { MethodologyTabs, type TabId } from "./methodology-tabs";
import { SectionBaseline } from "./section-baseline";
import { SectionMultiplication } from "./section-multiplication";
import { SectionCIPropagation } from "./section-ci-propagation";
import { SectionConfidence } from "./section-confidence";
import { SectionOrCorrection } from "./section-or-correction";
import { SectionGradeMapping } from "./section-grade-mapping";

function MethodologyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get("view") as TabId) || "explorer";

  const setActiveTab = useCallback(
    (tab: TabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "explorer") {
        params.delete("view");
      } else {
        params.set("view", tab);
      }
      const qs = params.toString();
      router.replace(`/methodology${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <>
      <FactorToolbar />
      {activeTab === "explorer" && <SectionNav />}

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

        <MethodologyTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab panels */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="pt-6"
        >
          {activeTab === "explorer" && (
            <>
              <SectionBaseline />
              <SectionMultiplication />
              <SectionCIPropagation />
              <SectionConfidence />
              <SectionOrCorrection />
              <SectionGradeMapping />
              <div className="py-12 border-t mt-12">
                <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
                  This methodology page explains the mathematical model underlying
                  TimingRx. The model uses published risk ratios applied
                  multiplicatively to a meta-analytic baseline. The composite has not
                  been prospectively validated. Clinical judgment supersedes all
                  calculator output.
                </p>
              </div>
            </>
          )}

          {activeTab === "pipeline" && (
            <div className="py-8 text-center text-muted-foreground">
              Pipeline view loading...
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Coming Soon
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The Timeline view will provide an anatomical visualization of
                delivery timing.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function MethodologyPageContent() {
  return (
    <Suspense>
      <MethodologyPageInner />
    </Suspense>
  );
}
```

- [ ] **Step 2: Simplify page.tsx to server shell**

```typescript
// src/app/methodology/page.tsx
import { MethodologyProvider } from "@/components/methodology/methodology-provider";
import { MethodologyPageContent } from "@/components/methodology/methodology-page-content";

export const metadata = {
  title: "Methodology — TimingRx",
  description:
    "Interactive visualization of how TimingRx calculates stillbirth risk, " +
    "propagates uncertainty, and scores confidence.",
};

export default function MethodologyPage() {
  return (
    <MethodologyProvider>
      <MethodologyPageContent />
    </MethodologyProvider>
  );
}
```

- [ ] **Step 3: Verify TypeScript + build**

Run: `pnpm exec tsc --noEmit && pnpm build 2>&1 | grep -E "(methodology|Error|✓)" | head -10`
Expected: Clean compile, /methodology route appears, existing Explorer tab renders correctly

- [ ] **Step 4: Commit**

```bash
git add src/components/methodology/methodology-page-content.tsx src/app/methodology/page.tsx
git commit -m "refactor(methodology): extract tabbed page content with URL-synced tab state"
```

---

## Chunk 2: Pipeline Layout Hook and SVG Stages

### Task 4: usePipelineLayout hook (with tests)

**Files:**
- Create: `src/components/methodology/pipeline/use-pipeline-layout.ts`
- Test: `src/__tests__/components/methodology/use-pipeline-layout.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/__tests__/components/methodology/use-pipeline-layout.test.ts
import { describe, it, expect } from "vitest";
import { computePipelineLayout } from "@/components/methodology/pipeline/use-pipeline-layout";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";
import type { ConfidenceScore, RiskCalculation } from "@/data/types";

// Minimal mock of RiskCalculation for testing
function mockCalc(overrides?: Partial<RiskCalculation>): RiskCalculation {
  return {
    ga: 273,
    baselineRiskPer1000: 0.4,
    adjustedRiskPer1000: 0.4,
    adjustedRiskCI95: [0.25, 0.58] as [number, number],
    factorContributions: [],
    interactionAdjustments: [],
    confidenceScore: {
      score: 95,
      grade: "A",
      label: "High confidence",
      breakdown: {
        evidenceQuality: 0.95,
        modelValidity: 1.0,
        interactionPenalty: 1.0,
        magnitudePlausibility: 1.0,
        rareDiseaseValidity: 1.0,
      },
      explanation: "",
    },
    ...overrides,
  };
}

describe("computePipelineLayout", () => {
  it("returns muglu + ci + 5 filters + output with no factors", () => {
    const layout = computePipelineLayout({
      containerWidth: 800,
      steps: [],
      calc: mockCalc(),
    });
    // muglu, ci, 5 filters, output = 8 stages
    expect(layout.stages.length).toBe(8);
    expect(layout.stages[0].type).toBe("muglu");
    expect(layout.stages[1].type).toBe("ci");
    expect(layout.stages.filter((s) => s.type === "filter").length).toBe(5);
    expect(layout.stages[layout.stages.length - 1].type).toBe("output");
  });

  it("inserts gate stages for each step", () => {
    const steps: StepBreakdown[] = [
      { factorId: "age_gte_40", label: "Age ≥40", multiplier: 1.88, riskBefore: 0.4, riskAfter: 0.75, color: "#f59e0b" },
      { factorId: "bmi_35_39", label: "BMI 35", multiplier: 2.1, riskBefore: 0.75, riskAfter: 1.58, color: "#3b82f6" },
    ];
    const layout = computePipelineLayout({
      containerWidth: 800,
      steps,
      calc: mockCalc({ adjustedRiskPer1000: 1.58 }),
    });
    const gates = layout.stages.filter((s) => s.type === "gate");
    expect(gates.length).toBe(2);
    expect(gates[0].label).toBe("Age ≥40");
    expect(gates[1].label).toBe("BMI 35");
  });

  it("stages are ordered top-to-bottom with increasing y", () => {
    const steps: StepBreakdown[] = [
      { factorId: "age_gte_40", label: "Age", multiplier: 1.88, riskBefore: 0.4, riskAfter: 0.75, color: "#f59e0b" },
    ];
    const layout = computePipelineLayout({
      containerWidth: 800,
      steps,
      calc: mockCalc(),
    });
    for (let i = 1; i < layout.stages.length; i++) {
      expect(layout.stages[i].y).toBeGreaterThan(layout.stages[i - 1].y);
    }
  });

  it("computes pipe segments between consecutive stages", () => {
    const layout = computePipelineLayout({
      containerWidth: 800,
      steps: [],
      calc: mockCalc(),
    });
    expect(layout.pipes.length).toBeGreaterThan(0);
    // Each pipe connects two stages
    for (const pipe of layout.pipes) {
      expect(pipe.fromStageId).toBeTruthy();
      expect(pipe.toStageId).toBeTruthy();
      expect(pipe.path).toBeTruthy();
    }
  });

  it("returns total height", () => {
    const layout = computePipelineLayout({
      containerWidth: 800,
      steps: [],
      calc: mockCalc(),
    });
    expect(layout.totalHeight).toBeGreaterThan(0);
    expect(layout.totalHeight).toBeLessThan(2000);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/__tests__/components/methodology/use-pipeline-layout.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the layout computation**

```typescript
// src/components/methodology/pipeline/use-pipeline-layout.ts
import { useMemo } from "react";
import type { RiskCalculation } from "@/data/types";
import type { StepBreakdown } from "../methodology-provider";
import type { StageLayout, PipeSegment } from "./pipeline-types";
import { FILTER_CONFIG, INTERACTION_COLOR, gradeToColor } from "./pipeline-utils";

const STAGE_GAP = 80;
const FILTER_GAP = 60;
const STAGE_WIDTHS = {
  muglu: 200,
  gate: 200,
  interaction: 160,
  ci: 240,
  filter: 40,
  output: 220,
};
const STAGE_HEIGHTS = {
  muglu: 60,
  gate: 50,
  ci: 70,
  filter: 80,
  output: 80,
};
const FILTER_SPACING = 20;

export interface PipelineLayoutInput {
  containerWidth: number;
  steps: StepBreakdown[];
  calc: RiskCalculation;
}

export interface PipelineLayoutOutput {
  stages: StageLayout[];
  pipes: PipeSegment[];
  totalHeight: number;
  /** Center X of the main pipeline flow */
  centerX: number;
}

export function computePipelineLayout(input: PipelineLayoutInput): PipelineLayoutOutput {
  const { containerWidth, steps, calc } = input;
  const centerX = containerWidth / 2;
  const stages: StageLayout[] = [];
  let currentY = 20; // top padding

  // Stage 0: Muglu Input
  stages.push({
    id: "muglu",
    type: "muglu",
    x: centerX,
    y: currentY,
    width: STAGE_WIDTHS.muglu,
    height: STAGE_HEIGHTS.muglu,
    label: "Muglu Baseline",
    value: calc.baselineRiskPer1000,
    pipeOutY: currentY + STAGE_HEIGHTS.muglu,
  });
  currentY += STAGE_HEIGHTS.muglu + STAGE_GAP;

  // Gate stages (one per step)
  for (const step of steps) {
    const isInteraction = step.isInteraction ?? false;
    const w = isInteraction ? STAGE_WIDTHS.interaction : STAGE_WIDTHS.gate;
    stages.push({
      id: isInteraction ? `interaction_${step.factorId}` : `gate_${step.factorId}`,
      type: isInteraction ? "interaction" : "gate",
      x: centerX,
      y: currentY,
      width: w,
      height: STAGE_HEIGHTS.gate,
      color: isInteraction ? INTERACTION_COLOR : step.color,
      label: step.label,
      multiplier: step.multiplier,
      cumulativeRisk: step.riskAfter,
      isInteraction,
      pipeInY: currentY,
      pipeOutY: currentY + STAGE_HEIGHTS.gate,
    });
    currentY += STAGE_HEIGHTS.gate + STAGE_GAP;
  }

  // CI Chamber
  stages.push({
    id: "ci",
    type: "ci",
    x: centerX,
    y: currentY,
    width: STAGE_WIDTHS.ci,
    height: STAGE_HEIGHTS.ci,
    label: "95% CI",
    value: calc.adjustedRiskPer1000,
    pipeInY: currentY,
    pipeOutY: currentY + STAGE_HEIGHTS.ci,
  });
  currentY += STAGE_HEIGHTS.ci + FILTER_GAP;

  // 5 Parallel Confidence Filters
  const totalFiltersWidth =
    FILTER_CONFIG.length * STAGE_WIDTHS.filter +
    (FILTER_CONFIG.length - 1) * FILTER_SPACING;
  const filtersStartX = centerX - totalFiltersWidth / 2 + STAGE_WIDTHS.filter / 2;

  for (let i = 0; i < FILTER_CONFIG.length; i++) {
    const fc = FILTER_CONFIG[i];
    stages.push({
      id: `filter_${fc.abbr.toLowerCase()}`,
      type: "filter",
      x: filtersStartX + i * (STAGE_WIDTHS.filter + FILTER_SPACING),
      y: currentY,
      width: STAGE_WIDTHS.filter,
      height: STAGE_HEIGHTS.filter,
      color: fc.color,
      label: fc.abbr,
      value: calc.confidenceScore.breakdown[fc.key],
    });
  }
  currentY += STAGE_HEIGHTS.filter + FILTER_GAP;

  // Output
  const gradeColor = gradeToColor(calc.confidenceScore.grade);
  stages.push({
    id: "output",
    type: "output",
    x: centerX,
    y: currentY,
    width: STAGE_WIDTHS.output,
    height: STAGE_HEIGHTS.output,
    color: gradeColor,
    label: `Grade ${calc.confidenceScore.grade}`,
    value: calc.adjustedRiskPer1000,
    pipeInY: currentY,
  });
  currentY += STAGE_HEIGHTS.output + 20; // bottom padding

  // Compute pipe segments
  const pipes = computePipes(stages, centerX);

  return { stages, pipes, totalHeight: currentY, centerX };
}

function computePipes(stages: StageLayout[], centerX: number): PipeSegment[] {
  const pipes: PipeSegment[] = [];

  // Find stages in order (non-filter)
  const mainStages = stages.filter((s) => s.type !== "filter");

  for (let i = 0; i < mainStages.length - 1; i++) {
    const from = mainStages[i];
    const to = mainStages[i + 1];

    // Skip the connection from CI to output (filters go between)
    if (from.type === "ci" && to.type === "output") continue;

    const fromY = (from.pipeOutY ?? from.y + from.height);
    const toY = (to.pipeInY ?? to.y);

    pipes.push({
      id: `pipe_${from.id}_${to.id}`,
      fromStageId: from.id,
      toStageId: to.id,
      path: `M ${centerX} ${fromY} L ${centerX} ${toY}`,
      strokeWidth: 3,
      color: from.color ?? "#94a3b8",
    });
  }

  // Branch pipes: CI → each filter
  const ciStage = stages.find((s) => s.type === "ci");
  const filterStages = stages.filter((s) => s.type === "filter");
  const outputStage = stages.find((s) => s.type === "output");

  if (ciStage && filterStages.length > 0) {
    const ciBottom = (ciStage.pipeOutY ?? ciStage.y + ciStage.height);
    for (const filter of filterStages) {
      const filterTop = filter.y;
      // Bezier curve from center to filter x
      const cpY = ciBottom + (filterTop - ciBottom) * 0.4;
      pipes.push({
        id: `pipe_ci_${filter.id}`,
        fromStageId: ciStage.id,
        toStageId: filter.id,
        path: `M ${centerX} ${ciBottom} C ${centerX} ${cpY}, ${filter.x} ${cpY}, ${filter.x} ${filterTop}`,
        strokeWidth: 1.5,
        color: filter.color ?? "#94a3b8",
      });
    }
  }

  // Reconvergence pipes: each filter → output
  if (outputStage && filterStages.length > 0) {
    const outputTop = (outputStage.pipeInY ?? outputStage.y);
    for (const filter of filterStages) {
      const filterBottom = filter.y + filter.height;
      const cpY = filterBottom + (outputTop - filterBottom) * 0.6;
      pipes.push({
        id: `pipe_${filter.id}_output`,
        fromStageId: filter.id,
        toStageId: outputStage.id,
        path: `M ${filter.x} ${filterBottom} C ${filter.x} ${cpY}, ${centerX} ${cpY}, ${centerX} ${outputTop}`,
        strokeWidth: 1.5,
        color: filter.color ?? "#94a3b8",
      });
    }
  }

  return pipes;
}

/** React hook wrapping computePipelineLayout with memoization */
export function usePipelineLayout(input: PipelineLayoutInput): PipelineLayoutOutput {
  return useMemo(
    () => computePipelineLayout(input),
    [input.containerWidth, input.steps, input.calc]
  );
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run src/__tests__/components/methodology/use-pipeline-layout.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/methodology/pipeline/use-pipeline-layout.ts src/__tests__/components/methodology/use-pipeline-layout.test.ts
git commit -m "feat(pipeline): add layout computation hook with tests"
```

---

### Task 5: Pipeline stage SVG components

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-stage.tsx`

- [ ] **Step 1: Implement stage renderers**

This component renders SVG `<foreignObject>` nodes for each stage, using framer-motion for enter/exit animations. Each stage type has a distinct visual:

```typescript
// src/components/methodology/pipeline/pipeline-stage.tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";
import { AnimatedNumber } from "../animated-number";

interface Props {
  stage: StageLayout;
  onHover: (stage: StageLayout | null) => void;
  onClick: (stage: StageLayout) => void;
}

export function PipelineStage({ stage, onHover, onClick }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const halfW = stage.width / 2;

  return (
    <motion.g
      initial={prefersReducedMotion ? false : { opacity: 0, x: stage.type === "gate" ? -30 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, x: stage.type === "gate" ? 30 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => onHover(stage)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(stage)}
      style={{ cursor: "pointer" }}
      tabIndex={0}
      aria-label={`${stage.label}: ${stage.value?.toFixed(2) ?? ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(stage);
        }
      }}
      onFocus={() => onHover(stage)}
      onBlur={() => onHover(null)}
    >
      {stage.type === "muglu" && <MugluNode stage={stage} />}
      {stage.type === "gate" && <GateNode stage={stage} />}
      {stage.type === "interaction" && <GateNode stage={stage} />}
      {stage.type === "ci" && <CINode stage={stage} />}
      {stage.type === "output" && <OutputNode stage={stage} />}
    </motion.g>
  );
}

function MugluNode({ stage }: { stage: StageLayout }) {
  return (
    <foreignObject
      x={stage.x - stage.width / 2}
      y={stage.y}
      width={stage.width}
      height={stage.height}
    >
      <div className="h-full rounded-lg border-2 border-primary bg-background flex flex-col items-center justify-center text-center px-2">
        <span className="text-[10px] text-muted-foreground">Muglu 2019</span>
        <span className="font-mono text-sm font-bold">
          {stage.value?.toFixed(2)}<span className="text-[9px] font-normal text-muted-foreground"> /1,000</span>
        </span>
      </div>
    </foreignObject>
  );
}

function GateNode({ stage }: { stage: StageLayout }) {
  const isInteraction = stage.isInteraction;
  return (
    <foreignObject
      x={stage.x - stage.width / 2}
      y={stage.y}
      width={stage.width}
      height={stage.height}
    >
      <div
        className={`h-full rounded-md flex items-center justify-between px-3 ${
          isInteraction ? "border-2 border-dashed italic" : "border-2"
        }`}
        style={{
          borderColor: stage.color,
          backgroundColor: `${stage.color}14`,
        }}
      >
        <span className="text-[10px] truncate flex-1" style={{ color: stage.color }}>
          {isInteraction && "↳ "}{stage.label}
        </span>
        <div className="text-right ml-2 shrink-0">
          <span className="font-mono text-xs font-bold" style={{ color: stage.color }}>
            ×{stage.multiplier?.toFixed(2)}
          </span>
          {stage.cumulativeRisk !== undefined && (
            <div className="font-mono text-[9px] text-muted-foreground">
              →{stage.cumulativeRisk.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </foreignObject>
  );
}

function CINode({ stage }: { stage: StageLayout }) {
  return (
    <foreignObject
      x={stage.x - stage.width / 2}
      y={stage.y}
      width={stage.width}
      height={stage.height}
    >
      <div className="h-full rounded-lg border-2 border-violet-400 bg-violet-50/30 dark:bg-violet-950/20 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400">
          95% Confidence Interval
        </span>
        <span className="text-[9px] text-muted-foreground">
          Uncertainty expansion
        </span>
      </div>
    </foreignObject>
  );
}

function OutputNode({ stage }: { stage: StageLayout }) {
  return (
    <foreignObject
      x={stage.x - stage.width / 2}
      y={stage.y}
      width={stage.width}
      height={stage.height}
    >
      <div
        className="h-full rounded-lg border-2 flex flex-col items-center justify-center"
        style={{
          borderColor: stage.color,
          backgroundColor: `${stage.color}20`,
        }}
      >
        <span className="text-lg font-bold" style={{ color: stage.color }}>
          {stage.label}
        </span>
        <span className="font-mono text-sm">
          {stage.value?.toFixed(2)}
          <span className="text-[9px] text-muted-foreground"> /1,000</span>
        </span>
      </div>
    </foreignObject>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-stage.tsx
git commit -m "feat(pipeline): add SVG stage node components with enter/exit animations"
```

---

### Task 6: Pipeline filters (5 parallel columns)

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-filters.tsx`

- [ ] **Step 1: Implement the branching filter visualization**

```typescript
// src/components/methodology/pipeline/pipeline-filters.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";
import type { ConfidenceScore } from "@/data/types";
import { FILTER_CONFIG } from "./pipeline-utils";

interface Props {
  filterStages: StageLayout[];
  confidence: ConfidenceScore;
  onHover: (stage: StageLayout | null) => void;
  onClick: (stage: StageLayout) => void;
}

export function PipelineFilters({ filterStages, confidence, onHover, onClick }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <g>
      {filterStages.map((stage, i) => {
        const config = FILTER_CONFIG[i];
        if (!config) return null;

        const value = confidence.breakdown[config.key];
        const fillHeight = stage.height * value;
        const isLow = value < 0.8;

        return (
          <g
            key={stage.id}
            tabIndex={0}
            aria-label={`${config.abbr}: ${value.toFixed(2)}`}
            onMouseEnter={() => onHover(stage)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(stage)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(stage);
              }
            }}
            onFocus={() => onHover(stage)}
            onBlur={() => onHover(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Background */}
            <rect
              x={stage.x - stage.width / 2}
              y={stage.y}
              width={stage.width}
              height={stage.height}
              rx={4}
              fill="var(--muted)"
              stroke={stage.color}
              strokeWidth={1}
            />

            {/* Fill (from bottom) */}
            <motion.rect
              x={stage.x - stage.width / 2}
              y={stage.y + stage.height - fillHeight}
              width={stage.width}
              height={fillHeight}
              rx={4}
              fill={stage.color}
              fillOpacity={0.6}
              animate={{ height: fillHeight, y: stage.y + stage.height - fillHeight }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 200, damping: 25 }
              }
            />

            {/* Low value warning pulse */}
            {isLow && !prefersReducedMotion && (
              <motion.rect
                x={stage.x - stage.width / 2}
                y={stage.y}
                width={stage.width}
                height={stage.height}
                rx={4}
                fill="#ef4444"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              />
            )}

            {/* Label above */}
            <text
              x={stage.x}
              y={stage.y - 6}
              textAnchor="middle"
              className="text-[9px] fill-muted-foreground font-medium"
            >
              {config.abbr}
            </text>

            {/* Value below */}
            <text
              x={stage.x}
              y={stage.y + stage.height + 14}
              textAnchor="middle"
              className="text-[9px] fill-foreground font-mono"
            >
              {value.toFixed(2)}
            </text>
          </g>
        );
      })}
    </g>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-filters.tsx
git commit -m "feat(pipeline): add 5 parallel confidence filter columns"
```

---

### Task 7: Pipeline pipes SVG

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-pipes.tsx`

- [ ] **Step 1: Implement animated pipe segments**

```typescript
// src/components/methodology/pipeline/pipeline-pipes.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PipeSegment } from "./pipeline-types";

interface Props {
  pipes: PipeSegment[];
}

export function PipelinePipes({ pipes }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <g>
      {pipes.map((pipe) => (
        <motion.path
          key={pipe.id}
          d={pipe.path}
          stroke={pipe.color}
          strokeWidth={pipe.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={prefersReducedMotion ? "none" : "4 4"}
          initial={prefersReducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={
            prefersReducedMotion
              ? undefined
              : {
                  // Animate dash offset for flowing effect
                  animation: "pipeDash 2s linear infinite",
                }
          }
        />
      ))}

      {!prefersReducedMotion && (
        <style>{`
          @keyframes pipeDash {
            to { stroke-dashoffset: -8; }
          }
        `}</style>
      )}
    </g>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-pipes.tsx
git commit -m "feat(pipeline): add SVG pipe segments with animated dash flow"
```

---

## Chunk 3: Particle System, Hover Cards, Mobile, and Assembly

### Task 8: Particle system (Canvas)

**Files:**
- Create: `src/components/methodology/pipeline/particle-system.tsx`

- [ ] **Step 1: Implement Canvas particle renderer**

```typescript
// src/components/methodology/pipeline/particle-system.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";
import { lerpColor, gradeToColor } from "./pipeline-utils";

interface Props {
  stages: StageLayout[];
  centerX: number;
  totalHeight: number;
  combinedMultiplier: number;
  activeFactorCount: number;
  grade: string;
  containerWidth: number;
}

interface ParticleState {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  trailOpacity: number;
  glowRadius: number;
  history: Array<{ x: number; y: number }>;
  stageIndex: number;
}

const MAX_PARTICLES = 30;
const MAX_TRAIL_LENGTH = 6;
const BASE_COLOR = "#94a3b8";

export function ParticleSystem({
  stages,
  centerX,
  totalHeight,
  combinedMultiplier,
  activeFactorCount,
  grade,
  containerWidth,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleState[]>([]);
  const animationRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Build the path waypoints (y-coordinates of each stage center)
  const waypoints = stages
    .filter((s) => s.type !== "filter")
    .map((s) => ({ x: s.x, y: s.y + s.height / 2, color: s.color }));

  // Also add filter center (average) as a waypoint
  const filterStages = stages.filter((s) => s.type === "filter");
  if (filterStages.length > 0) {
    const avgY = filterStages[0].y + filterStages[0].height / 2;
    waypoints.splice(-1, 0, { x: centerX, y: avgY, color: "#8b5cf6" });
  }

  const speed = Math.min(250, 60 + (combinedMultiplier - 1) * 20);
  const spawnInterval = Math.max(200, 800 - activeFactorCount * 100);
  const particleSize = activeFactorCount > 4 ? 8 : 6;
  const trailOpacity = activeFactorCount > 4 ? 0.4 : 0.25;
  const glowRadius = activeFactorCount > 4 ? 4 : 2;

  const spawnParticle = useCallback((): ParticleState => {
    return {
      x: waypoints[0]?.x ?? centerX,
      y: waypoints[0]?.y ?? 0,
      speed,
      size: particleSize,
      color: BASE_COLOR,
      trailOpacity,
      glowRadius,
      history: [],
      stageIndex: 0,
    };
  }, [waypoints, centerX, speed, particleSize, trailOpacity, glowRadius]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let lastTime = performance.now();

    function animate(now: number) {
      if (!running || !ctx || !canvas) return;

      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;

      // Spawn
      if (now - lastSpawnRef.current > spawnInterval) {
        if (particlesRef.current.length < MAX_PARTICLES) {
          particlesRef.current.push(spawnParticle());
        }
        lastSpawnRef.current = now;
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw
      const alive: ParticleState[] = [];
      for (const p of particlesRef.current) {
        // Save history
        p.history.unshift({ x: p.x, y: p.y });
        if (p.history.length > MAX_TRAIL_LENGTH) p.history.pop();

        // Move toward next waypoint
        const target = waypoints[p.stageIndex + 1];
        if (!target) continue; // reached end, remove

        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          // Advance to next waypoint
          p.stageIndex++;
          // Blend color toward stage color
          if (target.color) {
            p.color = lerpColor(p.color, target.color, 0.3);
          }
          if (p.stageIndex >= waypoints.length - 1) {
            // Reached output — color to grade
            p.color = gradeToColor(grade);
            continue; // remove after this frame
          }
        } else {
          const moveX = (dx / dist) * p.speed * dt;
          const moveY = (dy / dist) * p.speed * dt;
          p.x += moveX;
          p.y += moveY;
        }

        // Draw trail
        if (p.history.length > 1) {
          for (let i = 0; i < p.history.length - 1; i++) {
            const alpha = p.trailOpacity * (1 - i / p.history.length);
            const w = p.size * (1 - i / p.history.length);
            ctx.beginPath();
            ctx.moveTo(p.history[i].x, p.history[i].y);
            ctx.lineTo(p.history[i + 1].x, p.history[i + 1].y);
            ctx.strokeStyle = p.color.replace("rgb", "rgba").replace(")", `,${alpha})`);
            ctx.lineWidth = w;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.glowRadius;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        alive.push(p);
      }

      particlesRef.current = alive;
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    // Pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationRef.current);
      } else {
        running = true;
        lastTime = performance.now();
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [prefersReducedMotion, waypoints, spawnInterval, spawnParticle, grade]);

  if (prefersReducedMotion) {
    // Render static dots at each stage center
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={containerWidth}
        height={totalHeight}
        aria-hidden="true"
      >
        {stages
          .filter((s) => s.type !== "filter")
          .map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y + s.height / 2}
              r={4}
              fill="#94a3b8"
              opacity={0.5}
            />
          ))}
      </svg>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={containerWidth}
      height={totalHeight}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/pipeline/particle-system.tsx
git commit -m "feat(pipeline): add Canvas particle system with trails, glow, and reduced-motion fallback"
```

---

### Task 9: Pipeline hover card

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-hover-card.tsx`

- [ ] **Step 1: Implement hover popover**

```typescript
// src/components/methodology/pipeline/pipeline-hover-card.tsx
"use client";

import { useState, useEffect } from "react";
import type { StageLayout } from "./pipeline-types";
import { useMethodology } from "../methodology-provider";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { gaToDisplay } from "@/lib/utils/ga-format";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

interface Props {
  stage: StageLayout | null;
  containerRect: DOMRect | null;
}

export function PipelineHoverCard({ stage, containerRect }: Props) {
  const { selectedGaCalculation, ga } = useMethodology();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!stage) {
      const timer = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, [stage]);

  if (!stage || !visible || !containerRect) return null;

  // Position above the stage
  const left = stage.x;
  const top = stage.y - 10;

  return (
    <div
      className="absolute z-40 pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="rounded-lg border bg-popover p-3 shadow-lg text-xs max-w-[280px] pointer-events-auto">
        <div className="font-medium mb-1">{stage.label}</div>

        {stage.type === "muglu" && (
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Baseline at {gaToDisplay(ga)}: {selectedGaCalculation.baselineRiskPer1000.toFixed(2)} per 1,000
            </p>
            <table className="w-full text-[9px]">
              <tbody>
                {baselineStillbirthCurve.map((p) => (
                  <tr key={p.ga} className="border-t">
                    <td className="py-0.5">{gaToDisplay(p.ga)}</td>
                    <td className="text-right font-mono">{p.riskPer1000.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(stage.type === "gate" || stage.type === "interaction") && (
          <div className="space-y-1">
            {(() => {
              const cleanId = stage.id.replace("gate_", "").replace("interaction_", "");
              const factor = factorMap.get(cleanId);
              if (!factor) return <p className="text-muted-foreground">×{stage.multiplier?.toFixed(2)}</p>;
              return (
                <>
                  <p className="text-muted-foreground">{factor.description}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <EvidenceGradeBadge grade={factor.evidenceGrade} />
                    <span className="text-muted-foreground">
                      R={factor.dataReliability.toFixed(2)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {stage.type === "ci" && (
          <p className="text-muted-foreground">
            {selectedGaCalculation.adjustedRiskCI95[0].toFixed(2)} –{" "}
            {selectedGaCalculation.adjustedRiskCI95[1].toFixed(2)} per 1,000
          </p>
        )}

        {stage.type === "output" && (
          <p className="text-muted-foreground">
            Score: {selectedGaCalculation.confidenceScore.score}/100
          </p>
        )}

        <p className="text-[9px] text-muted-foreground/60 mt-2">
          Click to explore in detail →
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-hover-card.tsx
git commit -m "feat(pipeline): add hover card popover for stage inspection"
```

---

### Task 10: Pipeline mobile fallback

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-mobile.tsx`

- [ ] **Step 1: Implement card-based mobile layout**

```typescript
// src/components/methodology/pipeline/pipeline-mobile.tsx
"use client";

import { useMethodology } from "../methodology-provider";
import { AnimatedNumber } from "../animated-number";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { FILTER_CONFIG, gradeToColor, INTERACTION_COLOR } from "./pipeline-utils";
import { ArrowDownIcon } from "lucide-react";

export function PipelineMobile() {
  const { ga, selectedGaCalculation, stepByStepBreakdown } = useMethodology();
  const { confidenceScore } = selectedGaCalculation;

  return (
    <div className="space-y-2 max-w-md mx-auto">
      {/* Summary bar */}
      <div className="rounded-md border bg-muted/30 p-2 text-center text-xs">
        <span className="text-muted-foreground">Baseline → </span>
        <AnimatedNumber
          value={selectedGaCalculation.adjustedRiskPer1000}
          decimals={2}
          className="font-bold"
        />
        <span className="text-muted-foreground"> /1,000 → </span>
        <span
          className="font-bold"
          style={{ color: gradeToColor(confidenceScore.grade) }}
        >
          Grade {confidenceScore.grade}
        </span>
      </div>

      {/* Muglu */}
      <StageCard
        icon="◉"
        label="Muglu Baseline"
        sublabel={gaToDisplay(ga)}
        value={selectedGaCalculation.baselineRiskPer1000}
        borderColor="var(--primary)"
      />

      {/* Factor gates */}
      {stepByStepBreakdown.map((step) => (
        <div key={step.factorId}>
          <div className="flex justify-center py-1">
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <StageCard
            icon={step.isInteraction ? "↳" : "×"}
            label={step.label}
            sublabel={`×${step.multiplier}`}
            value={step.riskAfter}
            borderColor={step.isInteraction ? INTERACTION_COLOR : step.color}
            dashed={step.isInteraction}
          />
        </div>
      ))}

      {/* CI */}
      <div className="flex justify-center py-1">
        <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <StageCard
        icon="↔"
        label="95% Confidence Interval"
        sublabel={`${selectedGaCalculation.adjustedRiskCI95[0].toFixed(2)} – ${selectedGaCalculation.adjustedRiskCI95[1].toFixed(2)}`}
        borderColor="#8b5cf6"
      />

      {/* Filters */}
      <div className="flex justify-center py-1">
        <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {FILTER_CONFIG.map((fc) => {
          const value = confidenceScore.breakdown[fc.key];
          return (
            <div
              key={fc.abbr}
              className="rounded border text-center py-1 px-0.5"
              style={{ borderColor: fc.color }}
            >
              <div className="text-[8px] font-medium" style={{ color: fc.color }}>
                {fc.abbr}
              </div>
              <div className="font-mono text-[10px]">{value.toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      {/* Output */}
      <div className="flex justify-center py-1">
        <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div
        className="rounded-lg border-2 p-3 text-center"
        style={{
          borderColor: gradeToColor(confidenceScore.grade),
          backgroundColor: `${gradeToColor(confidenceScore.grade)}15`,
        }}
      >
        <div
          className="text-xl font-bold"
          style={{ color: gradeToColor(confidenceScore.grade) }}
        >
          Grade {confidenceScore.grade}
        </div>
        <div className="font-mono text-sm">
          <AnimatedNumber
            value={selectedGaCalculation.adjustedRiskPer1000}
            decimals={2}
          />{" "}
          <span className="text-xs text-muted-foreground">per 1,000</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          Score: {confidenceScore.score}/100
        </div>
      </div>
    </div>
  );
}

function StageCard({
  icon,
  label,
  sublabel,
  value,
  borderColor,
  dashed,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  value?: number;
  borderColor: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-md p-2.5 flex items-center gap-2 ${
        dashed ? "border-2 border-dashed" : "border-2"
      }`}
      style={{ borderColor }}
    >
      <span className="text-lg" style={{ color: borderColor }}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{label}</div>
        {sublabel && (
          <div className="text-[10px] text-muted-foreground">{sublabel}</div>
        )}
      </div>
      {value !== undefined && (
        <div className="font-mono text-xs font-bold shrink-0">
          <AnimatedNumber value={value} decimals={2} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-mobile.tsx
git commit -m "feat(pipeline): add mobile card-based fallback layout"
```

---

### Task 11: Pipeline view container (assembly)

**Files:**
- Create: `src/components/methodology/pipeline/pipeline-view.tsx`

- [ ] **Step 1: Assemble the pipeline view**

```typescript
// src/components/methodology/pipeline/pipeline-view.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { useMethodology } from "../methodology-provider";
import { usePipelineLayout } from "./use-pipeline-layout";
import { PipelineStage } from "./pipeline-stage";
import { PipelineFilters } from "./pipeline-filters";
import { PipelinePipes } from "./pipeline-pipes";
import { ParticleSystem } from "./particle-system";
import { PipelineHoverCard } from "./pipeline-hover-card";
import { PipelineMobile } from "./pipeline-mobile";
import type { StageLayout } from "./pipeline-types";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const SECTION_MAP: Record<string, string> = {
  muglu: "section-baseline",
  gate: "section-multiplication",
  interaction: "section-multiplication",
  ci: "section-ci-propagation",
  filter: "section-confidence",
  output: "section-grade-mapping",
};

export function PipelineView() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [hoveredStage, setHoveredStage] = useState<StageLayout | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const {
    stepByStepBreakdown,
    selectedGaCalculation,
    activeFactorIds,
  } = useMethodology();

  // Measure container
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
          setContainerRect(entry.target.getBoundingClientRect());
        }
      });
      observer.observe(node);
      setContainerWidth(node.offsetWidth);
      setContainerRect(node.getBoundingClientRect());
      containerRef.current = node;
      return () => observer.disconnect();
    }
  }, []);

  const layout = usePipelineLayout({
    containerWidth: Math.min(containerWidth, 800),
    steps: stepByStepBreakdown,
    calc: selectedGaCalculation,
  });

  const combinedMultiplier = stepByStepBreakdown.reduce(
    (acc, s) => acc * s.multiplier,
    1
  );

  const handleStageClick = useCallback(
    (stage: StageLayout) => {
      const sectionId = SECTION_MAP[stage.type];
      if (!sectionId) return;

      router.replace("/methodology?view=explorer", { scroll: false });
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [router]
  );

  return (
    <div className="py-8">
      {/* Screen reader summary */}
      <p className="sr-only">
        Risk flows from baseline ({selectedGaCalculation.baselineRiskPer1000.toFixed(2)} per 1,000)
        through {activeFactorIds.length} factors to adjusted risk (
        {selectedGaCalculation.adjustedRiskPer1000.toFixed(2)} per 1,000) with confidence grade{" "}
        {selectedGaCalculation.confidenceScore.grade}.
      </p>

      {/* Mobile: card-based */}
      <div className="md:hidden">
        <PipelineMobile />
      </div>

      {/* Desktop: SVG + Canvas */}
      <div className="hidden md:block">
        <div
          ref={measureRef}
          className="relative mx-auto"
          style={{ maxWidth: 800 }}
        >
          {/* SVG layer */}
          <svg
            width={Math.min(containerWidth, 800)}
            height={layout.totalHeight}
            className="w-full"
          >
            <PipelinePipes pipes={layout.pipes} />
            <AnimatePresence>
              {layout.stages
                .filter((s) => s.type !== "filter")
                .map((stage) => (
                  <PipelineStage
                    key={stage.id}
                    stage={stage}
                    onHover={setHoveredStage}
                    onClick={handleStageClick}
                  />
                ))}
            </AnimatePresence>
            <PipelineFilters
              filterStages={layout.stages.filter((s) => s.type === "filter")}
              confidence={selectedGaCalculation.confidenceScore}
              onHover={setHoveredStage}
              onClick={handleStageClick}
            />
          </svg>

          {/* Canvas particle layer */}
          <ParticleSystem
            stages={layout.stages}
            centerX={layout.centerX}
            totalHeight={layout.totalHeight}
            combinedMultiplier={combinedMultiplier}
            activeFactorCount={activeFactorIds.length}
            grade={selectedGaCalculation.confidenceScore.grade}
            containerWidth={Math.min(containerWidth, 800)}
          />

          {/* Hover card */}
          <PipelineHoverCard stage={hoveredStage} containerRect={containerRect} />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center mt-8 max-w-md mx-auto">
        This pipeline visualizes the same calculation as the Interactive Explorer.
        Particle speed and density encode risk magnitude. Click any stage to see
        detailed math.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/methodology/pipeline/pipeline-view.tsx
git commit -m "feat(pipeline): assemble pipeline view with SVG + Canvas + mobile fallback"
```

---

### Task 12: Wire pipeline into page content + final integration

**Files:**
- Modify: `src/components/methodology/methodology-page-content.tsx`

- [ ] **Step 1: Replace pipeline placeholder with actual PipelineView**

In `methodology-page-content.tsx`, replace the pipeline placeholder:

```tsx
// Change this:
{activeTab === "pipeline" && (
  <div className="py-8 text-center text-muted-foreground">
    Pipeline view loading...
  </div>
)}

// To this:
{activeTab === "pipeline" && <PipelineView />}
```

Add the import at the top:
```tsx
import { PipelineView } from "./pipeline/pipeline-view";
```

- [ ] **Step 2: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass (existing 92 + new pipeline tests)

- [ ] **Step 3: Run production build**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds, /methodology route present

- [ ] **Step 4: Commit**

```bash
git add src/components/methodology/methodology-page-content.tsx
git commit -m "feat(pipeline): wire pipeline view into methodology page tabs

Complete Phase A implementation:
- Tabbed methodology page (Explorer / Pipeline / Timeline)
- SVG pipeline with animated stages and pipes
- Canvas particle system with trails and glow
- Hover popovers for stage inspection
- Mobile card-based fallback
- WAI-ARIA tabs with keyboard navigation
- Reduced motion support throughout"
```

---

## Chunk 4: Review Fixes — Missing Visual Details and Edge Cases

### Task 13: Pipeline view polish fixes

**Files:**
- Modify: `src/components/methodology/pipeline/pipeline-view.tsx`
- Modify: `src/components/methodology/pipeline/pipeline-stage.tsx`
- Modify: `src/components/methodology/pipeline/pipeline-pipes.tsx`

- [ ] **Step 1: Add "no factors selected" annotation**

In `pipeline-view.tsx`, when `stepByStepBreakdown.length === 0`, render a text annotation between Muglu and CI stages in the SVG:

```tsx
{stepByStepBreakdown.length === 0 && (
  <text
    x={layout.centerX}
    y={(layout.stages[0].y + layout.stages[0].height + layout.stages[1].y) / 2}
    textAnchor="middle"
    className="text-[10px] fill-muted-foreground italic"
  >
    No risk factors selected — showing baseline only
  </text>
)}
```

- [ ] **Step 2: Add calculation error guard**

At the top of `PipelineView`, before layout computation:

```tsx
const isInvalid = isNaN(selectedGaCalculation.adjustedRiskPer1000) ||
  !isFinite(selectedGaCalculation.adjustedRiskPer1000);

if (isInvalid) {
  return (
    <div className="py-12 text-center">
      <p className="text-amber-600 font-medium">Calculation error — showing baseline</p>
      <p className="text-xs text-muted-foreground mt-1">
        The current factor combination produced invalid values. Try removing some factors.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Add CI chamber pulse animation and CI values**

In `pipeline-stage.tsx`'s `CINode`, add framer-motion scale pulse and display CI bounds:

```tsx
function CINode({ stage, calc }: { stage: StageLayout; calc: RiskCalculation }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.foreignObject
      x={stage.x - stage.width / 2}
      y={stage.y}
      width={stage.width}
      height={stage.height}
      animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <div className="h-full rounded-lg border-2 border-violet-400 bg-violet-50/30 dark:bg-violet-950/20 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400">
          95% Confidence Interval
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {calc.adjustedRiskCI95[0].toFixed(2)} – {calc.adjustedRiskCI95[1].toFixed(2)}
        </span>
      </div>
    </motion.foreignObject>
  );
}
```

Pass `calc={selectedGaCalculation}` as a prop from `PipelineView` to `PipelineStage` and through to `CINode`.

- [ ] **Step 4: Add CI output pipe width variation**

In `computePipes` in `use-pipeline-layout.ts`, when creating the pipe from CI to the filter branch, compute width using the spec formula:

```typescript
const ciWidth = calc.adjustedRiskCI95[1] - calc.adjustedRiskCI95[0];
const ciPipeWidth = Math.max(4, Math.min(12, Math.log2(1 + ciWidth * 20) * 3));
```

Use `ciPipeWidth` as `strokeWidth` for the CI-to-filter branch pipes.

- [ ] **Step 5: Add multiplication badge at filter reconvergence**

In `pipeline-filters.tsx` or `pipeline-view.tsx`, add a small badge at the reconvergence point (below the filters, above the output):

```tsx
<foreignObject x={centerX - 15} y={reconvergenceY - 12} width={30} height={24}>
  <div className="flex items-center justify-center h-full text-[8px] font-mono text-muted-foreground bg-background border rounded-full">
    ×
  </div>
</foreignObject>
```

- [ ] **Step 6: Add GA display + AnimatedNumber to MugluNode**

Update `MugluNode` to display GA and use AnimatedNumber:

```tsx
function MugluNode({ stage, ga }: { stage: StageLayout; ga: number }) {
  return (
    <foreignObject ...>
      <div ...>
        <span className="text-[10px] text-muted-foreground">
          Muglu 2019 · {gaToDisplay(ga)}
        </span>
        <AnimatedNumber value={stage.value ?? 0} decimals={2} className="font-mono text-sm font-bold" suffix=" /1,000" />
      </div>
    </foreignObject>
  );
}
```

Pass `ga` from context through `PipelineView` → `PipelineStage` → `MugluNode`.

- [ ] **Step 7: Add OR correction badge to OutputNode**

```tsx
function OutputNode({ stage, orCorrected }: { stage: StageLayout; orCorrected?: number }) {
  return (
    <foreignObject ...>
      <div ...>
        {/* existing grade + risk display */}
        {orCorrected !== undefined && (
          <div className="text-[9px] text-amber-600 font-mono mt-0.5">
            Corrected: {orCorrected.toFixed(2)} /1,000
          </div>
        )}
      </div>
    </foreignObject>
  );
}
```

- [ ] **Step 8: Add tablet responsive breakpoint**

In `pipeline-view.tsx`, add responsive classes for the SVG container:

```tsx
<div
  ref={measureRef}
  className="relative mx-auto lg:max-w-[800px] md:max-w-[90%]"
>
```

And for SVG text elements, use smaller fonts at the md breakpoint. Since SVG text doesn't support Tailwind responsive prefixes directly, use the `containerWidth` value to conditionally set font sizes in the stage components.

- [ ] **Step 9: Run TypeScript + tests + build**

Run: `pnpm exec tsc --noEmit && pnpm vitest run && pnpm build 2>&1 | tail -5`
Expected: All clean

- [ ] **Step 10: Commit**

```bash
git add src/components/methodology/pipeline/
git commit -m "fix(pipeline): add missing visual details, error states, responsive breakpoints

- No-factors annotation between Muglu and CI
- Calculation error guard with fallback
- CI chamber pulse animation + displayed CI bounds
- CI output pipe width variation (log-scaled)
- Multiplication badge at filter reconvergence
- GA display + AnimatedNumber in Muglu node
- OR correction badge in output node
- Tablet responsive breakpoint (768-1024px)"
```
