import { allConditions, conditionById } from "@/data/conditions";
import type { ObstetricCondition } from "@/data/types";

export interface RelatedCondition {
  condition: ObstetricCondition;
  reason: "same_category" | "interaction" | "similar_ga";
}

export function getRelatedConditions(
  conditionId: string,
  limit: number = 6
): RelatedCondition[] {
  const condition = conditionById.get(conditionId);
  if (!condition) return [];

  const related: RelatedCondition[] = [];
  const seen = new Set<string>([conditionId]);

  // 1. Conditions that interact with this one
  for (const interaction of condition.interactions) {
    const other = conditionById.get(interaction.interactingConditionId);
    if (other && !seen.has(other.id)) {
      related.push({ condition: other, reason: "interaction" });
      seen.add(other.id);
    }
  }

  // 2. Same category (excluding sub-variants of same parent)
  for (const other of allConditions) {
    if (seen.has(other.id)) continue;
    if (
      other.category === condition.category &&
      other.parentConditionId !== condition.id
    ) {
      related.push({ condition: other, reason: "same_category" });
      seen.add(other.id);
    }
    if (related.length >= limit) break;
  }

  // 3. Similar GA window (if still room)
  if (related.length < limit) {
    const myGA = getEarliestGA(condition);
    if (myGA < 999) {
      const gaSimilar = allConditions
        .filter((c) => !seen.has(c.id))
        .map((c) => ({ condition: c, diff: Math.abs(getEarliestGA(c) - myGA) }))
        .filter((c) => c.diff <= 14) // within 2 weeks
        .sort((a, b) => a.diff - b.diff)
        .slice(0, limit - related.length);

      for (const { condition: c } of gaSimilar) {
        related.push({ condition: c, reason: "similar_ga" });
        seen.add(c.id);
      }
    }
  }

  return related.slice(0, limit);
}

function getEarliestGA(c: ObstetricCondition): number {
  const rec = c.guidelineRecommendations[0];
  if (!rec) return 999;
  if (rec.timing.type === "range") return rec.timing.range.earliest;
  if (rec.timing.type === "immediate") return 0;
  return 999;
}
