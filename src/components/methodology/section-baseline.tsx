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
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useReducedMotion } from "framer-motion";
import { useMethodology } from "./methodology-provider";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock, FormulaLine } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { chartColors } from "@/components/charts/chart-theme";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { w } from "@/data/helpers";

// ── Chart data ────────────────────────────────────────────────────────────────

const chartData = baselineStillbirthCurve.map((pt) => ({
  ga: gaToDisplay(pt.ga),
  gaWeek: Math.floor(pt.ga / 7),
  risk: pt.riskPer1000,
  ciLow: pt.ci95Low,
  ciHigh: pt.ci95High,
}));

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionBaseline() {
  const { ga, selectedGaCalculation } = useMethodology();
  const prefersReducedMotion = useReducedMotion();

  const gaDisplay = gaToDisplay(ga);
  const gaWeek = Math.floor(ga / 7);

  // Find closest baseline point for current GA
  const closestPoint = baselineStillbirthCurve.reduce((prev, curr) =>
    Math.abs(curr.ga - ga) < Math.abs(prev.ga - ga) ? curr : prev
  );

  const baselineRisk = selectedGaCalculation.baselineRiskPer1000;

  return (
    <section id="section-baseline" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 1 — The Foundation: Muglu Baseline Curve
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Prospective stillbirth risk per 1,000 ongoing pregnancies at start of
          each week (Muglu et al., PLOS Medicine 2019; n ≈ 15 million).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Baseline Stillbirth Risk by Gestational Age
                </p>
                <div className="w-full" style={{ height: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 30, left: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartColors.grid}
                      />

                      {/* Risk zone shading */}
                      <ReferenceArea
                        x1="37w0d"
                        x2="39w0d"
                        fill={chartColors.safe}
                        fillOpacity={1}
                      />
                      <ReferenceArea
                        x1="39w0d"
                        x2="41w0d"
                        fill={chartColors.caution}
                        fillOpacity={1}
                      />
                      <ReferenceArea
                        x1="41w0d"
                        x2="42w0d"
                        fill={chartColors.danger}
                        fillOpacity={1}
                      />

                      {/* Current GA reference line */}
                      <ReferenceLine
                        x={gaDisplay}
                        stroke={chartColors.adjusted}
                        strokeDasharray="5 3"
                        strokeWidth={2}
                        label={{
                          value: gaDisplay,
                          position: "top",
                          fill: chartColors.adjusted,
                          fontSize: 11,
                        }}
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
                            <div className="rounded-lg border bg-card p-3 text-xs shadow-md space-y-1">
                              <p className="font-semibold">{d.ga}</p>
                              <p className="text-muted-foreground">
                                Risk: <span className="font-mono tabular-nums">{d.risk.toFixed(2)}</span> / 1,000
                              </p>
                              <p className="text-muted-foreground">
                                95% CI: <span className="font-mono tabular-nums">{d.ciLow.toFixed(2)}–{d.ciHigh.toFixed(2)}</span>
                              </p>
                            </div>
                          );
                        }}
                      />

                      {/* CI band: two-area approach so band shows between ciLow and ciHigh */}
                      <Area
                        type="monotone"
                        dataKey="ciHigh"
                        stroke="none"
                        fill={chartColors.ci}
                        fillOpacity={0.4}
                        isAnimationActive={!prefersReducedMotion}
                      />
                      <Area
                        type="monotone"
                        dataKey="ciLow"
                        stroke="none"
                        fill="var(--card)"
                        fillOpacity={1}
                        isAnimationActive={!prefersReducedMotion}
                      />

                      {/* Risk line */}
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke={chartColors.baseline}
                        strokeWidth={2.5}
                        dot={{ fill: chartColors.baseline, r: 4 }}
                        name="Baseline risk"
                        isAnimationActive={!prefersReducedMotion}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Zone legend */}
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded bg-[var(--ga-safe)] opacity-40" />
                    37–39w (lower risk)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded bg-[var(--ga-caution)] opacity-40" />
                    39–41w (caution zone)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded bg-[var(--ga-danger)] opacity-40" />
                    41–42w (higher risk)
                  </span>
                </div>
              </div>
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Prospective risk formula */}
              <FormulaBlock title="Prospective Risk Formula" accentColor="border-primary">
                <FormulaLine>Prospective risk (week W) =</FormulaLine>
                <FormulaLine className="ml-4">
                  Stillbirths at week W
                </FormulaLine>
                <FormulaLine className="ml-4 border-t border-muted-foreground/30 pt-1">
                  ─────────────────────────
                </FormulaLine>
                <FormulaLine className="ml-4">
                  Ongoing pregnancies at start of week W
                </FormulaLine>
                <FormulaLine prose className="mt-2 text-muted-foreground text-xs">
                  × 1,000 → risk per 1,000 ongoing pregnancies
                </FormulaLine>
              </FormulaBlock>

              {/* Data table */}
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                  Muglu 2019 — Data by Week
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left font-medium">GA</th>
                      <th className="px-4 py-2 text-right font-medium">Risk / 1,000</th>
                      <th className="px-4 py-2 text-right font-medium">95% CI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baselineStillbirthCurve.map((pt) => {
                      const isCurrentWeek = Math.floor(pt.ga / 7) === gaWeek;
                      return (
                        <tr
                          key={pt.ga}
                          className={
                            isCurrentWeek
                              ? "bg-primary/10 font-semibold"
                              : "border-b last:border-0 odd:bg-muted/20"
                          }
                        >
                          <td className="px-4 py-2">{gaToDisplay(pt.ga)}</td>
                          <td className="px-4 py-2 text-right font-mono">
                            {pt.riskPer1000.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                            {pt.ci95Low.toFixed(2)}–{pt.ci95High.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Animated current GA risk */}
              <div className="rounded-lg border bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Baseline risk at {gaDisplay}
                </p>
                <p className="text-3xl font-bold font-mono tabular-nums text-primary">
                  <AnimatedNumber
                    value={baselineRisk}
                    decimals={2}
                    suffix=" / 1,000"
                    stiffness={prefersReducedMotion ? 10000 : 200}
                  />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  95% CI: <span className="font-mono tabular-nums">{closestPoint.ci95Low.toFixed(2)}–{closestPoint.ci95High.toFixed(2)}</span>
                </p>
              </div>

              {/* Teaching callout */}
              <TeachingCallout
                summary="Why use a 'fetuses-at-risk' denominator?"
                variant="insight"
              >
                <p>
                  Traditional stillbirth rates use total births as the denominator,
                  which underestimates risk at later gestational ages. The{" "}
                  <strong>fetuses-at-risk method</strong> (Smith 2001) uses only
                  pregnancies that have not yet delivered at the start of a given
                  week.
                </p>
                <p className="mt-2">
                  This means the 42-week rate (≈ 3.18/1,000) is not the weekly
                  incidence of a rare event — it is the prospective risk{" "}
                  <em>facing a patient who is still pregnant at 42w0d</em>. This
                  framing directly supports shared decision-making about induction
                  timing.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reference: Smith GCS. Lancet 2001; 357:1467–71. Muglu et al.
                  PLOS Med 2019; 16:e1002838.
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}
