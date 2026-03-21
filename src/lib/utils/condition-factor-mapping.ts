/**
 * Maps condition IDs to relevant calculator risk factor IDs.
 * Used by the "Open in Risk Calculator" button on condition detail pages.
 */
export const conditionToFactors: Record<string, string[]> = {
  // Hypertensive
  chronic_htn: ["chronic_hypertension"],
  chronic_htn_no_meds: ["chronic_hypertension"],
  chronic_htn_controlled_meds: ["chronic_hypertension"],
  chronic_htn_difficult_control: ["chronic_hypertension"],
  // Diabetes
  gdm_diet_controlled: [],
  gdm_medication_controlled: [],
  gdm_poorly_controlled: ["preexisting_diabetes"],
  pregestational_dm_well_controlled: ["preexisting_diabetes"],
  pregestational_dm_vascular_poor_control: ["preexisting_diabetes"],
  // Fetal
  fgr_3rd_10th: ["sga_fetus"],
  fgr_less_3rd: ["sga_fetus"],
  // Age
  ama_35_39: ["age_35_39"],
  ama_40_plus: ["age_gte_40"],
  ama_45_plus: ["age_gte_45"],
  // Obesity
  obesity_class_i: ["bmi_30_34"],
  obesity_class_ii: ["bmi_35_39"],
  obesity_class_iii: ["bmi_gte_40"],
  obesity_super_morbid: ["bmi_gte_40"],
  // Prior
  prior_stillbirth_unexplained: ["prior_stillbirth"],
  prior_stillbirth_explained: ["prior_stillbirth"],
};

/** Get risk factor IDs for a condition. Returns empty array if no mapping. */
export function getFactorsForCondition(conditionId: string): string[] {
  return conditionToFactors[conditionId] ?? [];
}

/** Check if a condition has a calculator mapping */
export function hasCalculatorMapping(conditionId: string): boolean {
  const factors = conditionToFactors[conditionId];
  return factors !== undefined && factors.length > 0;
}
