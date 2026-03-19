"use client";

import { useCalculator } from "@/lib/hooks/use-calculator";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { GlassBoxDisplay } from "@/components/calculator/glass-box-display";
import { StillbirthRiskCurve } from "@/components/charts/stillbirth-risk-curve";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
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
          {/* Risk Curve */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Stillbirth Risk by Gestational Age
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StillbirthRiskCurve
                riskCurve={riskCurve}
                currentGA={state.ga}
                hasFactors={hasFactors}
              />
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#94a3b8] inline-block" />
                  Baseline (Muglu 2019, n=15M)
                </span>
                {hasFactors && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-[#ef4444] inline-block" />
                    Adjusted risk
                  </span>
                )}
                {hasFactors && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-[rgba(239,68,68,0.12)] inline-block" />
                    95% CI (propagated)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Glass Box */}
          <GlassBoxDisplay result={currentRisk} />

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground text-center px-4">
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
