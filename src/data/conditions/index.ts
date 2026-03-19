import type { ObstetricCondition } from "../types";
import { hypertensiveConditions } from "./hypertensive";
import { diabetesConditions } from "./diabetes";
import { cardiacValvularConditions } from "./cardiac-valvular";
import { cardiacAortopathyConditions } from "./cardiac-aortopathy";
import { cardiacComplexConditions } from "./cardiac-complex";
import { renalConditions } from "./renal";
import { hepaticConditions } from "./hepatic";
import { hematologicConditions } from "./hematologic";
import { autoimmuneConditions } from "./autoimmune";
import { endocrineConditions } from "./endocrine";
import { neurologicConditions } from "./neurologic";
import { pulmonaryConditions } from "./pulmonary";
import { infectiousConditions } from "./infectious";
import { substancePsychiatricConditions } from "./substance-psychiatric";
import { obesityConditions } from "./obesity";
import { fetalCardiacConditions } from "./fetal-cardiac";
import { fetalStructuralConditions } from "./fetal-structural";
import { fetalGrowthFluidConditions } from "./fetal-growth-fluid";
import { placentalUterineConditions } from "./placental-uterine";
import { multipleGestationConditions } from "./multiple-gestation";
import { priorObstetricConditions } from "./prior-obstetric";
import { ageDemographicsConditions } from "./age-demographics";
import { surgicalConditions } from "./surgical";
import { miscellaneousConditions } from "./miscellaneous";

/**
 * Flatten all conditions including sub-variants into a single searchable array.
 */
function flattenConditions(
  conditions: ObstetricCondition[]
): ObstetricCondition[] {
  const result: ObstetricCondition[] = [];
  for (const condition of conditions) {
    result.push(condition);
    if (condition.subVariants) {
      result.push(...flattenConditions(condition.subVariants));
    }
  }
  return result;
}

/** All condition files */
const allConditionGroups: ObstetricCondition[][] = [
  hypertensiveConditions,
  diabetesConditions,
  cardiacValvularConditions,
  cardiacAortopathyConditions,
  cardiacComplexConditions,
  renalConditions,
  hepaticConditions,
  hematologicConditions,
  autoimmuneConditions,
  endocrineConditions,
  neurologicConditions,
  pulmonaryConditions,
  infectiousConditions,
  substancePsychiatricConditions,
  obesityConditions,
  fetalCardiacConditions,
  fetalStructuralConditions,
  fetalGrowthFluidConditions,
  placentalUterineConditions,
  multipleGestationConditions,
  priorObstetricConditions,
  ageDemographicsConditions,
  surgicalConditions,
  miscellaneousConditions,
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
