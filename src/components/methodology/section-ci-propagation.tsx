"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMethodology } from "./methodology-provider";
import { FormulaBlock, FormulaLine, AnimatePresence } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { getFactorColor } from "@/data/methodology/factor-colors";

// ── Variance helpers ──────────────────────────────────────────────────────────

/**
 * Var(ln(RR_i)) = [(ln(CI_upper) - ln(CI_lower)) / (2 × 1.96)]²
 */
function lnVariance(ciLow: number, ciHigh: number): number {
  if (ciLow <= 0 || ciHigh <= 0) return 0;
  return Math.pow((Math.log(ciHigh) - Math.log(ciLow)) / (2 * 1.96), 2);
}

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionCIPropagation() {
  const { ga, activeFactorIds, selectedGaCalculation } = useMethodology();
  const prefersReducedMotion = useReducedMotion();

  const hasFactors = activeFactorIds.length > 0;

  // Closest baseline data point for CI
  const closestBaseline = baselineStillbirthCurve.reduce((prev, curr) =>
    Math.abs(curr.ga - ga) < Math.abs(prev.ga - ga) ? curr : prev
  );

  // Baseline variance
  const baselineVar = lnVariance(closestBaseline.ci95Low, closestBaseline.ci95High);

  // Per-factor variance entries (only active factors with ci95)
  const factorEntries = activeFactorIds
    .map((id) => {
      const factor = riskFactorMultipliers.find((f) => f.id === id);
      if (!factor?.ci95) return null;
      const [ciLow, ciHigh] = factor.ci95;
      const v = lnVariance(ciLow, ciHigh);
      return {
        factorId: id,
        label: factor.label,
        multiplier: factor.multiplier,
        ciLow,
        ciHigh,
        variance: v,
        color: getFactorColor(id).hex,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  // Combined variance, SE, CI
  const totalFactorVar = factorEntries.reduce((sum, e) => sum + e.variance, 0);
  const combinedVar = baselineVar + totalFactorVar;
  const combinedSE = Math.sqrt(combinedVar);

  const adjustedRisk = selectedGaCalculation.adjustedRiskPer1000;
  const lnAdjusted = adjustedRisk > 0 ? Math.log(adjustedRisk) : 0;
  const ciLow = Math.exp(lnAdjusted - 1.96 * combinedSE);
  const ciHigh = Math.exp(lnAdjusted + 1.96 * combinedSE);
  const ciWidth = ciHigh - ciLow;

  // All variance entries for the bar chart (baseline + factors)
  const allEntries = [
    {
      label: "Baseline (Muglu)",
      variance: baselineVar,
      color: "var(--chart-baseline)",
    },
    ...factorEntries.map((e) => ({
      label: e.label,
      variance: e.variance,
      color: e.color,
    })),
  ];

  const totalVar = allEntries.reduce((s, e) => s + e.variance, 0);

  return (
    <section id="section-ci-propagation" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 3 — Quantifying Uncertainty: CI Propagation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each input has its own uncertainty. Quadrature (GUM method) combines
          them on the log scale to produce a valid 95% CI for the adjusted risk.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* CI width visualization */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  95% Confidence Interval — Point Estimate vs. Bounds
                </p>

                {adjustedRisk > 0 ? (
                  <div className="relative py-6">
                    {/* Track */}
                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                      {/* CI fill */}
                      <motion.div
                        className="absolute top-0 h-full rounded-full"
                        style={{ background: "var(--chart-ci)" }}
                        initial={prefersReducedMotion ? false : { left: "50%", right: "50%" }}
                        animate={{
                          left: `${Math.max(0, ((ciLow / ciHigh) * 50))}%`,
                          right: `${Math.max(0, (1 - (ciHigh / (ciHigh * 1.05))) * 100)}%`,
                        }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Point estimate marker */}
                      <motion.div
                        className="absolute top-0 h-full w-1 rounded bg-red-500"
                        style={{ left: "50%" }}
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.3 }}
                      />
                    </div>

                    {/* Animated bounds display */}
                    <div className="mt-4 grid grid-cols-3 text-center text-sm">
                      <div>
                        <motion.p
                          className="font-mono font-semibold text-muted-foreground"
                          key={ciLow.toFixed(2)}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {ciLow.toFixed(2)}
                        </motion.p>
                        <p className="text-xs text-muted-foreground">Lower 95%</p>
                      </div>
                      <div>
                        <motion.p
                          className="font-mono font-bold text-primary text-lg"
                          key={adjustedRisk.toFixed(2)}
                          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {adjustedRisk.toFixed(2)}
                        </motion.p>
                        <p className="text-xs text-muted-foreground">Point estimate</p>
                      </div>
                      <div>
                        <motion.p
                          className="font-mono font-semibold text-muted-foreground"
                          key={ciHigh.toFixed(2)}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {ciHigh.toFixed(2)}
                        </motion.p>
                        <p className="text-xs text-muted-foreground">Upper 95%</p>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      CI width: <span className="font-mono tabular-nums">{ciWidth.toFixed(3)}</span> per 1,000 (all values per 1,000 ongoing pregnancies)
                    </p>
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No risk calculated — select a valid gestational age.
                  </p>
                )}
              </div>

              {/* Per-factor variance contribution bars */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Variance Contributions by Source
                </p>

                {totalVar > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {allEntries.map((entry) => {
                        const pct = totalVar > 0 ? (entry.variance / totalVar) * 100 : 0;
                        return (
                          <motion.div
                            key={entry.label}
                            initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0, x: 12 }}
                            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
                            className="space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="inline-block h-2 w-2 rounded-full"
                                  style={{ background: entry.color }}
                                />
                                <span className="truncate max-w-[180px]">{entry.label}</span>
                              </span>
                              <span className="font-mono text-muted-foreground">
                                {pct.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: entry.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <p className="pt-1 text-right text-xs text-muted-foreground">
                      Total Var(ln) = <span className="font-mono tabular-nums">{totalVar.toFixed(6)}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add risk factors to see variance contributions.
                  </p>
                )}
              </div>
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Quadrature formula */}
              <FormulaBlock title="Quadrature Formula (GUM Standard)" accentColor="border-primary">
                <FormulaLine>Var(ln R_adj) =</FormulaLine>
                <FormulaLine className="ml-4">
                  Var(ln R_baseline) + Σᵢ Var(ln RR_i)
                </FormulaLine>
                <FormulaLine prose className="mt-2">where each:</FormulaLine>
                <FormulaLine className="ml-4">
                  Var(ln RR_i) = [(ln(CI_upper) − ln(CI_lower))]²
                </FormulaLine>
                <FormulaLine className="ml-4 text-xs text-muted-foreground">
                  ÷ (2 × 1.96)²
                </FormulaLine>
                <FormulaLine className="mt-2">
                  SE = √Var(ln R_adj)
                </FormulaLine>
                <FormulaLine>
                  95% CI = exp(ln R_adj ± 1.96 × SE)
                </FormulaLine>
              </FormulaBlock>

              {/* Per-factor variance computation */}
              <FormulaBlock title="Per-Source Variance" accentColor="border-muted">
                {/* Baseline entry — always shown */}
                <FormulaLine>
                  <span className="text-muted-foreground">Baseline (Muglu):</span>
                </FormulaLine>
                <FormulaLine className="ml-4 text-xs">
                  CI: [{closestBaseline.ci95Low.toFixed(2)}, {closestBaseline.ci95High.toFixed(2)}]
                </FormulaLine>
                <FormulaLine className="ml-4 text-xs">
                  Var = {baselineVar.toFixed(6)}
                </FormulaLine>

                <AnimatePresence>
                  {factorEntries.map((entry) => (
                    <motion.div
                      key={entry.factorId}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, x: 8 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                      className="mt-2 space-y-0.5"
                    >
                      <FormulaLine>
                        <span
                          className="inline-block h-2 w-2 rounded-full mr-1 align-middle"
                          style={{ background: entry.color }}
                        />
                        <span style={{ color: entry.color }}>{entry.label}:</span>
                      </FormulaLine>
                      <FormulaLine className="ml-4 text-xs">
                        CI: [{entry.ciLow.toFixed(2)}, {entry.ciHigh.toFixed(2)}]
                      </FormulaLine>
                      <FormulaLine className="ml-4 text-xs">
                        Var = [(ln({entry.ciHigh.toFixed(2)})−ln({entry.ciLow.toFixed(2)})) / 3.92]²
                      </FormulaLine>
                      <FormulaLine className="ml-4 text-xs font-semibold">
                        = {entry.variance.toFixed(6)}
                      </FormulaLine>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Summary */}
                <div className="mt-3 border-t border-muted-foreground/30 pt-2 space-y-1">
                  <FormulaLine>
                    Combined Var = {combinedVar.toFixed(6)}
                  </FormulaLine>
                  <FormulaLine>
                    SE = √{combinedVar.toFixed(6)} = {combinedSE.toFixed(4)}
                  </FormulaLine>
                  <FormulaLine highlight>
                    95% CI: [{ciLow.toFixed(2)}, {ciHigh.toFixed(2)}] / 1,000
                  </FormulaLine>
                </div>
              </FormulaBlock>

              {/* Teaching callout */}
              <TeachingCallout
                summary="GUM standard and metrology — why quadrature?"
                variant="insight"
              >
                <p>
                  The <strong>Guide to the Expression of Uncertainty in
                  Measurement (GUM)</strong>, published by BIPM/ISO, specifies
                  that when a result is a product of independent uncertain
                  quantities, the relative standard uncertainties add in
                  quadrature:
                </p>
                <p className="mt-2 font-mono text-xs bg-muted/50 rounded p-2">
                  u_c²(y) = Σᵢ [∂f/∂xᵢ]² · u²(xᵢ)
                </p>
                <p className="mt-2">
                  On the log scale, multiplication becomes addition, so the partial
                  derivatives are all 1. This means we simply sum the log-scale
                  variances — the standard meta-analytic approach for pooling
                  log-RRs from heterogeneous studies.
                </p>
                <p className="mt-2">
                  The resulting CI correctly reflects that each factor&apos;s
                  confidence interval contributes proportionally to the final
                  uncertainty based on its own width on the log scale.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reference: JCGM 100:2008 (GUM). Also: DerSimonian & Laird
                  (1986) random-effects meta-analysis; Higgins & Thompson (2002).
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}
