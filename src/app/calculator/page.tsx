"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCalculator } from "@/lib/hooks/use-calculator";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { PresetSelector } from "@/components/calculator/preset-selector";
import { GlassBoxDisplay } from "@/components/calculator/glass-box-display";
import { StillbirthRiskCurve } from "@/components/charts/stillbirth-risk-curve";
import { MortalityCrossoverChart } from "@/components/charts/mortality-crossover-chart";
import { NNTPanel } from "@/components/calculator/nnt-panel";
import { RiskContextPanel } from "@/components/calculator/risk-context-panel";
import { ConditionRecommendations } from "@/components/calculator/condition-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type ChartSize = "small" | "medium" | "large" | "fullscreen";

const sizeHeights: Record<Exclude<ChartSize, "fullscreen">, string> = {
  small: "250px",
  medium: "350px",
  large: "500px",
};

const sizeLabels: { value: ChartSize; label: string }[] = [
  { value: "small", label: "S" },
  { value: "medium", label: "M" },
  { value: "large", label: "L" },
  { value: "fullscreen", label: "FS" },
];

export default function CalculatorPage() {
  const {
    state,
    setGA,
    toggleFactor,
    setFactors,
    setApplyInteractions,
    loadPreset,
    currentRisk,
    riskCurve,
  } = useCalculator();

  const searchParams = useSearchParams();

  useEffect(() => {
    const factors = searchParams.get("factors");
    if (factors) {
      const factorIds = factors.split(",").filter(Boolean);
      if (factorIds.length > 0) {
        setFactors(factorIds);
      }
    }
  }, [searchParams, setFactors]);

  const hasFactors = state.activeFactorIds.length > 0;

  const combinedMultiplier = useMemo(() => {
    if (!currentRisk) return 1;
    const factorProduct = currentRisk.factorContributions.reduce(
      (acc, fc) => acc * fc.multiplier,
      1
    );
    const interactionProduct = currentRisk.interactionAdjustments.reduce(
      (acc, ia) => acc * ia.adjustment,
      1
    );
    return factorProduct * interactionProduct;
  }, [currentRisk]);

  const [chartSize, setChartSize] = useState<ChartSize>("medium");
  const [showNeonatalRisk, setShowNeonatalRisk] = useState(false);

  const closeFullscreen = useCallback(() => {
    setChartSize("large");
  }, []);

  useEffect(() => {
    if (chartSize !== "fullscreen") return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeFullscreen();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [chartSize, closeFullscreen]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
          Risk Curve
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stillbirth risk estimation with transparent glass-box methodology and
          dynamic confidence scoring.
        </p>
      </div>

      {/* Evidence Grade Key */}
      <div className="mb-6 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold mb-3">Evidence & Confidence Grade Key</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Evidence Strength */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Evidence Strength
            </h3>
            <dl className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">High</dt>
                <dd className="text-muted-foreground">Further research is very unlikely to change confidence in the estimate of effect.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 font-medium text-blue-700 dark:text-blue-400">Moderate</dt>
                <dd className="text-muted-foreground">Further research is likely to have an important impact on confidence and may change the estimate.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">Low</dt>
                <dd className="text-muted-foreground">Further research is very likely to have an important impact and is likely to change the estimate.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">Very Low</dt>
                <dd className="text-muted-foreground">Any estimate of effect is very uncertain.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">Expert</dt>
                <dd className="text-muted-foreground">Based on clinical experience and expert opinion rather than systematic research.</dd>
              </div>
            </dl>
          </div>

          {/* Confidence Grades */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Confidence Grades
            </h3>
            <dl className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-700 dark:text-emerald-400">A</dt>
                <dd className="text-muted-foreground">Very high confidence — multiple concordant high-quality sources with narrow CIs.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 font-semibold text-blue-700 dark:text-blue-400">B</dt>
                <dd className="text-muted-foreground">High confidence — good-quality data with consistent findings across sources.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-700 dark:text-amber-400">C</dt>
                <dd className="text-muted-foreground">Moderate confidence — limited data or some inconsistency between sources.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-orange-500/15 px-2 py-0.5 font-semibold text-orange-700 dark:text-orange-400">D</dt>
                <dd className="text-muted-foreground">Low confidence — sparse data, wide CIs, or extrapolated from indirect evidence.</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 font-semibold text-red-700 dark:text-red-400">F</dt>
                <dd className="text-muted-foreground">Very low confidence — insufficient data; estimate is largely expert opinion or modeling assumption.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Inputs */}
        <div className="lg:w-80 lg:shrink-0">
          <PresetSelector
            onSelect={(preset) =>
              loadPreset(preset.factorIds, preset.defaultGA)
            }
          />
          <CalculatorForm
            state={state}
            setGA={setGA}
            toggleFactor={toggleFactor}
            setApplyInteractions={setApplyInteractions}
          />
        </div>

        {/* Right: Chart + Glass Box */}
        <div className="flex-1 space-y-6">
          {/* Risk Curve */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Stillbirth Risk by Gestational Age
                </CardTitle>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <Switch
                      checked={showNeonatalRisk}
                      onCheckedChange={setShowNeonatalRisk}
                    />
                    Delivery risks
                  </label>
                  <div className="flex items-center gap-1">
                    {sizeLabels.map(({ value, label }) => (
                      <Button
                        key={value}
                        variant={chartSize === value ? "default" : "outline"}
                        size="xs"
                        onClick={() => setChartSize(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StillbirthRiskCurve
                riskCurve={riskCurve}
                currentGA={state.ga}
                hasFactors={hasFactors}
                height={chartSize === "fullscreen" ? "350px" : sizeHeights[chartSize]}
                showNeonatalRisk={showNeonatalRisk}
              />
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[var(--chart-baseline)] inline-block" />
                  Baseline (Muglu 2019, n=15M)
                </span>
                {hasFactors && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-[var(--chart-adjusted)] inline-block" />
                    Adjusted risk
                  </span>
                )}
                {hasFactors && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-[var(--chart-ci)] inline-block" />
                    95% CI (propagated)
                  </span>
                )}
                {showNeonatalRisk && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-emerald-500 inline-block" style={{ borderTop: "1px dashed" }} />
                    Neonatal death (if delivered)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fullscreen overlay */}
          {chartSize === "fullscreen" && (
            <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Stillbirth Risk by Gestational Age
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeFullscreen}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Close (Esc)
                </Button>
              </div>
              <div className="flex-1 px-6 pb-6">
                <div className="h-full rounded-lg bg-card border p-4">
                  <StillbirthRiskCurve
                    riskCurve={riskCurve}
                    currentGA={state.ga}
                    hasFactors={hasFactors}
                    height="100%"
                    showNeonatalRisk={showNeonatalRisk}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Glass Box */}
          <GlassBoxDisplay result={currentRisk} />

          {/* Risk Context */}
          <RiskContextPanel result={currentRisk} />

          {/* Mortality Index */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Mortality Index — Expectant vs. Delivery Risk
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Compares the stillbirth risk of waiting one more week (expectant
                management) against the neonatal death risk of delivering now.
                When the expectant line crosses above the delivery line, the
                mortality balance favors delivery.
              </p>
            </CardHeader>
            <CardContent>
              <MortalityCrossoverChart
                combinedMultiplier={combinedMultiplier}
                currentGA={state.ga}
                height="300px"
              />
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[var(--chart-adjusted)] inline-block" />
                  Expectant risk (stillbirth if waiting)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[var(--chart-baseline)] inline-block" />
                  Delivery risk (neonatal death)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* NNT Panel */}
          <NNTPanel ga={state.ga} combinedMultiplier={combinedMultiplier} />

          {/* Condition Recommendations */}
          <ConditionRecommendations activeFactorIds={state.activeFactorIds} />

          {/* Disclaimer */}
          <p className="text-[11px] text-muted-foreground text-center px-4">
            This calculator uses population-level data and a multiplicative
            model that has not been prospectively validated. The confidence
            score reflects data quality and model assumptions, not clinical
            applicability to individual patients. Clinical judgment supersedes
            all calculator output.
          </p>
        </div>
      </div>
    </div>
  );
}
