"use client";

import { useMemo } from "react";
import type { RiskCalculation } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findEquivalentBaselineGA, riskAsOneInX } from "@/lib/calculator/risk-equivalence";
import { gaToDisplay } from "@/lib/utils/ga-format";

interface RiskContextPanelProps {
  result: RiskCalculation | null;
}

export function RiskContextPanel({ result }: RiskContextPanelProps) {
  const context = useMemo(() => {
    if (!result) return null;

    const baselineOneInX = riskAsOneInX(result.baselineRiskPer1000);
    const adjustedOneInX = riskAsOneInX(result.adjustedRiskPer1000);
    const equivalentGA = findEquivalentBaselineGA(result.adjustedRiskPer1000);
    const hasFactors = result.factorContributions.length > 0;

    return {
      baselineOneInX,
      adjustedOneInX,
      equivalentGA,
      hasFactors,
      currentGADisplay: gaToDisplay(result.ga),
      equivalentGADisplay: equivalentGA ? gaToDisplay(equivalentGA) : null,
    };
  }, [result]);

  if (!result || !context) return null;

  return (
    <Card className="border-l-4 border-l-[var(--brand-blue,hsl(215,70%,55%))]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Risk in Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* 1-in-X framing */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Baseline risk at {context.currentGADisplay}
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {context.baselineOneInX}
            </p>
            <p className="text-xs text-muted-foreground">pregnancies</p>
          </div>

          {context.hasFactors && (
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Adjusted risk at {context.currentGADisplay}
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {context.adjustedOneInX}
              </p>
              <p className="text-xs text-muted-foreground">pregnancies</p>
            </div>
          )}
        </div>

        {/* GA equivalence */}
        {context.hasFactors && context.equivalentGADisplay && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            This adjusted risk at{" "}
            <span className="font-medium text-foreground">
              {context.currentGADisplay}
            </span>{" "}
            equals the baseline risk at{" "}
            <span className="font-medium text-foreground">
              {context.equivalentGADisplay}
            </span>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
