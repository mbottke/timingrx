"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMethodology } from "./methodology-provider";
import { FormulaBlock, FormulaLine } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";
import { ScenarioStrip } from "./scenario-strip";
import type { ConfidenceScore } from "@/data/types";

// ── Grade zone definitions ─────────────────────────────────────────────────────
// F=40%, D=15%, C=15%, B=15%, A=15% of the bar width

interface GradeZone {
  grade: ConfidenceScore["grade"];
  label: string;
  widthPct: number;      // percentage of total bar
  minScore: number;      // inclusive lower bound
  maxScore: number;      // inclusive upper bound
  color: string;
  textColor: string;
}

const GRADE_ZONES: GradeZone[] = [
  { grade: "F", label: "F", widthPct: 40, minScore: 0,  maxScore: 39,  color: "#ef4444", textColor: "#fff" },
  { grade: "D", label: "D", widthPct: 15, minScore: 40, maxScore: 54,  color: "#f97316", textColor: "#fff" },
  { grade: "C", label: "C", widthPct: 15, minScore: 55, maxScore: 69,  color: "#f59e0b", textColor: "#fff" },
  { grade: "B", label: "B", widthPct: 15, minScore: 70, maxScore: 84,  color: "#3b82f6", textColor: "#fff" },
  { grade: "A", label: "A", widthPct: 15, minScore: 85, maxScore: 100, color: "#22c55e", textColor: "#fff" },
];

// ── Grade definitions table rows ──────────────────────────────────────────────

const GRADE_DEFINITIONS = [
  { grade: "A", range: "85–100", label: "High confidence",      description: "Strong evidence base, few factors, rare-disease assumption solid" },
  { grade: "B", range: "70–84",  label: "Moderate confidence",  description: "Good evidence with minor model strain or modest risk level" },
  { grade: "C", range: "55–69",  label: "Limited confidence",   description: "Multiple factors or weaker data; estimate directionally useful" },
  { grade: "D", range: "40–54",  label: "Low confidence",       description: "High complexity; wide true uncertainty, use as rough guide only" },
  { grade: "F", range: "0–39",   label: "Very low confidence",  description: "Model at its limits; clinical judgment must take precedence" },
];

const GRADE_COLORS: Record<ConfidenceScore["grade"], string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

// ── scoreToPosition ───────────────────────────────────────────────────────────

/**
 * Maps a score (0–100) to a position (0–100%) on the proportional grade bar.
 * Each zone occupies its widthPct portion of the bar.
 */
function scoreToPosition(score: number): number {
  // Cumulative widths for zone start positions
  let cumulativeWidth = 0;

  for (const zone of GRADE_ZONES) {
    const zoneStart = cumulativeWidth;
    const zoneWidth = zone.widthPct;

    if (score >= zone.minScore && score <= zone.maxScore) {
      const zoneRange = zone.maxScore - zone.minScore;
      const progress = zoneRange > 0 ? (score - zone.minScore) / zoneRange : 0;
      return zoneStart + progress * zoneWidth;
    }

    cumulativeWidth += zoneWidth;
  }

  // Fallback: clamp to full bar
  return Math.min(100, Math.max(0, score));
}

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionGradeMapping() {
  const { selectedGaCalculation } = useMethodology();
  const prefersReducedMotion = useReducedMotion();
  const { confidenceScore } = selectedGaCalculation;
  const { score, grade } = confidenceScore;

  const pointerPosition = scoreToPosition(score);
  const currentGradeColor = GRADE_COLORS[grade];

  const springTransition = prefersReducedMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, stiffness: 160, damping: 22 };

  return (
    <section id="section-grade-mapping" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 6 — Grade Mapping {"&"} Calibration
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How the numeric confidence score maps to a letter grade, and what each
          grade means clinically. Load a scenario to explore the full range.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Horizontal grade bar */}
              <div className="rounded-lg border bg-card p-5 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confidence Grade Bar
                </p>

                {/* Bar with proportional zones */}
                <div className="relative mb-8">
                  <div className="flex h-10 overflow-hidden rounded-lg border">
                    {GRADE_ZONES.map((zone) => (
                      <div
                        key={zone.grade}
                        className="flex items-center justify-center text-xs font-bold"
                        style={{
                          width: `${zone.widthPct}%`,
                          background: zone.color,
                          color: zone.textColor,
                          opacity: zone.grade === grade ? 1 : 0.55,
                          transition: "opacity 0.3s",
                        }}
                      >
                        {zone.label}
                      </div>
                    ))}
                  </div>

                  {/* Score range labels below each zone */}
                  <div className="mt-1 flex text-[11px] text-muted-foreground">
                    {GRADE_ZONES.map((zone) => (
                      <div
                        key={zone.grade}
                        className="flex flex-col items-center"
                        style={{ width: `${zone.widthPct}%` }}
                      >
                        <span>{zone.minScore}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center" style={{ width: 0 }}>
                      <span>100</span>
                    </div>
                  </div>

                  {/* Animated pointer */}
                  <motion.div
                    className="absolute -top-1 flex flex-col items-center"
                    animate={{ left: `${pointerPosition}%` }}
                    transition={springTransition}
                    style={{ transform: "translateX(-50%)", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
                  >
                    {/* Triangle pointer */}
                    <div
                      className="w-0 h-0"
                      style={{
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent",
                        borderTop: "9px solid white",
                      }}
                    />
                    {/* Inner triangle (colored, sits on top of white outline) */}
                    <div
                      className="w-0 h-0 -mt-[9px]"
                      style={{
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: `7px solid ${currentGradeColor}`,
                      }}
                    />
                    {/* Score bubble */}
                    <div
                      className="mt-1 rounded-md px-2.5 py-1 text-xs font-bold font-mono text-white whitespace-nowrap ring-2 ring-white dark:ring-white/80"
                      style={{ background: currentGradeColor }}
                    >
                      {score}
                    </div>
                  </motion.div>
                </div>

                {/* Current grade summary */}
                <div className="mt-2 flex items-center gap-3 rounded-lg border p-3"
                  style={{ borderColor: `${currentGradeColor}50`, background: `${currentGradeColor}0d` }}
                >
                  <span
                    className="text-3xl font-black"
                    style={{ color: currentGradeColor }}
                  >
                    {grade}
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: currentGradeColor }}>
                      {confidenceScore.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Score: <span className="font-mono tabular-nums">{score}</span> / 100
                    </p>
                  </div>
                </div>

                {/* Scenario strip */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Load a scenario
                  </p>
                  <ScenarioStrip />
                </div>
              </div>
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Grade definitions table */}
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                  Grade Definitions
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="px-3 py-2 text-left font-medium">Grade</th>
                      <th className="px-3 py-2 text-center font-medium">Score</th>
                      <th className="px-3 py-2 text-left font-medium">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRADE_DEFINITIONS.map((row) => {
                      const isCurrent = row.grade === grade;
                      const rowColor = GRADE_COLORS[row.grade as ConfidenceScore["grade"]];
                      return (
                        <tr
                          key={row.grade}
                          className={
                            isCurrent
                              ? "font-semibold"
                              : "border-b last:border-0 odd:bg-muted/20"
                          }
                          style={
                            isCurrent
                              ? { background: `${rowColor}18` }
                              : undefined
                          }
                        >
                          <td className="px-3 py-2">
                            <span
                              className="rounded px-1.5 py-0.5 font-bold text-white"
                              style={{ background: rowColor }}
                            >
                              {row.grade}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center font-mono">{row.range}</td>
                          <td className="px-3 py-2">
                            <span className="font-medium">{row.label}</span>
                            <br />
                            <span className="text-muted-foreground font-normal">
                              {row.description}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grade bar proportions formula */}
              <FormulaBlock title="Bar Zone Proportions" accentColor="border-primary">
                <FormulaLine>
                  F zone: 40% of bar (scores 0–39)
                </FormulaLine>
                <FormulaLine>
                  D zone: 15% of bar (scores 40–54)
                </FormulaLine>
                <FormulaLine>
                  C zone: 15% of bar (scores 55–69)
                </FormulaLine>
                <FormulaLine>
                  B zone: 15% of bar (scores 70–84)
                </FormulaLine>
                <FormulaLine>
                  A zone: 15% of bar (scores 85–100)
                </FormulaLine>
                <FormulaLine prose className="text-muted-foreground text-xs mt-2">
                  F occupies more visual space because it spans 40 score points
                  vs 15 for upper grades — calibrated to reflect clinical
                  reality (high confidence is earned, not assumed).
                </FormulaLine>
                <FormulaLine highlight className="mt-1">
                  Current score {score} → position {pointerPosition.toFixed(1)}%
                </FormulaLine>
              </FormulaBlock>

              {/* Teaching callout */}
              <TeachingCallout
                summary="How were grade thresholds calibrated?"
                variant="insight"
              >
                <p>
                  Grade boundaries were set by running all meaningful clinical
                  combinations through the scorer and observing the distribution.
                  Baseline-only (strongest evidence) consistently scores 90–95 →
                  Grade A. Pairs of well-studied factors score 78–84 → Grade B.
                  Three-factor combinations with shared pathophysiology score 55–68
                  → Grade C.
                </p>
                <p className="mt-2">
                  The F zone is wider (40 score points) because very low confidence
                  can arise from many different combinations of penalties — and
                  because the clinical implication (rely on judgment, not the
                  number) is the same throughout that range.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Load the pre-built scenarios above to see the full calibration
                  range from baseline-only (Grade A ≈ 95) through maximum
                  complexity (Grade F ≈ 28).
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}
