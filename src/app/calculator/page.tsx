"use client";

import { useState, useEffect, useCallback } from "react";
import { useCalculator } from "@/lib/hooks/use-calculator";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { GlassBoxDisplay } from "@/components/calculator/glass-box-display";
import { StillbirthRiskCurve } from "@/components/charts/stillbirth-risk-curve";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    setApplyInteractions,
    currentRisk,
    riskCurve,
  } = useCalculator();

  const hasFactors = state.activeFactorIds.length > 0;

  const [chartSize, setChartSize] = useState<ChartSize>("medium");

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
        <h1 className="text-2xl font-semibold tracking-tight">
          Risk Calculator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stillbirth risk estimation with transparent glass-box methodology and
          dynamic confidence scoring.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Inputs */}
        <div className="lg:w-80 lg:shrink-0">
          <CalculatorForm
            state={state}
            setGA={setGA}
            toggleFactor={toggleFactor}
            setApplyInteractions={setApplyInteractions}
          />
        </div>

        {/* Right: Chart + Glass Box */}
        <div className="flex-1 space-y-6">
          {/* Risk Curve — dark canvas */}
          <Card className="chart-dark bg-[oklch(0.26_0.015_245)] border-[oklch(0.35_0.01_245)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[oklch(0.95_0.005_245)]">
                  Stillbirth Risk by Gestational Age
                </CardTitle>
                <div className="flex items-center gap-1">
                  {sizeLabels.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant={chartSize === value ? "default" : "outline"}
                      size="xs"
                      onClick={() => setChartSize(value)}
                      className={chartSize !== value ? "border-white/20 text-[oklch(0.75_0.01_245)] hover:bg-white/10 hover:text-white" : ""}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StillbirthRiskCurve
                riskCurve={riskCurve}
                currentGA={state.ga}
                hasFactors={hasFactors}
                height={chartSize === "fullscreen" ? "350px" : sizeHeights[chartSize]}
              />
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[oklch(0.65_0.01_245)]">
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
                <div className="chart-dark h-full rounded-lg bg-[oklch(0.26_0.015_245)] p-4">
                  <StillbirthRiskCurve
                    riskCurve={riskCurve}
                    currentGA={state.ga}
                    hasFactors={hasFactors}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Glass Box */}
          <GlassBoxDisplay result={currentRisk} />

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
