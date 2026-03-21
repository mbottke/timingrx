"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";
import { useScenarioCompare } from "@/lib/hooks/use-scenario-compare";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { chartColors } from "@/components/charts/chart-theme";
import { ChartGradientDefs } from "@/components/charts/chart-gradient-defs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// ── Category groupings for risk factor pills ────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  maternal: "Maternal",
  fetal: "Fetal",
  obstetric_history: "Obstetric History",
  social_determinant: "Social Determinants",
};

const factorsByCategory = riskFactorMultipliers.reduce<
  Record<string, typeof riskFactorMultipliers>
>((acc, f) => {
  (acc[f.category] ??= []).push(f);
  return acc;
}, {});

// ── Component ────────────────────────────────────────────────────────────────

export default function ScenariosPage() {
  const {
    scenarios,
    addScenario,
    removeScenario,
    updateScenario,
    toggleFactor,
    curves,
  } = useScenarioCompare();

  // Build chart data: merge all scenario curves + baseline into unified data points
  const chartData = useMemo(() => {
    return baselineStillbirthCurve.map((bp, i) => {
      const point: Record<string, unknown> = {
        ga: gaToDisplay(bp.ga),
        baseline: bp.riskPer1000,
      };
      for (const sc of scenarios) {
        const curve = curves.get(sc.id);
        if (curve?.[i]) {
          point[`scenario_${sc.id}`] = curve[i].adjustedRiskPer1000;
        }
      }
      return point;
    });
  }, [scenarios, curves]);

  const maxY = useMemo(() => {
    let max = 0;
    for (const d of chartData) {
      for (const key of Object.keys(d)) {
        if (key === "ga") continue;
        const v = d[key] as number;
        if (v > max) max = v;
      }
    }
    return Math.ceil(max * 1.2 * 10) / 10;
  }, [chartData]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Scenario Comparison
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare up to 4 patient risk profiles side-by-side
        </p>
      </div>

      {/* Scenario cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scenarios.map((sc) => (
          <Card key={sc.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: sc.color }}
                />
                <input
                  type="text"
                  value={sc.name}
                  onChange={(e) =>
                    updateScenario(sc.id, { name: e.target.value })
                  }
                  className="flex-1 bg-transparent text-sm font-semibold outline-none border-b border-transparent focus:border-border"
                />
                {scenarios.length > 1 && (
                  <button
                    onClick={() => removeScenario(sc.id)}
                    className="text-muted-foreground hover:text-destructive text-xs"
                    aria-label={`Remove ${sc.name}`}
                  >
                    &times;
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Interaction toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Apply interactions
                </label>
                <Switch
                  checked={sc.applyInteractions}
                  onCheckedChange={(checked) =>
                    updateScenario(sc.id, { applyInteractions: checked })
                  }
                />
              </div>

              {/* Risk factor pills by category */}
              {Object.entries(factorsByCategory).map(([cat, factors]) => (
                <div key={cat}>
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {factors.map((f) => {
                      const active = sc.factorIds.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          onClick={() => toggleFactor(sc.id, f.id)}
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Add scenario button */}
        {scenarios.length < 4 && (
          <button
            onClick={addScenario}
            className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            <span className="text-sm font-medium">+ Add Scenario</span>
          </button>
        )}
      </div>

      {/* Overlaid chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Stillbirth Risk Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, bottom: 25, left: 20 }}
              >
                <ChartGradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

                <XAxis
                  dataKey="ga"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  label={{
                    value: "Gestational Age",
                    position: "bottom",
                    offset: 5,
                    fill: chartColors.text,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  domain={[0, maxY]}
                  width={55}
                >
                  <Label
                    value="Stillbirth per 1,000"
                    angle={-90}
                    position="center"
                    dx={-18}
                    fill={chartColors.text}
                    fontSize={11}
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-md text-xs space-y-1">
                        <p className="font-semibold font-mono">{d.ga}</p>
                        <p className="text-muted-foreground">
                          Baseline:{" "}
                          <span className="font-mono tabular-nums">
                            {Number(d.baseline).toFixed(2)}
                          </span>{" "}
                          per 1,000
                        </p>
                        {scenarios.map((sc) => {
                          const val = d[`scenario_${sc.id}`] as
                            | number
                            | undefined;
                          if (val == null) return null;
                          return (
                            <p key={sc.id} style={{ color: sc.color }}>
                              {sc.name}:{" "}
                              <span className="font-mono tabular-nums">
                                {val.toFixed(2)}
                              </span>{" "}
                              per 1,000
                            </p>
                          );
                        })}
                      </div>
                    );
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={30}
                  formatter={(value: string) => {
                    if (value === "baseline") return "Baseline";
                    const scId = value.replace("scenario_", "");
                    const sc = scenarios.find((s) => s.id === scId);
                    return sc?.name ?? value;
                  }}
                />

                {/* Baseline dashed gray */}
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={{ fill: "#9ca3af", r: 2 }}
                  name="baseline"
                />

                {/* Scenario curves */}
                {scenarios.map((sc) => (
                  <Line
                    key={sc.id}
                    type="monotone"
                    dataKey={`scenario_${sc.id}`}
                    stroke={sc.color}
                    strokeWidth={2.5}
                    dot={{ fill: sc.color, r: 3, strokeWidth: 2, stroke: "var(--background)" }}
                    name={`scenario_${sc.id}`}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
