import type { CalculatorRiskFactor } from "../types";
import { cite, grade } from "../helpers";

/**
 * Published adjusted odds ratios / relative risks for stillbirth risk factors.
 * Each multiplier is applied to the baseline Muglu curve.
 *
 * For the rare-disease assumption (stillbirth <1%), OR ≈ RR.
 * When combined risk exceeds ~1%, the Zhang & Yu (1998) correction is applied.
 *
 * dataReliability scores are assessed independently of ACOG recommendation grades,
 * based on actual study quality, sample size, and directness of evidence.
 */
export const riskFactorMultipliers: CalculatorRiskFactor[] = [
  // ── Maternal Age ───────────────────────────────────────────────────────
  {
    id: "age_35_39",
    label: "Maternal age 35\u201339",
    description:
      "Stillbirth risk RR 1.32 vs age <35 (1 in 382 at term)",
    factor: "maternal_age",
    multiplier: 1.32,
    ci95: [1.22, 1.43],
    evidenceGrade: grade("2C"),
    dataReliability: 0.80,
    source: cite("ACOG", "OCC #11", 2022),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "age_gte_40",
    label: "Maternal age \u226540",
    description:
      "Stillbirth risk RR 1.88 vs age <35 (1 in 267 at term). " +
      "At 39w: risk \u2248 25yo at 42w.",
    factor: "maternal_age",
    multiplier: 1.88,
    ci95: [1.64, 2.16],
    evidenceGrade: grade("2C"),
    dataReliability: 0.80,
    source: cite("ACOG", "OCC #11", 2022),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "age_gte_45",
    label: "Maternal age \u226545",
    description: "Estimated stillbirth risk ~2.5\u20133.0\u00d7 vs age <35",
    factor: "maternal_age",
    multiplier: 2.75,
    ci95: [2.0, 3.5],
    evidenceGrade: grade("C"),
    dataReliability: 0.65,
    source: cite("other", "Reddy et al., Obstet Gynecol 2006", 2006),
    isHypothesized: false,
    category: "maternal",
  },

  // ── BMI ────────────────────────────────────────────────────────────────
  {
    id: "bmi_30_34",
    label: "BMI 30\u201334.9 (Class I obesity)",
    description: "Stillbirth aOR ~1.6 vs normal BMI",
    factor: "bmi",
    multiplier: 1.6,
    ci95: [1.35, 1.90],
    evidenceGrade: grade("B"),
    dataReliability: 0.85,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "bmi_35_39",
    label: "BMI 35\u201339.9 (Class II obesity)",
    description: "Stillbirth aOR ~2.1 vs normal BMI",
    factor: "bmi",
    multiplier: 2.1,
    ci95: [1.7, 2.6],
    evidenceGrade: grade("B"),
    dataReliability: 0.85,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "bmi_gte_40",
    label: "BMI \u226540 (Class III obesity)",
    description:
      "Stillbirth aOR ~2.5\u20133.5 vs normal BMI. " +
      "~3-fold increased risk particularly after 39w.",
    factor: "bmi",
    multiplier: 3.0,
    ci95: [2.2, 4.1],
    evidenceGrade: grade("B"),
    dataReliability: 0.80,
    source: cite("ACOG", "PB 230", 2021),
    isHypothesized: false,
    category: "maternal",
  },

  // ── Medical Conditions ─────────────────────────────────────────────────
  {
    id: "preexisting_diabetes",
    label: "Pre-existing diabetes (Type 1 or 2)",
    description: "Stillbirth aOR ~2.9 vs no diabetes",
    factor: "disease_severity",
    multiplier: 2.9,
    ci95: [2.1, 4.1],
    evidenceGrade: grade("B"),
    dataReliability: 0.85,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "chronic_hypertension",
    label: "Chronic hypertension",
    description: "Stillbirth aOR ~2.4 vs normotensive",
    factor: "disease_severity",
    multiplier: 2.4,
    ci95: [1.7, 3.4],
    evidenceGrade: grade("B"),
    dataReliability: 0.80,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "maternal",
  },
  {
    id: "sga_fetus",
    label: "SGA fetus (<10th percentile)",
    description: "Stillbirth aOR ~3.5 vs AGA",
    factor: "disease_severity",
    multiplier: 3.5,
    ci95: [2.6, 4.8],
    evidenceGrade: grade("B"),
    dataReliability: 0.80,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "fetal",
  },

  // ── Obstetric History ──────────────────────────────────────────────────
  {
    id: "prior_stillbirth",
    label: "Prior stillbirth",
    description:
      "Recurrence risk ~2\u20135\u00d7 baseline depending on etiology",
    factor: "prior_stillbirth",
    multiplier: 3.0,
    ci95: [2.0, 5.0],
    evidenceGrade: grade("C"),
    dataReliability: 0.55,
    source: cite("other", "SCRN Case-Control Study", 2014),
    isHypothesized: false,
    category: "obstetric_history",
  },
  {
    id: "nulliparity",
    label: "Nulliparity",
    description: "Stillbirth aOR ~1.3 vs multiparous",
    factor: "parity",
    multiplier: 1.3,
    ci95: [1.1, 1.5],
    evidenceGrade: grade("C"),
    dataReliability: 0.75,
    source: cite("other", "Smith, AJOG 2001", 2001),
    isHypothesized: false,
    category: "obstetric_history",
  },

  // ── Social Determinants ────────────────────────────────────────────────
  {
    id: "smoking",
    label: "Current smoking",
    description: "Stillbirth aOR ~1.6 vs non-smoker",
    factor: "smoking",
    multiplier: 1.6,
    ci95: [1.4, 1.9],
    evidenceGrade: grade("B"),
    dataReliability: 0.85,
    source: cite("other", "Flenady et al., Lancet 2011", 2011),
    isHypothesized: false,
    category: "social_determinant",
  },
  {
    id: "black_race",
    label: "Black race/ethnicity",
    description:
      "2.2\u00d7 overall stillbirth risk reflecting structural health " +
      "disparities, not biological determinism. Disparities at every GA.",
    factor: "race_ethnicity",
    multiplier: 2.2,
    ci95: [1.8, 2.7],
    evidenceGrade: grade("B"),
    dataReliability: 0.70,
    source: cite("other", "MBRRACE-UK; NICE NG207", 2021),
    isHypothesized: false,
    category: "social_determinant",
  },
];
