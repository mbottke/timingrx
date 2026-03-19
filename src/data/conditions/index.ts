import type { ObstetricCondition } from "../types";
import { hypertensiveConditions } from "./hypertensive";

/**
 * Flatten all conditions including sub-variants into a single searchable array.
 */
function flattenConditions(conditions: ObstetricCondition[]): ObstetricCondition[] {
  const result: ObstetricCondition[] = [];
  for (const condition of conditions) {
    result.push(condition);
    if (condition.subVariants) {
      result.push(...flattenConditions(condition.subVariants));
    }
  }
  return result;
}

/** All condition files — add imports here as files are created */
const allConditionGroups: ObstetricCondition[][] = [
  hypertensiveConditions,
  // Add new condition files here as they are created
];

/** Top-level conditions (with sub-variants nested) */
export const conditionGroups = allConditionGroups.flat();

/** Flat array of ALL conditions including sub-variants — for search and calculator */
export const allConditions = flattenConditions(conditionGroups);

/** Lookup by ID */
export const conditionById = new Map(allConditions.map((c) => [c.id, c]));

/** Group by category */
export function conditionsByCategory() {
  const groups = new Map<string, ObstetricCondition[]>();
  for (const c of conditionGroups) {
    const existing = groups.get(c.category) ?? [];
    existing.push(c);
    groups.set(c.category, existing);
  }
  return groups;
}
