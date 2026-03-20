"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useMethodology } from "./methodology-provider";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock, FormulaLine } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";

// ── Threshold table config ─────────────────────────────────────────────────────

interface ThresholdRow {
  range: string;
  rpValue: string;
  interpretation: string;
  minPct: number; // inclusive lower bound %
  maxPct: number; // exclusive upper bound % (use Infinity for last)
}

const THRESHOLD_ROWS: ThresholdRow[] = [
  {
    range: "< 1%",
    rpValue: "1.00",
    interpretation: "OR ≈ RR — rare disease assumption holds",
    minPct: 0,
    maxPct: 1,
  },
  {
    range: "1 – 5%",
    rpValue: "0.95",
    interpretation: "Mild divergence — Zhang & Yu correction modest",
    minPct: 1,
    maxPct: 5,
  },
  {
    range: "5 – 10%",
    rpValue: "0.88",
    interpretation: "Moderate divergence — correction meaningful",
    minPct: 5,
    maxPct: 10,
  },
  {
    range: "10 – 20%",
    rpValue: "0.78",
    interpretation: "Substantial divergence — use corrected estimate",
    minPct: 10,
    maxPct: 20,
  },
  {
    range: "> 20%",
    rpValue: "0.65",
    interpretation: "Severe divergence — OR is a significant overestimate",
    minPct: 20,
    maxPct: Infinity,
  },
];

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionOrCorrection() {
  const { selectedGaCalculation, activeFactorIds } = useMethodology();
  const prefersReducedMotion = useReducedMotion();

  const {
    adjustedRiskPer1000,
    baselineRiskPer1000,
    orCorrectedRiskPer1000,
  } = selectedGaCalculation;

  // Trigger: combined risk ≥1% AND at least one factor active
  const adjustedPct = adjustedRiskPer1000 / 10; // per1000 → percent
  const hasFactors = activeFactorIds.length > 0;
  const triggered = adjustedPct >= 1 && hasFactors;

  // Combined multiplier (OR estimate)
  const combinedMultiplier =
    baselineRiskPer1000 > 0
      ? adjustedRiskPer1000 / baselineRiskPer1000
      : 1;

  // Divergence %: how much OR-based estimate exceeds corrected estimate
  const correctedRisk = orCorrectedRiskPer1000 ?? adjustedRiskPer1000;
  const divergencePct =
    adjustedRiskPer1000 > 0
      ? ((adjustedRiskPer1000 - correctedRisk) / adjustedRiskPer1000) * 100
      : 0;

  // Current row in threshold table
  const currentRow = THRESHOLD_ROWS.find(
    (row) => adjustedPct >= row.minPct && adjustedPct < row.maxPct
  );

  // Bar widths for comparison (normalize to OR-based = 100%)
  const correctedBarWidth =
    adjustedRiskPer1000 > 0
      ? (correctedRisk / adjustedRiskPer1000) * 100
      : 100;

  // Threshold bar: position of current risk on 0–2% scale (clamp)
  const thresholdBarPct = Math.min((adjustedPct / 2) * 100, 100);

  const springTransition = prefersReducedMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 18 };

  return (
    <section id="section-or-correction" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 5 — The Safety Net: OR → RR Correction
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          When combined risk exceeds 1%, the odds ratio overestimates relative
          risk. Zhang {"&"} Yu (1998) correction is applied automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              {!triggered ? (
                /* ── Safe state ─────────────────────────────────────────── */
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Rare-disease assumption holds
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Combined risk is below the 1% threshold — OR ≈ RR, no
                        correction needed.
                      </p>
                    </div>
                  </div>

                  {/* Threshold bar */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>0%</span>
                      <span className="font-medium text-amber-500">1% threshold</span>
                      <span>2%+</span>
                    </div>
                    <div className="relative h-4 rounded-full bg-muted overflow-hidden border">
                      {/* Green safe zone (0–50% = 0–1%) */}
                      <div
                        className="absolute left-0 top-0 bottom-0 rounded-l-full bg-emerald-200 dark:bg-emerald-900/40"
                        style={{ width: "50%" }}
                      />
                      {/* Threshold line at 50% */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: "50%" }} />
                      {/* Current risk pointer */}
                      <motion.div
                        className="absolute top-0 bottom-0 w-1 rounded-full bg-primary"
                        animate={{ left: `${Math.min(thresholdBarPct / 2, 100)}%` }}
                        transition={springTransition}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Current:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {adjustedPct.toFixed(2)}%
                      </span>
                      {" "}(1% line at center)
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Triggered state ─────────────────────────────────────── */
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-700 dark:text-amber-400">
                        OR → RR correction applied
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Combined risk <span className="font-mono tabular-nums">{adjustedPct.toFixed(2)}%</span> exceeds 1% threshold.
                        Zhang {"&"} Yu corrected estimate shown.
                      </p>
                    </div>
                  </div>

                  {/* Divergence badge */}
                  <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-center">
                    <p className="text-xs text-muted-foreground">OR overestimates by</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      <AnimatedNumber
                        value={divergencePct}
                        decimals={1}
                        suffix="%"
                        stiffness={prefersReducedMotion ? 10000 : 200}
                      />
                    </p>
                  </div>

                  {/* Comparison bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">OR-based (raw)</span>
                        <span className="font-mono font-medium">
                          {adjustedRiskPer1000.toFixed(2)} / 1,000
                        </span>
                      </div>
                      <div className="h-5 rounded bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded bg-rose-400 dark:bg-rose-500"
                          animate={{ width: "100%" }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Zhang {"&"} Yu corrected
                        </span>
                        <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          {correctedRisk.toFixed(2)} / 1,000
                        </span>
                      </div>
                      <div className="h-5 rounded bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded bg-emerald-400 dark:bg-emerald-600"
                          animate={{ width: `${correctedBarWidth}%` }}
                          transition={springTransition}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Zhang & Yu formula */}
              <FormulaBlock title="Zhang & Yu (1998) Correction" accentColor="border-amber-500">
                <FormulaLine>RR = OR / [(1 − P₀) + (P₀ × OR)]</FormulaLine>
                <FormulaLine prose className="text-xs text-muted-foreground mt-1">
                  P₀ = baseline risk proportion
                </FormulaLine>
                <FormulaLine prose className="text-xs text-muted-foreground">
                  OR = combined odds ratio (product of factor ORs)
                </FormulaLine>
                {triggered && (
                  <>
                    <div className="my-2 border-t border-muted-foreground/20" />
                    <FormulaLine className="text-xs text-muted-foreground">
                      P₀ = {(baselineRiskPer1000 / 1000).toFixed(5)} (
                      {baselineRiskPer1000.toFixed(3)} / 1,000)
                    </FormulaLine>
                    <FormulaLine className="text-xs text-muted-foreground">
                      OR = {combinedMultiplier.toFixed(3)} (combined multiplier)
                    </FormulaLine>
                    <FormulaLine className="text-xs text-muted-foreground">
                      Denominator = (1 − {(baselineRiskPer1000 / 1000).toFixed(5)}) +{" "}
                      ({(baselineRiskPer1000 / 1000).toFixed(5)} × {combinedMultiplier.toFixed(3)})
                    </FormulaLine>
                    <FormulaLine highlight className="mt-1">
                      RR ≈ {(correctedRisk / (baselineRiskPer1000 || 1)).toFixed(3)} →{" "}
                      <AnimatedNumber
                        value={correctedRisk}
                        decimals={2}
                        suffix=" / 1,000"
                        stiffness={prefersReducedMotion ? 10000 : 200}
                      />
                    </FormulaLine>
                  </>
                )}
                {!triggered && (
                  <FormulaLine prose className="text-xs text-muted-foreground mt-1">
                    Correction not triggered (combined risk {"<"} 1%)
                  </FormulaLine>
                )}
              </FormulaBlock>

              {/* Threshold table */}
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                  OR→RR Divergence by Risk Level
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="px-3 py-2 text-left font-medium">Risk level</th>
                      <th className="px-3 py-2 text-center font-medium">RP factor</th>
                      <th className="px-3 py-2 text-left font-medium">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {THRESHOLD_ROWS.map((row) => {
                      const isCurrent = row === currentRow;
                      return (
                        <tr
                          key={row.range}
                          className={
                            isCurrent
                              ? "bg-primary/10 font-semibold"
                              : "border-b last:border-0 odd:bg-muted/20"
                          }
                        >
                          <td className="px-3 py-2 font-mono">{row.range}</td>
                          <td className="px-3 py-2 text-center font-mono">{row.rpValue}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {isCurrent ? (
                              <span className="text-foreground">{row.interpretation}</span>
                            ) : (
                              row.interpretation
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Teaching callout */}
              <TeachingCallout
                summary="Why does the OR overestimate risk when outcomes aren't rare?"
                variant="insight"
              >
                <p>
                  Odds ratios equal relative risks only when the outcome is rare
                  (typically &lt;10%, but the divergence becomes clinically relevant
                  above ~1%). For stillbirth at baseline this holds — but when
                  multiple high-multiplier risk factors are combined, the{" "}
                  <em>adjusted</em> risk can exceed 1%.
                </p>
                <p className="mt-2">
                  The <strong>Zhang {"&"} Yu (1998)</strong> formula converts the
                  combined OR back to an approximate RR using the baseline prevalence
                  as the referent. This is the same method used in meta-analyses when
                  RR is the target but only OR data are available.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reference: Zhang J, Yu KF. What&apos;s the relative risk? A method
                  of correcting the odds ratio in cohort studies of common outcomes.
                  JAMA. 1998;280(19):1690–1.
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}
