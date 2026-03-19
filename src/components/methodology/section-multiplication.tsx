"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useReducedMotion } from "framer-motion";
import { useMethodology } from "./methodology-provider";
import { FormulaBlock, FormulaLine, AnimatePresence } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { chartColors } from "@/components/charts/chart-theme";
import { gaToDisplay } from "@/lib/utils/ga-format";

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionMultiplication() {
  const { riskCurve, activeFactorIds, stepByStepBreakdown, selectedGaCalculation } =
    useMethodology();
  const prefersReducedMotion = useReducedMotion();

  const hasFactors = activeFactorIds.length > 0;

  // Build chart data merging baseline and adjusted curves
  const chartData = riskCurve.map((point, i) => ({
    ga: gaToDisplay(point.ga),
    baseline: baselineStillbirthCurve[i]?.riskPer1000 ?? 0,
    adjusted: point.adjustedRiskPer1000,
    ciLow: point.adjustedRiskCI95[0],
    ciHigh: point.adjustedRiskCI95[1],
  }));

  const maxY = Math.max(
    ...chartData.map((d) => d.ciHigh),
    ...chartData.map((d) => d.adjusted),
    ...chartData.map((d) => d.baseline)
  );
  const yMax = Math.ceil(maxY * 1.2 * 10) / 10;

  const finalAdjustedRisk = selectedGaCalculation.adjustedRiskPer1000;

  return (
    <section id="section-multiplication" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 2 — Multiplying Risk: The Factor Model
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each risk factor multiplies the running cumulative risk. Toggle
          factors in the toolbar above to see the cascade.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Baseline vs. Adjusted Risk Curve
                </p>
                <div className="w-full" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 30, left: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartColors.grid}
                      />
                      <XAxis
                        dataKey="ga"
                        tick={{ fill: chartColors.text, fontSize: 11 }}
                        label={{
                          value: "Gestational Age",
                          position: "bottom",
                          offset: 10,
                          fill: chartColors.text,
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        tick={{ fill: chartColors.text, fontSize: 11 }}
                        domain={[0, yMax]}
                        label={{
                          value: "Stillbirth per 1,000",
                          angle: -90,
                          position: "insideLeft",
                          offset: 15,
                          fill: chartColors.text,
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0]?.payload as (typeof chartData)[0];
                          if (!d) return null;
                          return (
                            <div className="rounded-lg border bg-background p-3 text-xs shadow-md space-y-1">
                              <p className="font-medium">{d.ga}</p>
                              <p className="text-muted-foreground">
                                Baseline: {d.baseline.toFixed(2)} / 1,000
                              </p>
                              {hasFactors && (
                                <>
                                  <p style={{ color: chartColors.adjusted }} className="font-medium">
                                    Adjusted: {d.adjusted.toFixed(2)} / 1,000
                                  </p>
                                  <p className="text-muted-foreground">
                                    95% CI: {d.ciLow.toFixed(2)}–{d.ciHigh.toFixed(2)}
                                  </p>
                                </>
                              )}
                            </div>
                          );
                        }}
                      />

                      {/* CI band when factors active */}
                      {hasFactors && (
                        <Area
                          type="monotone"
                          dataKey="ciHigh"
                          stroke="none"
                          fill={chartColors.ci}
                          fillOpacity={1}
                          isAnimationActive={!prefersReducedMotion}
                          legendType="none"
                        />
                      )}

                      {/* Baseline (dashed when factors active) */}
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke={chartColors.baseline}
                        strokeWidth={hasFactors ? 1.5 : 2.5}
                        strokeDasharray={hasFactors ? "6 3" : undefined}
                        dot={{ fill: chartColors.baseline, r: hasFactors ? 2 : 4 }}
                        name="Baseline"
                        isAnimationActive={!prefersReducedMotion}
                      />

                      {/* Adjusted curve */}
                      {hasFactors && (
                        <Line
                          type="monotone"
                          dataKey="adjusted"
                          stroke={chartColors.adjusted}
                          strokeWidth={2.5}
                          dot={{
                            fill: chartColors.adjusted,
                            r: 4,
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          name="Adjusted"
                          isAnimationActive={!prefersReducedMotion}
                        />
                      )}

                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="line"
                        wrapperStyle={{ fontSize: 11, color: chartColors.text }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Factor legend */}
                {hasFactors && stepByStepBreakdown.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stepByStepBreakdown.map((step) => (
                      <span
                        key={step.factorId}
                        className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium"
                        style={{
                          borderColor: step.color,
                          color: step.color,
                        }}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: step.color }}
                        />
                        {step.isInteraction ? "↳ " : ""}
                        {step.label}
                        <span className="opacity-70">×{step.multiplier.toFixed(2)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {hasFactors ? (
                <FormulaBlock
                  title="Step-by-Step Multiplication"
                  accentColor="border-primary"
                >
                  {/* Baseline line — always shown */}
                  <FormulaLine>
                    <span className="text-muted-foreground">Baseline:</span>{" "}
                    {selectedGaCalculation.baselineRiskPer1000.toFixed(2)} / 1,000
                  </FormulaLine>

                  <AnimatePresence>
                    {stepByStepBreakdown.map((step, idx) => (
                      <FormulaLine
                        key={step.factorId}
                        className={step.isInteraction ? "italic" : undefined}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                          style={{ background: step.color }}
                        />
                        {step.isInteraction ? "↳ " : ""}
                        <span style={{ color: step.color }}>{step.label}</span>
                        {" "}
                        <span className="text-muted-foreground">
                          ({step.riskBefore.toFixed(2)} × {step.multiplier.toFixed(2)} ={" "}
                          {step.riskAfter.toFixed(2)})
                        </span>
                        {idx === stepByStepBreakdown.length - 1 && (
                          <span className="ml-1 text-primary font-bold">← step {idx + 1}</span>
                        )}
                      </FormulaLine>
                    ))}
                  </AnimatePresence>

                  {/* Separator + final result */}
                  <div className="border-t border-muted-foreground/30 mt-2 pt-2">
                    <FormulaLine highlight>
                      Adjusted risk:{" "}
                      {finalAdjustedRisk.toFixed(2)} / 1,000
                    </FormulaLine>
                    <FormulaLine className="text-xs text-muted-foreground mt-1">
                      Combined multiplier:{" "}
                      {(finalAdjustedRisk / selectedGaCalculation.baselineRiskPer1000).toFixed(2)}×
                    </FormulaLine>
                  </div>
                </FormulaBlock>
              ) : (
                /* Empty state */
                <div className="rounded-lg border border-dashed border-muted-foreground/40 p-8 text-center text-sm text-muted-foreground">
                  <p className="font-medium">No risk factors active</p>
                  <p className="mt-1 text-xs">
                    Toggle risk factors in the toolbar above to see the
                    step-by-step multiplication cascade here.
                  </p>
                </div>
              )}

              {/* Teaching callout — always expanded */}
              <TeachingCallout
                summary="Why multiply rather than add risk factors?"
                variant="insight"
                alwaysExpanded
              >
                <p>
                  The <strong>multiplicative model</strong> treats each risk factor
                  as a relative risk that scales proportionally against the
                  current cumulative risk. This is the standard approach in
                  meta-analytic risk modeling and matches the published adjusted
                  odds ratios / relative risks for each factor.
                </p>
                <p className="mt-2">
                  Additive models would assume risk factors are independent on an
                  absolute scale, which is biologically implausible. Multiplication
                  on the log scale (i.e., adding log-RRs) corresponds to the
                  assumption that factors act independently on the multiplicative
                  scale — a much more defensible default.
                </p>
                <p className="mt-2">
                  <strong>Limitation:</strong> True effect modification (synergy or
                  antagonism between factors) is captured separately via the
                  interaction toggle, which applies an additional multiplier for
                  well-documented factor pairs.
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}
