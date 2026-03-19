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

  // Stage click: navigate to pipeline tab then scroll to the relevant section
  const handleStageClick = useCallback(
    (stage: StageLayout) => {
      const sectionId = SECTION_MAP[stage.type];

      // Switch to explorer tab (removes ?view=pipeline)
      router.replace("/methodology", { scroll: false });

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
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: totalHeight }}
        >
          {/* SVG layer: pipes + stage nodes */}
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
          </svg>

          {/* Canvas particle overlay */}
          <ParticleSystem
            stages={stages}
            centerX={centerX}
            totalHeight={totalHeight}
            combinedMultiplier={combinedMultiplier}
            activeFactorCount={activeFactorCount}
            grade={grade}
            containerWidth={containerWidth}
          />

          {/* Hover card */}
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
  );
}
