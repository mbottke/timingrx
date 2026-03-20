"use client";

import type { RiskCalculation } from "@/data/types";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { formatCitation } from "@/lib/utils/citation-format";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceDisplay } from "./confidence-score";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

export function GlassBoxDisplay({ result }: { result: RiskCalculation }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Risk Decomposition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* Baseline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground w-20">
              Baseline
            </span>
            <span className="text-muted-foreground">
              ({gaToDisplay(result.ga)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium">
              {result.baselineRiskPer1000.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">per 1,000</span>
          </div>
        </div>

        {/* Factor contributions */}
        {result.factorContributions.map((fc) => {
          const fullFactor = factorMap.get(fc.factorId);
          return (
            <div
              key={fc.factorId}
              className="flex items-center justify-between border-t pt-2"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-xs text-[var(--risk-high)]">
                  \u00d7{fc.multiplier.toFixed(2)}
                </span>
                <span className="text-sm truncate">{fc.label}</span>
                <EvidenceGradeBadge grade={fc.evidenceGrade} />
                {fc.isHypothesized && (
                  <Badge variant="outline" className="text-[9px]">
                    Hypothesized
                  </Badge>
                )}
              </div>
              {fullFactor && (
                <span className="text-[11px] text-muted-foreground font-mono ml-2 whitespace-nowrap">
                  R={fc.dataReliability.toFixed(2)}
                </span>
              )}
            </div>
          );
        })}

        {/* Interaction adjustments */}
        {result.interactionAdjustments.map((ia, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-t pt-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--evidence-moderate)]">
                \u00d7{ia.adjustment.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                Interaction adjustment
              </span>
              {ia.isHypothesized && (
                <Badge variant="outline" className="text-[9px]">
                  Hypothesized
                </Badge>
              )}
            </div>
          </div>
        ))}

        {/* Separator and result */}
        <div className="border-t-2 border-foreground pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Adjusted Risk</span>
            <span className="font-mono text-lg font-bold text-[var(--risk-high)]">
              {result.adjustedRiskPer1000.toFixed(2)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                per 1,000
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>95% CI (propagated)</span>
            <span className="font-mono">
              {result.adjustedRiskCI95[0].toFixed(2)} \u2013{" "}
              {result.adjustedRiskCI95[1].toFixed(2)}
            </span>
          </div>
          {result.orCorrectedRiskPer1000 !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ga-caution)]">
                Zhang & Yu corrected
              </span>
              <span className="font-mono text-[var(--ga-caution)]">
                {result.orCorrectedRiskPer1000.toFixed(2)} per 1,000
              </span>
            </div>
          )}
        </div>

        {/* Confidence Score */}
        <div className="border-t pt-3">
          <ConfidenceDisplay confidence={result.confidenceScore} />
        </div>
      </CardContent>
    </Card>
  );
}
