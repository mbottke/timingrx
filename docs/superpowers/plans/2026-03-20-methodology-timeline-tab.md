# Methodology Timeline Tab — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive clinical decision timeline tab for the methodology page — a horizontal 37–42w GA timeline with risk curves, cross-GA equivalence markers, playback controls, and a glass-box detail card.

**Architecture:** Seven new files in `src/components/methodology/timeline/`, one modified file. All data flows through the existing `useMethodology()` context — no new engine or data changes. Pure functions and hooks are built first, then UI components composed on top.

**Tech Stack:** React 19, Next.js 16, TypeScript strict, Tailwind v4, shadcn/ui Card/Badge, SVG for chart rendering, CSS keyframes for animations.

**Spec:** `docs/superpowers/specs/2026-03-20-methodology-timeline-tab-design.md`

---

## Chunk 1: Pure Functions & Hooks

### Task 1: Counseling Statement Generator

**Files:**
- Create: `src/components/methodology/timeline/generate-counseling-statement.ts`

Pure function, no React dependencies. Takes risk data, returns a plain-English counseling string.

- [ ] **Step 1: Create the module**

```ts
// src/components/methodology/timeline/generate-counseling-statement.ts
import type { GestationalAgeDays } from "@/data/types";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";

interface CounselingInput {
  ga: GestationalAgeDays;
  baselineRiskPer1000: number;
  adjustedRiskPer1000: number;
  hasFactors: boolean;
  equivalentBaselineWeek: number | null; // week number (37-42) or null
}

export function generateCounselingStatement(input: CounselingInput): string {
  const { weeks } = gaToWeeksAndDays(input.ga);
  const oneInN = Math.round(1000 / input.adjustedRiskPer1000);

  if (!input.hasFactors) {
    return `At ${weeks} weeks without additional risk factors, baseline stillbirth risk is approximately 1 in ${oneInN.toLocaleString()} ongoing pregnancies.`;
  }

  let statement = `At ${weeks} weeks with these risk factors, stillbirth risk is approximately 1 in ${oneInN.toLocaleString()} ongoing pregnancies`;

  if (input.equivalentBaselineWeek !== null) {
    statement += ` — equivalent to an uncomplicated pregnancy at ${input.equivalentBaselineWeek} weeks`;
  }

  statement += ".";

  // Urgency addendum for very high risk
  if (input.adjustedRiskPer1000 >= 5.0) {
    statement += " Consider the urgency of delivery planning.";
  }

  return statement;
}
```

- [ ] **Step 2: Verify build**

Run: `cd "/Users/michaelbottke/Desktop/Family Medicine Residency/Lectures/Post-Dates Risks and Management/timingrx" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/generate-counseling-statement.ts
git commit -m "feat(timeline): add counseling statement generator"
```

---

### Task 2: Cross-GA Equivalence Hook

**Files:**
- Create: `src/components/methodology/timeline/use-timeline-equivalence.ts`

Hook that takes the risk curve and computes cross-GA equivalence mappings. For each week, finds the baseline week whose uncomplicated risk best matches this week's adjusted risk.

- [ ] **Step 1: Create the hook**

```ts
// src/components/methodology/timeline/use-timeline-equivalence.ts
import { useMemo } from "react";
import type { RiskCalculation } from "@/data/types";

export interface EquivalenceMapping {
  /** GA (days) of the adjusted risk point */
  sourceGA: number;
  /** Week number of the matching baseline risk (37-42), or null */
  equivalentBaselineWeek: number | null;
  /** The baseline risk value that matched */
  matchedBaselineRisk: number | null;
}

/**
 * For each point in the risk curve, find which later baseline week
 * has the closest uncomplicated risk to this week's adjusted risk.
 * Only returns a match if:
 * 1. The matched baseline week is at a LATER GA than the source
 * 2. The adjusted risk exceeds the baseline risk at the same GA
 */
export function useTimelineEquivalence(
  riskCurve: RiskCalculation[]
): EquivalenceMapping[] {
  return useMemo(() => {
    // Build baseline lookup: ga (days) → baseline risk
    const baselineByGA = new Map(
      riskCurve.map((pt) => [pt.ga, pt.baselineRiskPer1000])
    );
    const baselineEntries = Array.from(baselineByGA.entries()).sort(
      ([a], [b]) => a - b
    );

    return riskCurve.map((pt) => {
      const adjusted = pt.adjustedRiskPer1000;
      const baseline = pt.baselineRiskPer1000;

      // Only compute equivalence if adjusted > baseline (factors active)
      if (adjusted <= baseline) {
        return { sourceGA: pt.ga, equivalentBaselineWeek: null, matchedBaselineRisk: null };
      }

      // Find the baseline entry at a later GA with the closest risk
      let bestMatch: { ga: number; risk: number; diff: number } | null = null;
      for (const [bGA, bRisk] of baselineEntries) {
        if (bGA <= pt.ga) continue; // must be later
        const diff = Math.abs(bRisk - adjusted);
        if (!bestMatch || diff < bestMatch.diff) {
          bestMatch = { ga: bGA, risk: bRisk, diff };
        }
      }

      if (!bestMatch) {
        return { sourceGA: pt.ga, equivalentBaselineWeek: null, matchedBaselineRisk: null };
      }

      return {
        sourceGA: pt.ga,
        equivalentBaselineWeek: Math.floor(bestMatch.ga / 7),
        matchedBaselineRisk: bestMatch.risk,
      };
    });
  }, [riskCurve]);
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/use-timeline-equivalence.ts
git commit -m "feat(timeline): add cross-GA equivalence hook"
```

---

### Task 3: Playback Hook

**Files:**
- Create: `src/components/methodology/timeline/use-timeline-playback.ts`

State machine for play/pause auto-advance through weeks 37–42.

- [ ] **Step 1: Create the hook**

```ts
// src/components/methodology/timeline/use-timeline-playback.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { GestationalAgeDays } from "@/data/types";
import { w } from "@/data/helpers";

const GA_WEEKS = [w(37), w(38), w(39), w(40), w(41), w(42)] as const;
const SPEEDS = { "1x": 2000, "2x": 1000 } as const;
type PlaybackSpeed = keyof typeof SPEEDS;

interface PlaybackState {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

export function useTimelinePlayback(
  currentGA: GestationalAgeDays,
  setGA: (ga: GestationalAgeDays) => void
): PlaybackState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>("1x");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentIndex = GA_WEEKS.findIndex((g) => g === currentGA);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    // If at the end, restart from 37w
    if (currentGA >= w(42)) {
      setGA(w(37));
    }
    setIsPlaying(true);
  }, [currentGA, setGA]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const stepForward = useCallback(() => {
    const idx = GA_WEEKS.findIndex((g) => g === currentGA);
    if (idx < GA_WEEKS.length - 1) {
      setGA(GA_WEEKS[idx + 1]);
    }
  }, [currentGA, setGA]);

  const stepBackward = useCallback(() => {
    const idx = GA_WEEKS.findIndex((g) => g === currentGA);
    if (idx > 0) {
      setGA(GA_WEEKS[idx - 1]);
    }
  }, [currentGA, setGA]);

  // Auto-advance timer
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setGA((prevGA: GestationalAgeDays) => {
        const idx = GA_WEEKS.findIndex((g) => g === prevGA);
        if (idx >= GA_WEEKS.length - 1) {
          // Reached end — pause
          setIsPlaying(false);
          return prevGA;
        }
        return GA_WEEKS[idx + 1];
      });
    }, SPEEDS[speed]);

    return clearTimer;
  }, [isPlaying, speed, clearTimer, setGA]);

  return { isPlaying, speed, play, pause, togglePlay, setSpeed, stepForward, stepBackward };
}

export { GA_WEEKS };
```

**Note:** The `setGA` function from the methodology provider is created with `useCallback` and is stable, but it dispatches synchronously — it doesn't accept a callback updater like `useState`. We need to track the "next GA" based on a ref instead. Let me fix that:

- [ ] **Step 2: Fix the auto-advance to use a ref for current GA**

Replace the `useEffect` auto-advance block with a version that uses a ref to track currentGA:

```ts
// Replace the auto-advance useEffect with:
const gaRef = useRef(currentGA);
gaRef.current = currentGA;

useEffect(() => {
  clearTimer();
  if (!isPlaying) return;

  timerRef.current = setInterval(() => {
    const idx = GA_WEEKS.findIndex((g) => g === gaRef.current);
    if (idx >= GA_WEEKS.length - 1) {
      setIsPlaying(false);
      return;
    }
    setGA(GA_WEEKS[idx + 1]);
  }, SPEEDS[speed]);

  return clearTimer;
}, [isPlaying, speed, clearTimer, setGA]);
```

And remove the `setGA` callback-updater pattern from step 1.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/methodology/timeline/use-timeline-playback.ts
git commit -m "feat(timeline): add playback state machine hook"
```

---

## Chunk 2: UI Components

### Task 4: TimelinePlayback Controls

**Files:**
- Create: `src/components/methodology/timeline/timeline-playback.tsx`

Control bar with play/pause, current week label, progress dots, speed toggle, keyboard support.

- [ ] **Step 1: Create the component**

```tsx
// src/components/methodology/timeline/timeline-playback.tsx
"use client";

import type { GestationalAgeDays } from "@/data/types";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";
import { GA_WEEKS, useTimelinePlayback } from "./use-timeline-playback";

interface TimelinePlaybackProps {
  currentGA: GestationalAgeDays;
  setGA: (ga: GestationalAgeDays) => void;
}

export function TimelinePlayback({ currentGA, setGA }: TimelinePlaybackProps) {
  const { isPlaying, speed, togglePlay, setSpeed, stepForward, stepBackward } =
    useTimelinePlayback(currentGA, setGA);

  const { weeks, days } = gaToWeeksAndDays(currentGA);
  const currentIndex = GA_WEEKS.indexOf(currentGA as typeof GA_WEEKS[number]);

  return (
    <div
      className="flex items-center justify-center gap-4 py-3"
      role="toolbar"
      aria-label="Timeline playback controls"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); stepForward(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); stepBackward(); }
        else if (e.key === " ") { e.preventDefault(); togglePlay(); }
      }}
      tabIndex={0}
    >
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
        aria-label={isPlaying ? "Pause playback" : "Play timeline"}
      >
        <span className="text-sm">{isPlaying ? "⏸" : "▶"}</span>
      </button>

      {/* Current week */}
      <span className="text-sm font-semibold tabular-nums min-w-[5rem] text-center">
        {weeks}w{days}d
      </span>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {GA_WEEKS.map((ga, i) => (
          <button
            key={ga}
            onClick={() => setGA(ga)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
              i <= currentIndex
                ? "bg-primary scale-100"
                : "bg-muted-foreground/25 scale-90"
            } ${ga === currentGA ? "ring-2 ring-primary/30 scale-110" : ""}`}
            aria-label={`Go to ${Math.floor(ga / 7)} weeks`}
          />
        ))}
      </div>

      {/* Speed toggle */}
      <button
        onClick={() => setSpeed(speed === "1x" ? "2x" : "1x")}
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border"
        aria-label={`Playback speed: ${speed}`}
      >
        {speed}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/timeline-playback.tsx
git commit -m "feat(timeline): add playback controls component"
```

---

### Task 5: TimelineDetailCard

**Files:**
- Create: `src/components/methodology/timeline/timeline-detail-card.tsx`

Glass-box detail card: header, risk summary, factor breakdown, counseling statement.

- [ ] **Step 1: Create the component**

```tsx
// src/components/methodology/timeline/timeline-detail-card.tsx
"use client";

import { useState } from "react";
import type { RiskCalculation, GestationalAgeDays } from "@/data/types";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";
import type { EquivalenceMapping } from "./use-timeline-equivalence";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";
import { generateCounselingStatement } from "./generate-counseling-statement";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Severity → accent color for border-l-4
function severityAccent(riskPer1000: number): string {
  if (riskPer1000 >= 2.0) return "border-l-[var(--risk-high)]";
  if (riskPer1000 >= 1.0) return "border-l-[var(--risk-moderate)]";
  return "border-l-[var(--risk-low)]";
}

// Severity → text color for the adjusted risk value
function severityTextColor(riskPer1000: number): string {
  if (riskPer1000 >= 2.0) return "text-[var(--risk-high)]";
  if (riskPer1000 >= 1.0) return "text-[var(--risk-moderate)]";
  return "text-[var(--risk-low)]";
}

// Confidence grade → color
function gradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: "var(--confidence-a)", B: "var(--confidence-b)",
    C: "var(--confidence-c)", D: "var(--confidence-d)",
    F: "var(--confidence-f)",
  };
  return map[grade] ?? "var(--muted-foreground)";
}

interface TimelineDetailCardProps {
  calc: RiskCalculation;
  breakdown: StepBreakdown[];
  equivalence: EquivalenceMapping | undefined;
  activeFactorCount: number;
}

export function TimelineDetailCard({
  calc, breakdown, equivalence, activeFactorCount,
}: TimelineDetailCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { weeks, days } = gaToWeeksAndDays(calc.ga);
  const hasFactors = activeFactorCount > 0;
  const grade = calc.confidenceScore.grade;
  const score = calc.confidenceScore.score;
  const multiplier = hasFactors
    ? calc.adjustedRiskPer1000 / (calc.baselineRiskPer1000 || 1)
    : 1;

  const counseling = generateCounselingStatement({
    ga: calc.ga,
    baselineRiskPer1000: calc.baselineRiskPer1000,
    adjustedRiskPer1000: calc.adjustedRiskPer1000,
    hasFactors,
    equivalentBaselineWeek: equivalence?.equivalentBaselineWeek ?? null,
  });

  return (
    <Card className={`border-l-4 ${severityAccent(calc.adjustedRiskPer1000)} transition-colors duration-200`}>
      <CardContent className="p-5 space-y-4">
        {/* Row 1: Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold tracking-tight">
              {weeks} weeks {days > 0 ? `${days} days` : ""}
            </h3>
            <Badge
              className="text-xs font-bold"
              style={{ backgroundColor: gradeColor(grade), color: "#fff" }}
            >
              {grade} ({score})
            </Badge>
          </div>
          {equivalence?.equivalentBaselineWeek && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--ga-caution)] text-[var(--ga-caution)] bg-[var(--ga-caution)]/10">
              Risk ≈ {equivalence.equivalentBaselineWeek}w uncomplicated
            </span>
          )}
        </div>

        {/* Row 2: Risk summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Adjusted Risk</p>
            <p className={`text-xl font-bold tabular-nums ${severityTextColor(calc.adjustedRiskPer1000)}`}>
              {calc.adjustedRiskPer1000.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Baseline Risk</p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {calc.baselineRiskPer1000.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">95% CI</p>
            <p className="text-xl font-bold tabular-nums text-muted-foreground">
              {calc.adjustedRiskCI95[0].toFixed(2)}–{calc.adjustedRiskCI95[1].toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
        </div>

        {hasFactors && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs tabular-nums">
              Combined ×{multiplier.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* Row 3: Factor breakdown */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{expanded ? "▼" : "▶"}</span>
            Factor Breakdown ({activeFactorCount} factor{activeFactorCount !== 1 ? "s" : ""})
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5" style={{ transition: "height 150ms ease" }}>
              {breakdown.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-4">
                  No risk factors selected — showing Muglu 2019 baseline only.
                </p>
              ) : (
                breakdown.map((step) => (
                  <div
                    key={step.factorId}
                    className="flex items-center gap-2 text-xs pl-4"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="font-medium">{step.label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      ×{step.multiplier.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground/60 tabular-nums ml-auto">
                      {step.riskBefore.toFixed(2)} → {step.riskAfter.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {calc.orCorrectedRiskPer1000 != null && (
                <div className="flex items-center gap-2 text-xs pl-4 pt-1 border-t">
                  <span className="text-muted-foreground italic">
                    Zhang-Yu OR→RR correction: {calc.orCorrectedRiskPer1000.toFixed(2)}/1,000
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 4: Counseling statement */}
        <p className="text-sm leading-relaxed text-foreground/80 border-t pt-3">
          {counseling}
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/timeline-detail-card.tsx
git commit -m "feat(timeline): add glass-box detail card component"
```

---

### Task 6: TimelineChart

**Files:**
- Create: `src/components/methodology/timeline/timeline-chart.tsx`

Horizontal SVG timeline with baseline curve, adjusted curve + CI band, reference lines, equivalence markers, and clickable week nodes.

- [ ] **Step 1: Create the component**

This is the largest component. Key implementation details:
- SVG viewBox scales to container width (measured with ResizeObserver, same pattern as pipeline-view.tsx)
- Curves use SVG `<path>` with quadratic bezier for smooth interpolation between 6 data points
- Week nodes are `<g>` groups containing a `<circle>` and invisible `<rect>` for larger click target
- Reference lines are horizontal `<line>` elements
- Equivalence markers are dashed `<line>` + `<text>` pairs

```tsx
// src/components/methodology/timeline/timeline-chart.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { RiskCalculation, GestationalAgeDays } from "@/data/types";
import type { EquivalenceMapping } from "./use-timeline-equivalence";
import { GA_WEEKS } from "./use-timeline-playback";

// ── Layout constants ────────────────────────────────────────────────────────
const PADDING = { top: 30, right: 60, bottom: 40, left: 20 };
const CHART_HEIGHT = 200;
const NODE_R = 8;
const NODE_R_ACTIVE = 12;
const REFERENCE_LINES = [1.0, 2.0]; // per 1,000

// ── Helpers ─────────────────────────────────────────────────────────────────

function severityNodeColor(risk: number): string {
  if (risk >= 2.0) return "var(--risk-high)";
  if (risk >= 1.0) return "var(--risk-moderate)";
  return "var(--risk-low)";
}

/** Build a smooth SVG path through data points using cardinal spline approx */
function buildCurvePath(
  points: { x: number; y: number }[]
): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

/** Build closed CI band path (top curve forward, bottom curve backward) */
function buildBandPath(
  topPoints: { x: number; y: number }[],
  bottomPoints: { x: number; y: number }[]
): string {
  if (topPoints.length < 2) return "";
  const forward = buildCurvePath(topPoints);
  // Reverse for the bottom edge
  const rev = [...bottomPoints].reverse();
  let back = `L${rev[0].x},${rev[0].y}`;
  for (let i = 1; i < rev.length; i++) {
    const prev = rev[i - 1];
    const curr = rev[i];
    const cpX = (prev.x + curr.x) / 2;
    back += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
  }
  return forward + back + "Z";
}

// ── Component ───────────────────────────────────────────────────────────────

interface TimelineChartProps {
  riskCurve: RiskCalculation[];
  currentGA: GestationalAgeDays;
  setGA: (ga: GestationalAgeDays) => void;
  equivalences: EquivalenceMapping[];
  isPlaying: boolean;
}

export function TimelineChart({
  riskCurve, currentGA, setGA, equivalences, isPlaying,
}: TimelineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    obs.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => obs.disconnect();
  }, []);

  const hasFactors = riskCurve.some(
    (pt) => pt.adjustedRiskPer1000 !== pt.baselineRiskPer1000
  );

  // Compute scales
  const plotW = width - PADDING.left - PADDING.right;
  const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  // Y scale: max of all visible values (adjusted CI high, or baseline if no factors)
  const maxRisk = useMemo(() => {
    let max = 0;
    for (const pt of riskCurve) {
      max = Math.max(max, pt.baselineRiskPer1000);
      if (hasFactors) {
        max = Math.max(max, pt.adjustedRiskCI95[1]);
      }
    }
    // Round up to next nice number and add 15% headroom
    return max * 1.15;
  }, [riskCurve, hasFactors]);

  const xScale = useCallback(
    (ga: GestationalAgeDays) => {
      const idx = GA_WEEKS.indexOf(ga as typeof GA_WEEKS[number]);
      if (idx === -1) return PADDING.left;
      return PADDING.left + (idx / (GA_WEEKS.length - 1)) * plotW;
    },
    [plotW]
  );

  const yScale = useCallback(
    (risk: number) => {
      return PADDING.top + plotH - (risk / maxRisk) * plotH;
    },
    [plotH, maxRisk]
  );

  // Build curve points
  const baselinePoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga), y: yScale(pt.baselineRiskPer1000),
  }));
  const adjustedPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga), y: yScale(pt.adjustedRiskPer1000),
  }));
  const ciHighPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga), y: yScale(pt.adjustedRiskCI95[1]),
  }));
  const ciLowPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga), y: yScale(pt.adjustedRiskCI95[0]),
  }));

  const handleNodeClick = useCallback(
    (ga: GestationalAgeDays) => setGA(ga),
    [setGA]
  );

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={width}
        height={CHART_HEIGHT}
        className="select-none"
        aria-hidden="true"
      >
        {/* Reference lines */}
        {REFERENCE_LINES.map((val) => {
          const y = yScale(val);
          if (y < PADDING.top || y > PADDING.top + plotH) return null;
          return (
            <g key={`ref-${val}`}>
              <line
                x1={PADDING.left} y1={y}
                x2={width - PADDING.right} y2={y}
                stroke="var(--muted-foreground)"
                strokeWidth={0.5}
                strokeDasharray="4,6"
                opacity={0.4}
              />
              <text
                x={width - PADDING.right + 6} y={y + 3}
                fontSize={9} fill="var(--muted-foreground)" opacity={0.6}
              >
                {val}/1k
              </text>
            </g>
          );
        })}

        {/* CI band (only when factors active) */}
        {hasFactors && (
          <path
            d={buildBandPath(ciHighPoints, ciLowPoints)}
            fill="var(--brand-coral)"
            opacity={0.12}
          />
        )}

        {/* Baseline curve (always) */}
        <path
          d={buildCurvePath(baselinePoints)}
          stroke="var(--primary)"
          strokeWidth={1.5}
          strokeDasharray="6,4"
          fill="none"
        />

        {/* Adjusted curve (only when factors active) */}
        {hasFactors && (
          <path
            d={buildCurvePath(adjustedPoints)}
            stroke="var(--brand-coral)"
            strokeWidth={2.5}
            fill="none"
          />
        )}

        {/* Equivalence markers */}
        {hasFactors && equivalences.map((eq) => {
          if (!eq.equivalentBaselineWeek) return null;
          const sourceX = xScale(eq.sourceGA);
          const targetGA = eq.equivalentBaselineWeek * 7; // approximate
          const targetIdx = GA_WEEKS.findIndex((g) => Math.floor(g / 7) === eq.equivalentBaselineWeek);
          if (targetIdx === -1) return null;
          const targetX = xScale(GA_WEEKS[targetIdx]);
          const sourceRisk = riskCurve.find((pt) => pt.ga === eq.sourceGA);
          if (!sourceRisk) return null;
          const y = yScale(sourceRisk.adjustedRiskPer1000) - 8;
          return (
            <g key={`eq-${eq.sourceGA}`}>
              <line
                x1={sourceX} y1={y} x2={targetX} y2={y}
                stroke="var(--ga-caution)"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <text
                x={(sourceX + targetX) / 2} y={y - 4}
                textAnchor="middle" fontSize={9}
                fill="var(--ga-caution)" fontWeight={500}
              >
                {Math.floor(eq.sourceGA / 7)}w adj ≈ {eq.equivalentBaselineWeek}w base
              </text>
            </g>
          );
        })}

        {/* Selected week hairline */}
        <line
          x1={xScale(currentGA)} y1={PADDING.top}
          x2={xScale(currentGA)} y2={PADDING.top + plotH}
          stroke="var(--foreground)" strokeWidth={1} opacity={0.15}
        />

        {/* Week nodes */}
        {riskCurve.map((pt) => {
          const x = xScale(pt.ga);
          const risk = hasFactors ? pt.adjustedRiskPer1000 : pt.baselineRiskPer1000;
          const y = yScale(risk);
          const isActive = pt.ga === currentGA;
          const r = isActive ? NODE_R_ACTIVE : NODE_R;
          const week = Math.floor(pt.ga / 7);
          return (
            <g key={pt.ga}>
              {/* Invisible larger click target */}
              <rect
                x={x - 20} y={PADDING.top}
                width={40} height={plotH + PADDING.bottom}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(pt.ga)}
              />
              {/* Node circle */}
              <circle
                cx={x} cy={y} r={r}
                fill={severityNodeColor(risk)}
                stroke="var(--background)"
                strokeWidth={isActive ? 3 : 2}
                style={{
                  cursor: "pointer",
                  transition: "r 200ms ease-out, cx 200ms ease-out, cy 200ms ease-out",
                }}
                className={isActive && isPlaying ? "animate-pulse" : ""}
                onClick={() => handleNodeClick(pt.ga)}
              />
              {/* Active ring */}
              {isActive && (
                <circle
                  cx={x} cy={y} r={r + 4}
                  fill="none"
                  stroke={severityNodeColor(risk)}
                  strokeWidth={2}
                  opacity={0.3}
                />
              )}
              {/* Week label */}
              <text
                x={x}
                y={PADDING.top + plotH + 20}
                textAnchor="middle"
                fontSize={isActive ? 12 : 11}
                fontWeight={isActive ? 700 : 400}
                fill={isActive ? "var(--foreground)" : "var(--muted-foreground)"}
              >
                {week}w
              </text>
            </g>
          );
        })}
      </svg>

      {/* SR-only week buttons for accessibility */}
      <div className="sr-only">
        {riskCurve.map((pt) => {
          const week = Math.floor(pt.ga / 7);
          const risk = hasFactors ? pt.adjustedRiskPer1000 : pt.baselineRiskPer1000;
          return (
            <button
              key={pt.ga}
              onClick={() => handleNodeClick(pt.ga)}
              aria-label={`${week} weeks, risk ${risk.toFixed(2)} per 1000`}
            >
              {week} weeks
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/timeline-chart.tsx
git commit -m "feat(timeline): add interactive SVG timeline chart"
```

---

### Task 7: TimelineView (Orchestrator) & Page Integration

**Files:**
- Create: `src/components/methodology/timeline/timeline-view.tsx`
- Modify: `src/components/methodology/methodology-page-content.tsx:88-94`

- [ ] **Step 1: Create TimelineView**

```tsx
// src/components/methodology/timeline/timeline-view.tsx
"use client";

import { useMethodology } from "@/components/methodology/methodology-provider";
import { useTimelineEquivalence } from "./use-timeline-equivalence";
import { TimelineChart } from "./timeline-chart";
import { TimelinePlayback } from "./timeline-playback";
import { TimelineDetailCard } from "./timeline-detail-card";
import { useTimelinePlayback } from "./use-timeline-playback";

export function TimelineView() {
  const {
    ga, setGA, riskCurve, selectedGaCalculation,
    stepByStepBreakdown, activeFactorIds,
  } = useMethodology();

  const equivalences = useTimelineEquivalence(riskCurve);
  const { isPlaying } = useTimelinePlayback(ga, setGA);

  // Find equivalence for current week
  const currentEquivalence = equivalences.find((eq) => eq.sourceGA === ga);

  return (
    <div className="space-y-4">
      {/* Description card */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-1.5">Clinical Decision Timeline</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This timeline shows how stillbirth risk evolves from 37 to 42 weeks
          with your selected risk factors. Click any week to see the full
          breakdown, or press play to watch the risk progression.
          Dashed amber lines show when adjusted risk at an earlier week
          equals baseline risk at a later week — a key counseling insight.
        </p>
      </div>

      {/* Chart */}
      <TimelineChart
        riskCurve={riskCurve}
        currentGA={ga}
        setGA={setGA}
        equivalences={equivalences}
        isPlaying={isPlaying}
      />

      {/* Playback controls */}
      <TimelinePlayback currentGA={ga} setGA={setGA} />

      {/* Detail card */}
      <TimelineDetailCard
        calc={selectedGaCalculation}
        breakdown={stepByStepBreakdown}
        equivalence={currentEquivalence}
        activeFactorCount={activeFactorIds.length}
      />

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto pt-4">
        This timeline illustrates the multiplicative risk model. Cross-GA
        equivalences are approximate. Clinical judgment supersedes all
        calculator output.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Wire into methodology page**

In `src/components/methodology/methodology-page-content.tsx`, replace the "Coming Soon" placeholder (lines 88-94):

Replace:
```tsx
        {activeTab === "timeline" && (
          <div role="tabpanel" aria-label="Timeline view">
            <div className="py-8 text-sm text-muted-foreground">
              Coming Soon
            </div>
          </div>
        )}
```

With:
```tsx
        {activeTab === "timeline" && (
          <div role="tabpanel" aria-label="Timeline view">
            <div className="py-8">
              <TimelineView />
            </div>
          </div>
        )}
```

Add import at top of file:
```tsx
import { TimelineView } from "./timeline/timeline-view";
```

- [ ] **Step 3: Verify full build succeeds**

Run: `npx next build 2>&1 | tail -20`
Expected: All routes build successfully, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/methodology/timeline/timeline-view.tsx src/components/methodology/methodology-page-content.tsx
git commit -m "feat(timeline): wire timeline view into methodology page"
```

---

## Chunk 3: Polish & Accessibility

### Task 8: CSS Animations & Reduced Motion

**Files:**
- Modify: `src/app/globals.css` (add timeline-specific keyframes)

- [ ] **Step 1: Add pulse keyframe for playback node**

Append to `src/app/globals.css` before the `@layer base` block:

```css
/* Timeline playback pulse */
@keyframes timeline-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}

.timeline-node-pulse {
  animation: timeline-pulse 1.2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .timeline-node-pulse {
    animation: none;
  }
}
```

- [ ] **Step 2: Update TimelineChart to use the CSS class**

In `timeline-chart.tsx`, replace:
```tsx
className={isActive && isPlaying ? "animate-pulse" : ""}
```
With:
```tsx
className={isActive && isPlaying ? "timeline-node-pulse" : ""}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/methodology/timeline/timeline-chart.tsx
git commit -m "feat(timeline): add playback pulse animation with reduced-motion support"
```

---

### Task 9: SR-Only Summary & Final Accessibility Pass

**Files:**
- Modify: `src/components/methodology/timeline/timeline-view.tsx`

- [ ] **Step 1: Add SR-only summary paragraph**

In `timeline-view.tsx`, add before the description card:

```tsx
      {/* Screen reader summary */}
      <p className="sr-only">
        Risk timeline from 37 to 42 weeks.
        {activeFactorIds.length > 0
          ? ` Adjusted risk ranges from ${riskCurve[0]?.adjustedRiskPer1000.toFixed(2)} to ${riskCurve[riskCurve.length - 1]?.adjustedRiskPer1000.toFixed(2)} per 1000 with ${activeFactorIds.length} risk factor${activeFactorIds.length !== 1 ? "s" : ""} and confidence grade ${selectedGaCalculation.confidenceScore.grade}.`
          : ` Baseline risk ranges from ${riskCurve[0]?.baselineRiskPer1000.toFixed(2)} to ${riskCurve[riskCurve.length - 1]?.baselineRiskPer1000.toFixed(2)} per 1000.`}
      </p>
```

- [ ] **Step 2: Verify build and test**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/methodology/timeline/timeline-view.tsx
git commit -m "feat(timeline): add screen reader summary for accessibility"
```

---

### Task 10: Final Integration Test

- [ ] **Step 1: Run full build**

Run: `npx next build 2>&1 | tail -30`
Expected: All 208+ routes build successfully with no errors.

- [ ] **Step 2: Manual smoke test checklist**

Open `http://localhost:3000/methodology?view=timeline` and verify:
- [ ] Timeline chart renders with baseline curve
- [ ] Week nodes are clickable — clicking updates detail card
- [ ] Adding risk factors in toolbar updates adjusted curve + CI band
- [ ] Equivalence markers appear between weeks
- [ ] Play button advances through weeks
- [ ] Detail card shows factor breakdown
- [ ] Counseling statement generates correctly
- [ ] Mobile responsive (shrink browser width)

- [ ] **Step 3: Final commit**

```bash
git commit --allow-empty -m "feat(timeline): methodology timeline tab complete"
```
