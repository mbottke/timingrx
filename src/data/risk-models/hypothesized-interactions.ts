import type { CalculatorInteraction } from "../types";
import { grade } from "../helpers";

/**
 * Interaction adjustments when multiple risk factors are present.
 *
 * interactionMultiplier < 1.0 = sub-multiplicative (shared pathophysiology)
 * interactionMultiplier > 1.0 = supra-multiplicative (synergistic)
 */
export const hypothesizedInteractions: CalculatorInteraction[] = [
  {
    factorIds: ["preexisting_diabetes", "bmi_gte_40"],
    interactionMultiplier: 0.85,
    description:
      "Diabetes and obesity share metabolic pathophysiology (insulin resistance, " +
      "inflammation). Simple multiplication likely overestimates combined risk. " +
      "0.85\u00d7 adjustment avoids double-counting shared mechanisms.",
    evidenceGrade: grade("C"),
    isHypothesized: true,
  },
  {
    factorIds: ["preexisting_diabetes", "bmi_35_39"],
    interactionMultiplier: 0.88,
    description:
      "Similar metabolic overlap as DM + Class III obesity, slightly less pronounced.",
    evidenceGrade: grade("C"),
    isHypothesized: true,
  },
  {
    factorIds: ["chronic_hypertension", "preexisting_diabetes"],
    interactionMultiplier: 0.9,
    description:
      "HTN and DM frequently co-occur, sharing vascular endothelial dysfunction. " +
      "Moderate adjustment to multiplicative estimate.",
    evidenceGrade: grade("C"),
    isHypothesized: true,
  },
  {
    factorIds: ["age_gte_40", "prior_stillbirth"],
    interactionMultiplier: 1.1,
    description:
      "AMA and prior stillbirth may interact supra-multiplicatively due to " +
      "compounding age-related placental dysfunction with prior loss etiology. " +
      "Conservative 1.1\u00d7 adjustment.",
    evidenceGrade: grade("C"),
    isHypothesized: true,
  },
  {
    factorIds: ["sga_fetus", "chronic_hypertension"],
    interactionMultiplier: 0.8,
    description:
      "SGA in the setting of chronic HTN is often causally related to the HTN " +
      "(uteroplacental insufficiency). Significant sub-multiplicative adjustment " +
      "to avoid double-counting the same vascular pathology.",
    evidenceGrade: grade("C"),
    isHypothesized: true,
  },
];
