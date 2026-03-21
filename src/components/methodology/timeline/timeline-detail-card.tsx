"use client";

import { useState } from "react";
import type { RiskCalculation, GestationalAgeDays } from "@/data/types";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";
import type { EquivalenceMapping } from "./use-timeline-equivalence";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";
import { generateCounselingStatement } from "./generate-counseling-statement";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Severity → accent color for border-l-4
function severityAccent(riskPer1000: number): string {
  if (riskPer1000 >= 2.0) return "border-l-[var(--brand-pink)]";
  if (riskPer1000 >= 1.0) return "border-l-[var(--brand-purple)]/70";
  return "border-l-[var(--brand-blue)]/60";
}

// Severity → text color for the adjusted risk value
function severityTextColor(riskPer1000: number): string {
  if (riskPer1000 >= 2.0) return "text-[var(--risk-high)]";
  if (riskPer1000 >= 1.0) return "text-[var(--risk-moderate)]";
  return "text-[var(--risk-low)]";
}

// Confidence grade → color
function gradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: "var(--confidence-a)",
    B: "var(--confidence-b)",
    C: "var(--confidence-c)",
    D: "var(--confidence-d)",
    F: "var(--confidence-f)",
  };
  return map[grade] ?? "var(--muted-foreground)";
}

interface TimelineDetailCardProps {
  calc: RiskCalculation;
  breakdown: StepBreakdown[];
  equivalence: EquivalenceMapping | undefined;
  activeFactorCount: number;
}

export function TimelineDetailCard({
  calc,
  breakdown,
  equivalence,
  activeFactorCount,
}: TimelineDetailCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { weeks, days } = gaToWeeksAndDays(calc.ga);
  const hasFactors = activeFactorCount > 0;
  const grade = calc.confidenceScore.grade;
  const score = calc.confidenceScore.score;
  const multiplier = hasFactors
    ? calc.adjustedRiskPer1000 / (calc.baselineRiskPer1000 || 1)
    : 1;

  const counseling = generateCounselingStatement({
    ga: calc.ga,
    baselineRiskPer1000: calc.baselineRiskPer1000,
    adjustedRiskPer1000: calc.adjustedRiskPer1000,
    hasFactors,
    equivalentBaselineWeek: equivalence?.equivalentBaselineWeek ?? null,
  });

  return (
    <Card
      className={`border-l-4 ${severityAccent(calc.adjustedRiskPer1000)} transition-colors duration-200`}
    >
      <CardContent className="p-5 space-y-4">
        {/* Row 1: Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold tracking-tight">
              {weeks} weeks {days > 0 ? `${days} days` : ""}
            </h3>
            <Badge
              className="text-xs font-bold"
              style={{ backgroundColor: gradeColor(grade), color: "#fff" }}
            >
              {grade} ({score})
            </Badge>
          </div>
          {equivalence?.equivalentBaselineWeek && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--ga-caution)] text-[var(--ga-caution)] bg-[var(--ga-caution)]/10">
              Risk ≈ {equivalence.equivalentBaselineWeek}w uncomplicated
            </span>
          )}
        </div>

        {/* Row 2: Risk summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              Adjusted Risk
            </p>
            <p
              className={`text-xl font-bold tabular-nums ${severityTextColor(calc.adjustedRiskPer1000)}`}
            >
              {calc.adjustedRiskPer1000.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              Baseline Risk
            </p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {calc.baselineRiskPer1000.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
              95% CI
            </p>
            <p className="text-xl font-bold tabular-nums text-muted-foreground">
              {calc.adjustedRiskCI95[0].toFixed(2)}–
              {calc.adjustedRiskCI95[1].toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">per 1,000</p>
          </div>
        </div>

        {hasFactors && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs tabular-nums">
              Combined ×{multiplier.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* Row 3: Factor breakdown */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{expanded ? "▼" : "▶"}</span>
            Factor Breakdown ({activeFactorCount} factor
            {activeFactorCount !== 1 ? "s" : ""})
          </button>
          {expanded && (
            <div
              className="mt-2 space-y-1.5"
              style={{ transition: "height 150ms ease" }}
            >
              {breakdown.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-4">
                  No risk factors selected — showing Muglu 2019 baseline only.
                </p>
              ) : (
                breakdown.map((step) => (
                  <div
                    key={step.factorId}
                    className="flex items-center gap-2 text-xs pl-4"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="font-medium">{step.label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      ×{step.multiplier.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground/60 tabular-nums ml-auto">
                      {step.riskBefore.toFixed(2)} → {step.riskAfter.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {calc.orCorrectedRiskPer1000 != null && (
                <div className="flex items-center gap-2 text-xs pl-4 pt-1 border-t">
                  <span className="text-muted-foreground italic">
                    Zhang-Yu OR→RR correction:{" "}
                    {calc.orCorrectedRiskPer1000.toFixed(2)}/1,000
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 4: Counseling statement */}
        <p className="text-sm leading-relaxed text-foreground/80 border-t pt-3">
          {counseling}
        </p>
      </CardContent>
    </Card>
  );
}
