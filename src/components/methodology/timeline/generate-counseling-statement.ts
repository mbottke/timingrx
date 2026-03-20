import type { GestationalAgeDays } from "@/data/types";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";

interface CounselingInput {
  ga: GestationalAgeDays;
  baselineRiskPer1000: number;
  adjustedRiskPer1000: number;
  hasFactors: boolean;
  equivalentBaselineWeek: number | null; // week number (37-42) or null
}

export function generateCounselingStatement(input: CounselingInput): string {
  const { weeks } = gaToWeeksAndDays(input.ga);
  const oneInN = Math.round(1000 / input.adjustedRiskPer1000);

  if (!input.hasFactors) {
    return `At ${weeks} weeks without additional risk factors, baseline stillbirth risk is approximately 1 in ${oneInN.toLocaleString()} ongoing pregnancies.`;
  }

  let statement = `At ${weeks} weeks with these risk factors, stillbirth risk is approximately 1 in ${oneInN.toLocaleString()} ongoing pregnancies`;

  if (input.equivalentBaselineWeek !== null) {
    statement += ` — equivalent to an uncomplicated pregnancy at ${input.equivalentBaselineWeek} weeks`;
  }

  statement += ".";

  // Urgency addendum for very high risk
  if (input.adjustedRiskPer1000 >= 5.0) {
    statement += " Consider the urgency of delivery planning.";
  }

  return statement;
}
