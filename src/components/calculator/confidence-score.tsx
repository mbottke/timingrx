"use client";

import type { ConfidenceScore } from "@/data/types";
import { Badge } from "@/components/ui/badge";

const gradeColors: Record<string, string> = {
  A: "bg-[var(--confidence-a)] text-white",
  B: "bg-[var(--confidence-b)] text-white",
  C: "bg-[var(--confidence-c)] text-black",
  D: "bg-[var(--confidence-d)] text-white",
  F: "bg-[var(--confidence-f)] text-white",
};

export function ConfidenceDisplay({
  confidence,
}: {
  confidence: ConfidenceScore;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Confidence</span>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${gradeColors[confidence.grade]}`}>
            Grade {confidence.grade}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {confidence.score}/100
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${gradeColors[confidence.grade].split(" ")[0]}`}
          style={{ width: `${confidence.score}%` }}
        />
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground">{confidence.label}</p>

      {/* Breakdown (collapsible) */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Score breakdown
        </summary>
        <div className="mt-2 space-y-1 pl-2 border-l-2 border-muted">
          <BreakdownRow
            label="Evidence quality"
            value={confidence.breakdown.evidenceQuality}
          />
          <BreakdownRow
            label="Model validity"
            value={confidence.breakdown.modelValidity}
          />
          <BreakdownRow
            label="Interaction penalty"
            value={confidence.breakdown.interactionPenalty}
          />
          <BreakdownRow
            label="Magnitude plausibility"
            value={confidence.breakdown.magnitudePlausibility}
          />
          <BreakdownRow
            label="Rare-disease validity"
            value={confidence.breakdown.rareDiseaseValidity}
          />
        </div>
      </details>

      {/* Explanation */}
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {confidence.explanation}
      </p>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground/40"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono w-8 text-right">{value.toFixed(2)}</span>
      </div>
    </div>
  );
}
