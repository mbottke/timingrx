"use client";

import { ArrowDownIcon } from "lucide-react";
import type { StageLayout } from "./pipeline-types";
import type { ConfidenceScore, RiskCalculation } from "@/data/types";
import { AnimatedNumber } from "@/components/methodology/animated-number";
import { FILTER_CONFIG, gradeToColor } from "./pipeline-utils";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PipelineMobileProps {
  stages: StageLayout[];
  steps: StepBreakdown[];
  calc: RiskCalculation;
  onStageClick?: (stage: StageLayout) => void;
}

// ── Helper: card with colored border ─────────────────────────────────────────

function Card({
  borderColor,
  children,
  onClick,
  ariaLabel,
}: {
  borderColor?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="w-full rounded-lg border bg-card p-3 text-left shadow-sm transition-colors hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={borderColor ? { borderColor, borderWidth: 2 } : undefined}
    >
      {children}
    </button>
  );
}

// ── Arrow separator ───────────────────────────────────────────────────────────

function Separator() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({ calc }: { calc: RiskCalculation }) {
  const grade = calc.confidenceScore.grade;
  const gradeColor = gradeToColor(grade);

  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-xs mb-3">
      <span className="text-muted-foreground">Baseline</span>
      <span className="font-mono font-semibold">
        <AnimatedNumber value={calc.baselineRiskPer1000} decimals={2} suffix="/1000" />
      </span>
      <ArrowDownIcon className="h-3 w-3 text-muted-foreground rotate-[-90deg]" aria-hidden="true" />
      <span className="text-muted-foreground">Adjusted</span>
      <span className="font-mono font-semibold">
        <AnimatedNumber value={calc.adjustedRiskPer1000} decimals={2} suffix="/1000" />
      </span>
      <ArrowDownIcon className="h-3 w-3 text-muted-foreground rotate-[-90deg]" aria-hidden="true" />
      <span
        className="font-bold text-sm"
        style={{ color: gradeColor }}
      >
        Grade {grade}
      </span>
    </div>
  );
}

// ── PipelineMobile ────────────────────────────────────────────────────────────

export function PipelineMobile({
  stages,
  steps,
  calc,
  onStageClick,
}: PipelineMobileProps) {
  const mugluStage = stages.find((s) => s.type === "muglu");
  const gateStages = stages.filter(
    (s) => s.type === "gate" || s.type === "interaction"
  );
  const ciStage = stages.find((s) => s.type === "ci");
  const filterStages = stages.filter((s) => s.type === "filter");
  const outputStage = stages.find((s) => s.type === "output");
  const grade = calc.confidenceScore.grade;
  const gradeColor = gradeToColor(grade);

  return (
    <div className="space-y-0 md:hidden">
      <SummaryBar calc={calc} />

      {/* Muglu baseline card */}
      {mugluStage && (
        <Card
          ariaLabel="Muglu 2019 baseline — tap to explore"
          onClick={() => onStageClick?.(mugluStage)}
        >
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Baseline (Muglu 2019)
          </p>
          <p className="mt-0.5 text-lg font-bold font-mono">
            <AnimatedNumber value={mugluStage.value ?? 0} decimals={2} suffix="/1000" />
          </p>
        </Card>
      )}

      {/* Gate cards */}
      {gateStages.map((stage, i) => {
        const step = steps[i];
        return (
          <div key={stage.id}>
            <Separator />
            <Card
              borderColor={stage.color}
              ariaLabel={`${stage.label} — tap to explore`}
              onClick={() => onStageClick?.(stage)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium text-foreground leading-tight flex-1">
                  {stage.isInteraction ? (
                    <span className="italic text-muted-foreground">↳ {stage.label}</span>
                  ) : (
                    stage.label
                  )}
                </p>
                <span
                  className="text-sm font-bold font-mono shrink-0"
                  style={{ color: stage.color }}
                >
                  ×{stage.multiplier?.toFixed(2) ?? "—"}
                </span>
              </div>
              {stage.cumulativeRisk !== undefined && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cumulative:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    <AnimatedNumber value={stage.cumulativeRisk} decimals={2} suffix="/1000" />
                  </span>
                </p>
              )}
            </Card>
          </div>
        );
      })}

      {/* CI card */}
      {ciStage && (
        <>
          <Separator />
          <Card
            ariaLabel="95% Confidence Interval — tap to explore"
            onClick={() => onStageClick?.(ciStage)}
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              95% CI Propagation
            </p>
            <p className="mt-0.5 text-lg font-bold font-mono text-purple-600">
              <AnimatedNumber value={ciStage.value ?? 0} decimals={2} suffix="/1000" />
            </p>
          </Card>
        </>
      )}

      {/* 5-filter grid */}
      {filterStages.length > 0 && (
        <>
          <Separator />
          <div className="grid grid-cols-5 gap-1">
            {FILTER_CONFIG.map((cfg) => {
              const stage = filterStages.find((s) => s.id === `filter_${cfg.key}`);
              if (!stage) return null;
              const pct = ((stage.value ?? 1) * 100).toFixed(0);
              return (
                <button
                  key={cfg.key}
                  type="button"
                  aria-label={`${cfg.abbr} filter: ${pct}%`}
                  onClick={() => onStageClick?.(stage)}
                  className="rounded border p-1.5 text-center transition-colors hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ borderColor: cfg.color }}
                >
                  <p
                    className="text-[11px] font-bold"
                    style={{ color: cfg.color }}
                  >
                    {cfg.abbr}
                  </p>
                  <p className="text-[9px] font-mono text-foreground mt-0.5">{pct}%</p>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Output card */}
      {outputStage && (
        <>
          <Separator />
          <Card
            borderColor={gradeColor}
            ariaLabel={`Grade ${grade} output — tap to explore`}
            onClick={() => onStageClick?.(outputStage)}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-3xl font-black"
                style={{ color: gradeColor }}
              >
                {grade}
              </span>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {calc.confidenceScore.label}
                </p>
                <p className="text-sm font-bold font-mono">
                  <AnimatedNumber
                    value={outputStage.value ?? 0}
                    decimals={2}
                    suffix="/1000"
                  />
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
