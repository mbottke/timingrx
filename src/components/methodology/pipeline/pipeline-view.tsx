"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { StageLayout } from "./pipeline-types";
import { usePipelineLayout } from "./use-pipeline-layout";
import { PipelineStage } from "./pipeline-stage";
import { PipelineFilters } from "./pipeline-filters";
import { PipelinePipes } from "./pipeline-pipes";
import { ParticleSystem } from "./particle-system";
import { PipelineHoverCard } from "./pipeline-hover-card";
import { PipelineMobile } from "./pipeline-mobile";
import { useMethodology } from "@/components/methodology/methodology-provider";

// ── Section map: stage type → explorer section id ─────────────────────────────

const SECTION_MAP: Record<string, string> = {
  muglu: "section-baseline",
  gate: "section-multiplication",
  interaction: "section-multiplication",
  ci: "section-ci-propagation",
  filter: "section-confidence",
  output: "section-grade-mapping",
};

// ── PipelineView ──────────────────────────────────────────────────────────────

export function PipelineView() {
  const router = useRouter();
  const { selectedGaCalculation, stepByStepBreakdown, activeFactorIds } =
    useMethodology();

  // Fix 2: Calculation error guard
  const adjustedRisk = selectedGaCalculation.adjustedRiskPer1000;
  const hasCalcError = !isFinite(adjustedRisk) || isNaN(adjustedRisk);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Measure container width with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    // Set initial width
    setContainerWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const { stages, pipes, totalHeight } = usePipelineLayout(
    containerWidth,
    stepByStepBreakdown,
    selectedGaCalculation
  );

  const [hoveredStage, setHoveredStage] = useState<StageLayout | null>(null);

  // Stage click: navigate to explorer tab then scroll to the relevant section
  const handleStageClick = useCallback(
    (stage: StageLayout) => {
      const sectionId = SECTION_MAP[stage.type];

      // Switch to explorer tab
      router.replace("/methodology?view=explorer", { scroll: false });

      // After navigation tick, scroll the section into view
      requestAnimationFrame(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    },
    [router]
  );

  // Derived values for particle system
  const combinedMultiplier =
    selectedGaCalculation.adjustedRiskPer1000 /
    (selectedGaCalculation.baselineRiskPer1000 || 1);
  const activeFactorCount = activeFactorIds.length;
  const grade = selectedGaCalculation.confidenceScore.grade;
  const centerX = containerWidth / 2;

  // Non-filter stages for SVG rendering
  const nonFilterStages = stages.filter((s) => s.type !== "filter");
  const filterStages = stages.filter((s) => s.type === "filter");

  if (hasCalcError) {
    return (
      <div className="w-full flex flex-col items-center gap-2 py-8">
        <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
          Calculation error — showing baseline
        </p>
        <p className="text-xs text-muted-foreground">
          Try removing one or more risk factors to restore a valid calculation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Screen reader summary */}
      <p className="sr-only">
        Risk flows from baseline (
        {selectedGaCalculation.baselineRiskPer1000.toFixed(2)}/1000) through{" "}
        {activeFactorCount} factor
        {activeFactorCount !== 1 ? "s" : ""} to adjusted risk (
        {selectedGaCalculation.adjustedRiskPer1000.toFixed(2)}/1000) with
        confidence grade {grade}.
      </p>

      {/* Mobile layout */}
      <PipelineMobile
        stages={stages}
        steps={stepByStepBreakdown}
        calc={selectedGaCalculation}
        onStageClick={handleStageClick}
      />

      {/* Full pipeline (md+) */}
      <div className="hidden md:block">
        {/* Fix 7: tablet responsive container */}
        <div className="mx-auto w-full md:max-w-[90%] lg:max-w-[800px]">

        {/* Pipeline description */}
        <div className="mb-4 rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-1.5">How This Pipeline Works</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Risk flows top-to-bottom through the pipeline. It starts with a{" "}
            <strong className="text-foreground">baseline stillbirth rate</strong> from the Muglu 2019 meta-analysis
            (n=15M), then each selected risk factor{" "}
            <strong className="text-foreground">multiplies the risk</strong> by its
            relative risk. A <strong className="text-foreground">95% confidence interval</strong> is
            propagated, and confidence filters score the data quality. The final
            output is a <strong className="text-foreground">graded risk estimate</strong> (A–F).
            Animated dots trace the data flow. Click any stage for details.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-2 rounded-sm border-2 border-[var(--primary)] bg-background" />
              Baseline source
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-2 rounded-sm bg-blue-500/20 border border-blue-500" />
              Risk factor (×multiplier)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-2 rounded-sm border-2 border-violet-600 bg-background" />
              Confidence interval
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-2 rounded-sm bg-emerald-500/20 border-2 border-emerald-500" />
              Final graded output
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: totalHeight }}
        >
          {/* Canvas particle layer — BEHIND the SVG stages */}
          <ParticleSystem
            stages={stages}
            centerX={centerX}
            totalHeight={totalHeight}
            combinedMultiplier={combinedMultiplier}
            activeFactorCount={activeFactorCount}
            grade={grade}
            containerWidth={containerWidth}
          />

          {/* SVG layer: pipes + stage nodes — ON TOP of particles */}
          <svg
            aria-hidden="true"
            width={containerWidth}
            height={totalHeight}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <PipelinePipes pipes={pipes} />

            {nonFilterStages.map((stage) => (
              <PipelineStage
                key={stage.id}
                stage={stage}
                onHover={setHoveredStage}
                onClick={handleStageClick}
              />
            ))}

            {filterStages.length > 0 && (
              <PipelineFilters
                stages={filterStages}
                breakdown={selectedGaCalculation.confidenceScore.breakdown}
                onHover={setHoveredStage}
                onClick={handleStageClick}
              />
            )}

            {/* Fix 1: "No factors selected" annotation between muglu and CI */}
            {stepByStepBreakdown.length === 0 && (() => {
              const mugluStage = stages.find((s) => s.type === "muglu");
              const ciStage = stages.find((s) => s.type === "ci");
              if (!mugluStage || !ciStage) return null;
              const annotY = (mugluStage.y + mugluStage.height + ciStage.y) / 2;
              return (
                <text
                  key="no-factors-annotation"
                  x={centerX}
                  y={annotY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontStyle="italic"
                  fill="var(--muted-foreground)"
                >
                  No risk factors selected — showing baseline only
                </text>
              );
            })()}

            {/* Fix 6: × badge at filter reconvergence point */}
            {filterStages.length > 0 && (() => {
              const outputStage = stages.find((s) => s.type === "output");
              if (!outputStage) return null;
              const bx = centerX;
              const by = (outputStage.pipeInY ?? outputStage.y) - 14;
              const BADGE_R = 9;
              return (
                <g key="reconvergence-badge" aria-hidden="true">
                  <circle cx={bx} cy={by} r={BADGE_R} fill="var(--muted)" opacity={0.7} />
                  <text
                    x={bx}
                    y={by}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="var(--muted-foreground)"
                  >
                    ×
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Hover card — on top of everything */}
          <PipelineHoverCard
            stage={hoveredStage}
            confidenceScore={selectedGaCalculation.confidenceScore}
          />
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-muted-foreground text-center max-w-xl mx-auto">
          This pipeline illustrates the multiplicative risk model. The composite
          has not been prospectively validated. Clinical judgment supersedes all
          calculator output.
        </p>
        </div>
      </div>
    </div>
  );
}
