export const conditionIcdCodes: Record<string, string[]> = {
  // Hypertensive
  chronic_htn: ["O10.0", "O10.9"],
  chronic_htn_no_meds: ["O10.0"],
  chronic_htn_controlled_meds: ["O10.0"],
  chronic_htn_difficult_control: ["O10.0"],
  gestational_htn: ["O13"],
  preeclampsia_without_severe: ["O14.0"],
  preeclampsia_with_severe: ["O14.1"],
  superimposed_preeclampsia: ["O11"],
  eclampsia: ["O15.0"],
  hellp_syndrome: ["O14.2"],
  // Diabetes
  gdm_diet_controlled: ["O24.410"],
  gdm_medication_controlled: ["O24.414"],
  gdm_poorly_controlled: ["O24.414"],
  pregestational_dm_well_controlled: ["O24.011", "O24.111"],
  pregestational_dm_vascular_poor_control: ["O24.011", "O24.111"],
  // Fetal
  fgr_3rd_10th: ["O36.591"],
  fgr_less_3rd: ["O36.591"],
  oligohydramnios: ["O41.0"],
  // Placental/Uterine
  placenta_previa: ["O44.0", "O44.1"],
  vasa_previa: ["O69.4"],
  // Age
  ama_35_39: ["O09.52"],
  ama_40_plus: ["O09.52"],
  ama_45_plus: ["O09.52"],
  // Obesity
  obesity_class_i: ["O99.21"],
  obesity_class_ii: ["O99.21"],
  obesity_class_iii: ["O99.21"],
  obesity_super_morbid: ["O99.21"],
  // Prior
  prior_stillbirth_unexplained: ["O26.2"],
  prior_stillbirth_explained: ["O26.2"],
  // Multiple gestation
  dichorionic_diamniotic_twins: ["O30.0"],
  monochorionic_diamniotic_twins: ["O30.0"],
  monochorionic_monoamniotic_twins: ["O30.0"],
};

export function getIcdCodes(conditionId: string): string[] {
  return conditionIcdCodes[conditionId] ?? [];
}
