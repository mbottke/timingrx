import type { GARange, DeliveryTiming, ObstetricCondition } from "@/data/types";
import { mostRestrictiveRange } from "@/lib/utils/ga-math";
import { conditionById } from "@/data/conditions";

export interface ResolvedGAWindow {
  /** The intersection of all selected conditions' GA ranges. Null if no overlap. */
  intersection: GARange | null;
  /** Individual condition windows for overlay display */
  conditionWindows: Array<{
    conditionId: string;
    conditionName: string;
    range: GARange | null;
    timing: DeliveryTiming;
  }>;
  /** The most restrictive condition (earliest latest-GA) */
  mostRestrictiveConditionId: string | null;
  /** Whether any condition requires individualization */
  hasIndividualizeCondition: boolean;
  /** Whether any condition requires immediate delivery */
  hasImmediateCondition: boolean;
}

/**
 * Resolve the delivery window for multiple co-occurring conditions.
 * Returns the intersection of all concrete GA ranges plus metadata about
 * conditions that require individualization or immediate delivery.
 */
export function resolveGAWindow(
  conditionIds: string[]
): ResolvedGAWindow {
  const conditionWindows: ResolvedGAWindow["conditionWindows"] = [];
  const concreteRanges: GARange[] = [];
  let hasIndividualize = false;
  let hasImmediate = false;

  for (const id of conditionIds) {
    const condition = conditionById.get(id);
    if (!condition) continue;

    const primaryRec = condition.guidelineRecommendations[0];
    if (!primaryRec) {
      // Parent condition with no direct recommendation — skip
      continue;
    }

    const timing = primaryRec.timing;
    let range: GARange | null = null;

    if (timing.type === "range") {
      range = timing.range;
      concreteRanges.push(range);
    } else if (timing.type === "individualize") {
      hasIndividualize = true;
    } else if (timing.type === "immediate") {
      hasImmediate = true;
    }

    conditionWindows.push({
      conditionId: id,
      conditionName: condition.name,
      range,
      timing,
    });
  }

  const intersection = mostRestrictiveRange(concreteRanges);

  // Find the most restrictive condition (smallest latest GA)
  let mostRestrictiveId: string | null = null;
  let smallestLatest = Infinity;
  for (const cw of conditionWindows) {
    if (cw.range && cw.range.latest < smallestLatest) {
      smallestLatest = cw.range.latest;
      mostRestrictiveId = cw.conditionId;
    }
  }

  return {
    intersection,
    conditionWindows,
    mostRestrictiveConditionId: mostRestrictiveId,
    hasIndividualizeCondition: hasIndividualize,
    hasImmediateCondition: hasImmediate,
  };
}
