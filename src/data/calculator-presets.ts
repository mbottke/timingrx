export interface CalculatorPreset {
  id: string;
  label: string;
  description: string;
  factorIds: string[];
  defaultGA: number; // GestationalAgeDays
  category: string;
}

export const calculatorPresets: CalculatorPreset[] = [
  {
    id: "ama-nullip-gdm",
    label: "35yo nulliparous with GDM",
    description:
      "Advanced maternal age + nulliparity + preexisting diabetes proxy",
    factorIds: ["age_35_39", "nulliparity", "preexisting_diabetes"],
    defaultGA: 39 * 7,
    category: "Common Scenarios",
  },
  {
    id: "ama40-htn-prior",
    label: "40yo with chronic HTN + prior stillbirth",
    description:
      "High-risk combination with supra-multiplicative interaction",
    factorIds: ["age_gte_40", "chronic_hypertension", "prior_stillbirth"],
    defaultGA: 37 * 7,
    category: "High Risk",
  },
  {
    id: "ivf-42",
    label: "IVF conception, age 42",
    description: "ART conception with advanced maternal age",
    factorIds: ["age_gte_40"],
    defaultGA: 39 * 7,
    category: "Common Scenarios",
  },
  {
    id: "obese-dm-smoke",
    label: "Class III obesity + diabetes + smoking",
    description: "Multiple metabolic risk factors",
    factorIds: ["bmi_gte_40", "preexisting_diabetes", "smoking"],
    defaultGA: 37 * 7,
    category: "High Risk",
  },
  {
    id: "sga-nullip",
    label: "SGA fetus in nulliparous patient",
    description: "Fetal growth restriction with first pregnancy",
    factorIds: ["sga_fetus", "nulliparity"],
    defaultGA: 37 * 7,
    category: "Fetal Indications",
  },
  {
    id: "baseline-39w",
    label: "Low-risk at 39 weeks",
    description: "No additional risk factors — baseline Muglu curve",
    factorIds: [],
    defaultGA: 39 * 7,
    category: "Baseline",
  },
];
