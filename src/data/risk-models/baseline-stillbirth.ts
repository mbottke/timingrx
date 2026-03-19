import type { BaselineRiskPoint, Citation } from "../types";
import { w } from "../helpers";

/**
 * Muglu et al. 2019, PLOS Medicine. n = 15 million pregnancies.
 * Prospective stillbirth risk per 1,000 ongoing pregnancies at start of each week.
 * Uses "fetuses-at-risk" denominator methodology (Smith 2001).
 *
 * This is the highest-quality data available for baseline stillbirth risk at term.
 * Data reliability: 0.95 (systematic review + meta-analysis of large cohorts).
 */
export const baselineStillbirthCurve: BaselineRiskPoint[] = [
  { ga: w(37), riskPer1000: 0.11, ci95Low: 0.07, ci95High: 0.15 },
  { ga: w(38), riskPer1000: 0.21, ci95Low: 0.13, ci95High: 0.32 },
  { ga: w(39), riskPer1000: 0.40, ci95Low: 0.25, ci95High: 0.58 },
  { ga: w(40), riskPer1000: 0.69, ci95Low: 0.45, ci95High: 1.00 },
  { ga: w(41), riskPer1000: 1.30, ci95Low: 0.85, ci95High: 1.85 },
  { ga: w(42), riskPer1000: 3.18, ci95Low: 1.84, ci95High: 4.35 },
];

export const baselineCitation: Citation = {
  body: "other",
  documentId: "Muglu et al., PLOS Medicine 2019",
  title:
    "Risks of stillbirth and neonatal death with advancing gestation at term: " +
    "A systematic review and meta-analysis of cohort studies of 15 million pregnancies",
  year: 2019,
};
