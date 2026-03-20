"use client";

import { useMethodology } from "@/components/methodology/methodology-provider";
import { useTimelineEquivalence } from "./use-timeline-equivalence";
import { useTimelinePlayback } from "./use-timeline-playback";
import { TimelineChart } from "./timeline-chart";
import { TimelinePlayback } from "./timeline-playback";
import { TimelineDetailCard } from "./timeline-detail-card";

export function TimelineView() {
  const {
    ga,
    setGA,
    riskCurve,
    selectedGaCalculation,
    stepByStepBreakdown,
    activeFactorIds,
  } = useMethodology();

  const equivalences = useTimelineEquivalence(riskCurve);
  const { isPlaying } = useTimelinePlayback(ga, setGA);

  // Find equivalence for current week
  const currentEquivalence = equivalences.find((eq) => eq.sourceGA === ga);

  return (
    <div className="space-y-4">
      {/* Screen reader summary */}
      <p className="sr-only">
        Risk timeline from 37 to 42 weeks.
        {activeFactorIds.length > 0
          ? ` Adjusted risk ranges from ${riskCurve[0]?.adjustedRiskPer1000.toFixed(2)} to ${riskCurve[riskCurve.length - 1]?.adjustedRiskPer1000.toFixed(2)} per 1000 with ${activeFactorIds.length} risk factor${activeFactorIds.length !== 1 ? "s" : ""} and confidence grade ${selectedGaCalculation.confidenceScore.grade}.`
          : ` Baseline risk ranges from ${riskCurve[0]?.baselineRiskPer1000.toFixed(2)} to ${riskCurve[riskCurve.length - 1]?.baselineRiskPer1000.toFixed(2)} per 1000.`}
      </p>

      {/* Description card */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-1.5">
          Clinical Decision Timeline
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This timeline shows how stillbirth risk evolves from 37 to 42 weeks
          with your selected risk factors. Click any week to see the full
          breakdown, or press play to watch the risk progression. Dashed amber
          lines show when adjusted risk at an earlier week equals baseline risk
          at a later week — a key counseling insight.
        </p>
      </div>

      {/* Chart */}
      <TimelineChart
        riskCurve={riskCurve}
        currentGA={ga}
        setGA={setGA}
        equivalences={equivalences}
        isPlaying={isPlaying}
      />

      {/* Playback controls */}
      <TimelinePlayback currentGA={ga} setGA={setGA} />

      {/* Detail card */}
      <TimelineDetailCard
        calc={selectedGaCalculation}
        breakdown={stepByStepBreakdown}
        equivalence={currentEquivalence}
        activeFactorCount={activeFactorIds.length}
      />

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto pt-4">
        This timeline illustrates the multiplicative risk model. Cross-GA
        equivalences are approximate. Clinical judgment supersedes all calculator
        output.
      </p>
    </div>
  );
}
