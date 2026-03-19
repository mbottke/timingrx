"use client";

import { useEffect, useRef, useState } from "react";
import type { StageLayout } from "./pipeline-types";
import type { ConfidenceScore } from "@/data/types";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { FILTER_CONFIG } from "./pipeline-utils";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PipelineHoverCardProps {
  stage: StageLayout | null;
  confidenceScore: ConfidenceScore;
}

// ── GA labels for muglu table ─────────────────────────────────────────────────

const GA_LABELS = ["37w", "38w", "39w", "40w", "41w", "42w"];

// ── Content by stage type ─────────────────────────────────────────────────────

function MugluContent() {
  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-2">
        Muglu 2019 — Baseline Stillbirth Risk
      </p>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left py-0.5 pr-2 text-muted-foreground font-medium">GA</th>
            <th className="text-right py-0.5 pr-2 text-muted-foreground font-medium">/1000</th>
            <th className="text-right py-0.5 text-muted-foreground font-medium">95% CI</th>
          </tr>
        </thead>
        <tbody>
          {baselineStillbirthCurve.map((pt, i) => (
            <tr key={pt.ga} className="border-t border-border/40">
              <td className="py-0.5 pr-2 text-foreground">{GA_LABELS[i]}</td>
              <td className="py-0.5 pr-2 text-right font-mono text-foreground">
                {pt.riskPer1000.toFixed(2)}
              </td>
              <td className="py-0.5 text-right font-mono text-muted-foreground text-[10px]">
                {pt.ci95Low.toFixed(2)}–{pt.ci95High.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GateContent({ stage }: { stage: StageLayout }) {
  // Look up the factor data
  const factorId = stage.id.replace(/^gate_\d+_/, "");
  const factor = riskFactorMultipliers.find((f) => f.id === factorId);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-foreground">
        {stage.isInteraction ? "Interaction Effect" : stage.label}
      </p>
      {factor && (
        <>
          <p className="text-[11px] text-muted-foreground">{factor.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceGradeBadge grade={factor.evidenceGrade} />
            <span className="text-[10px] text-muted-foreground">
              Data reliability: {(factor.dataReliability * 100).toFixed(0)}%
            </span>
          </div>
        </>
      )}
      {!factor && (
        <p className="text-[11px] text-muted-foreground">
          Multiplier: ×{stage.multiplier?.toFixed(2) ?? "—"}
        </p>
      )}
      {stage.multiplier !== undefined && (
        <div className="flex gap-3 text-xs">
          <span>
            <span className="text-muted-foreground">Multiplier: </span>
            <span className="font-mono font-semibold">×{stage.multiplier.toFixed(2)}</span>
          </span>
          {stage.cumulativeRisk !== undefined && (
            <span>
              <span className="text-muted-foreground">→ </span>
              <span className="font-mono font-semibold">
                {stage.cumulativeRisk.toFixed(2)}/1000
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CIContent({ stage }: { stage: StageLayout }) {
  // The adjusted risk is stored as value; CI bounds come from calculation context
  // We display what we have on the stage
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-foreground">
        95% Confidence Interval Propagation
      </p>
      <p className="text-[11px] text-muted-foreground">
        CI bounds are propagated via log-scale quadrature (GUM method),
        combining baseline CI with factor-level uncertainty.
      </p>
      {stage.value !== undefined && (
        <div className="text-xs">
          <span className="text-muted-foreground">Point estimate: </span>
          <span className="font-mono font-semibold">{stage.value.toFixed(2)}/1000</span>
        </div>
      )}
    </div>
  );
}

function FilterContent({ stage }: { stage: StageLayout }) {
  const cfg = FILTER_CONFIG.find((f) => stage.id === `filter_${f.key}`);

  const formulaHints: Record<string, string> = {
    evidenceQuality: "EQ = (R_baseline + Σ Rᵢ) / (1 + n)",
    modelValidity: "MV = max(0.40, 1.0 − 0.03n − 0.005n²)",
    interactionPenalty: "IP = max(0.75, 1.0 − 0.05H − 0.02P)",
    magnitudePlausibility: "MP = stepwise from combined multiplier M",
    rareDiseaseValidity: "RP = stepwise from adjusted absolute risk",
  };

  const hint = cfg ? formulaHints[cfg.key] : undefined;

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-foreground">
        {cfg?.abbr ?? stage.label} — Confidence Filter
      </p>
      {hint && (
        <p className="text-[10px] font-mono text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
          {hint}
        </p>
      )}
      {stage.value !== undefined && (
        <div className="text-xs">
          <span className="text-muted-foreground">Value: </span>
          <span className="font-mono font-semibold">
            {(stage.value * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}

function OutputContent({
  stage,
  confidenceScore,
}: {
  stage: StageLayout;
  confidenceScore: ConfidenceScore;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-foreground">
        Confidence Grade {stage.label}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {confidenceScore.label}
      </p>
      <div className="text-xs">
        <span className="text-muted-foreground">Score: </span>
        <span className="font-mono font-semibold">
          {confidenceScore.score.toFixed(0)}/100
        </span>
      </div>
      {stage.value !== undefined && (
        <div className="text-xs">
          <span className="text-muted-foreground">Adjusted risk: </span>
          <span className="font-mono font-semibold">{stage.value.toFixed(2)}/1000</span>
        </div>
      )}
    </div>
  );
}

// ── Card body router ──────────────────────────────────────────────────────────

function CardBody({
  stage,
  confidenceScore,
}: {
  stage: StageLayout;
  confidenceScore: ConfidenceScore;
}) {
  switch (stage.type) {
    case "muglu":
      return <MugluContent />;
    case "gate":
    case "interaction":
      return <GateContent stage={stage} />;
    case "ci":
      return <CIContent stage={stage} />;
    case "filter":
      return <FilterContent stage={stage} />;
    case "output":
      return <OutputContent stage={stage} confidenceScore={confidenceScore} />;
    default:
      return null;
  }
}

// ── PipelineHoverCard ─────────────────────────────────────────────────────────

export function PipelineHoverCard({
  stage,
  confidenceScore,
}: PipelineHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (stage) {
      timerRef.current = setTimeout(() => setVisible(true), 200);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage]);

  if (!stage || !visible) return null;

  // Position: centered above the stage
  const cardX = stage.x + stage.width / 2;
  const cardY = stage.y;

  return (
    <div
      role="tooltip"
      aria-live="polite"
      style={{
        position: "absolute",
        left: cardX,
        top: cardY,
        transform: "translate(-50%, -100%)",
        marginTop: -8,
        zIndex: 50,
        width: 240,
        pointerEvents: "none",
      }}
    >
      <div className="rounded-lg border border-border bg-popover shadow-lg p-3 space-y-2">
        <CardBody stage={stage} confidenceScore={confidenceScore} />
        <p className="text-[10px] text-primary border-t border-border/50 pt-2 mt-1">
          Click to explore in detail →
        </p>
      </div>
    </div>
  );
}
