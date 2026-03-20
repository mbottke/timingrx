import { useMemo } from "react";
import type { RiskCalculation } from "@/data/types";

export interface EquivalenceMapping {
  /** GA (days) of the adjusted risk point */
  sourceGA: number;
  /** Week number of the matching baseline risk (37-42), or null */
  equivalentBaselineWeek: number | null;
  /** The baseline risk value that matched */
  matchedBaselineRisk: number | null;
}

/**
 * For each point in the risk curve, find which later baseline week
 * has the closest uncomplicated risk to this week's adjusted risk.
 * Only returns a match if:
 * 1. The matched baseline week is at a LATER GA than the source
 * 2. The adjusted risk exceeds the baseline risk at the same GA
 */
export function useTimelineEquivalence(
  riskCurve: RiskCalculation[]
): EquivalenceMapping[] {
  return useMemo(() => {
    // Build baseline lookup: ga (days) → baseline risk
    const baselineByGA = new Map(
      riskCurve.map((pt) => [pt.ga, pt.baselineRiskPer1000])
    );
    const baselineEntries = Array.from(baselineByGA.entries()).sort(
      ([a], [b]) => a - b
    );

    return riskCurve.map((pt) => {
      const adjusted = pt.adjustedRiskPer1000;
      const baseline = pt.baselineRiskPer1000;

      // Only compute equivalence if adjusted > baseline (factors active)
      if (adjusted <= baseline) {
        return {
          sourceGA: pt.ga,
          equivalentBaselineWeek: null,
          matchedBaselineRisk: null,
        };
      }

      // Find the baseline entry at a later GA with the closest risk
      let bestMatch: { ga: number; risk: number; diff: number } | null = null;
      for (const [bGA, bRisk] of baselineEntries) {
        if (bGA <= pt.ga) continue; // must be later
        const diff = Math.abs(bRisk - adjusted);
        if (!bestMatch || diff < bestMatch.diff) {
          bestMatch = { ga: bGA, risk: bRisk, diff };
        }
      }

      if (!bestMatch) {
        return {
          sourceGA: pt.ga,
          equivalentBaselineWeek: null,
          matchedBaselineRisk: null,
        };
      }

      return {
        sourceGA: pt.ga,
        equivalentBaselineWeek: Math.floor(bestMatch.ga / 7),
        matchedBaselineRisk: bestMatch.risk,
      };
    });
  }, [riskCurve]);
}
