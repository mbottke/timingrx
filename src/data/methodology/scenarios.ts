export interface MethodologyScenario {
  id: string;
  label: string;
  description: string;
  activeFactorIds: string[];
  applyInteractions: boolean;
  expectedGrade: string;
  expectedScoreApprox: number;
}

export const methodologyScenarios: MethodologyScenario[] = [
  { id: "baseline", label: "Baseline only", description: "No risk factors — Muglu curve alone", activeFactorIds: [], applyInteractions: false, expectedGrade: "A", expectedScoreApprox: 95 },
  { id: "age_40", label: "Age ≥40", description: "Single well-studied factor", activeFactorIds: ["age_gte_40"], applyInteractions: false, expectedGrade: "B", expectedScoreApprox: 84 },
  { id: "age_bmi", label: "Age ≥40 + BMI 35", description: "Two factors, multiplicative model", activeFactorIds: ["age_gte_40", "bmi_35_39"], applyInteractions: false, expectedGrade: "B", expectedScoreApprox: 80 },
  { id: "three_factors", label: "Age + BMI + DM", description: "Three factors with shared pathophysiology", activeFactorIds: ["age_gte_40", "bmi_gte_40", "preexisting_diabetes"], applyInteractions: true, expectedGrade: "C", expectedScoreApprox: 58 },
  { id: "five_factors", label: "5 factors", description: "High complexity, strained model", activeFactorIds: ["age_gte_40", "bmi_gte_40", "preexisting_diabetes", "chronic_hypertension", "prior_stillbirth"], applyInteractions: true, expectedGrade: "D", expectedScoreApprox: 42 },
  { id: "maximum_complexity", label: "Maximum complexity", description: "7 factors — model at its limits", activeFactorIds: ["age_gte_40", "bmi_gte_40", "preexisting_diabetes", "chronic_hypertension", "prior_stillbirth", "sga_fetus", "smoking"], applyInteractions: true, expectedGrade: "F", expectedScoreApprox: 28 },
];
