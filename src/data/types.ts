/**
 * Kairos Core Type Definitions
 *
 * Every condition, recommendation, citation, and risk data point flows through
 * these types. TypeScript strict mode ensures no condition ships with missing fields.
 */

// ── Gestational Age ──────────────────────────────────────────────────────────

/** Completed days since LMP. 259 = 37w0d, 273 = 39w0d, 294 = 42w0d. */
export type GestationalAgeDays = number;

/** Inclusive GA range. When single target, earliest === latest. */
export interface GARange {
  earliest: GestationalAgeDays;
  latest: GestationalAgeDays;
}

/**
 * Three mutually exclusive delivery timing shapes.
 * Calculator operates on "range"; UI handles all three.
 */
export type DeliveryTiming =
  | {
      type: "range";
      range: GARange;
      preferEarlierEnd?: boolean;
      preferLaterEnd?: boolean;
    }
  | { type: "individualize"; clinicalTriggers: string[] }
  | { type: "immediate"; context: string };

// ── Enumerations ─────────────────────────────────────────────────────────────

export type ConditionCategory =
  | "hypertensive"
  | "diabetes"
  | "cardiac_valvular"
  | "cardiac_aortopathy"
  | "cardiac_cardiomyopathy"
  | "cardiac_complex"
  | "renal"
  | "hepatic"
  | "hematologic"
  | "autoimmune_rheumatologic"
  | "endocrine"
  | "neurologic"
  | "pulmonary"
  | "infectious"
  | "substance_use_psychiatric"
  | "obesity"
  | "fetal_cardiac"
  | "fetal_abdominal_wall"
  | "fetal_growth_fluid"
  | "fetal_structural"
  | "placental_uterine"
  | "multiple_gestation"
  | "prior_obstetric_history"
  | "age_demographics"
  | "surgical"
  | "miscellaneous_obstetric";

export const CATEGORY_DISPLAY_NAMES: Record<ConditionCategory, string> = {
  hypertensive: "Hypertensive Disorders",
  diabetes: "Diabetes Mellitus",
  cardiac_valvular: "Cardiac — Valvular & Structural",
  cardiac_aortopathy: "Cardiac — Aortopathies",
  cardiac_cardiomyopathy: "Cardiac — Cardiomyopathies",
  cardiac_complex: "Cardiac — Complex Lesions",
  renal: "Renal Conditions",
  hepatic: "Hepatic Conditions",
  hematologic: "Hematologic Conditions",
  autoimmune_rheumatologic: "Autoimmune & Rheumatologic",
  endocrine: "Endocrine Conditions",
  neurologic: "Neurologic Conditions",
  pulmonary: "Pulmonary Conditions",
  infectious: "Infectious Diseases",
  substance_use_psychiatric: "Substance Use & Psychiatric",
  obesity: "Obesity",
  fetal_cardiac: "Fetal Cardiac Defects",
  fetal_abdominal_wall: "Fetal Abdominal Wall Defects",
  fetal_growth_fluid: "Fetal Growth & Amniotic Fluid",
  fetal_structural: "Fetal Structural Anomalies",
  placental_uterine: "Placental & Uterine Conditions",
  multiple_gestation: "Multiple Gestations",
  prior_obstetric_history: "Prior Obstetric History",
  age_demographics: "Age & Demographics",
  surgical: "Surgical Conditions",
  miscellaneous_obstetric: "Miscellaneous Obstetric",
};

export type DeliveryRoute =
  | "vaginal_preferred"
  | "cesarean_preferred"
  | "cesarean_required"
  | "either"
  | "individualize";

export type EvidenceStrength =
  | "high"
  | "moderate"
  | "low"
  | "very_low"
  | "expert_consensus";

export const EVIDENCE_CONFIDENCE_WEIGHTS: Record<EvidenceStrength, number> = {
  high: 1.0,
  moderate: 0.75,
  low: 0.5,
  very_low: 0.25,
  expert_consensus: 0.15,
};

export interface EvidenceGrade {
  raw: string;
  strength: EvidenceStrength;
}

export type PastFortyWeeksStatus = "yes" | "no" | "borderline" | "case_by_case";

export type GuidelineBody =
  | "ACOG"
  | "SMFM"
  | "NICE"
  | "WHO"
  | "ESC"
  | "AHA"
  | "ACC"
  | "ASH"
  | "AASLD"
  | "KDIGO"
  | "ATA"
  | "RCOG"
  | "FIGO"
  | "AAN"
  | "ACR"
  | "ISHLT"
  | "CDC"
  | "NCCN"
  | "CFF"
  | "ERS"
  | "MASAC"
  | "RCPsych"
  | "SAMHSA"
  | "Cochrane"
  | "other";

// ── Citations ────────────────────────────────────────────────────────────────

export interface Citation {
  body: GuidelineBody;
  documentId: string;
  title?: string;
  year?: number;
  url?: string;
}

export interface GuidelineRecommendation {
  citations: Citation[];
  timing: DeliveryTiming;
  route: DeliveryRoute;
  grade: EvidenceGrade;
  notes?: string;
}

// ── Risk Data ────────────────────────────────────────────────────────────────

export type RiskStatistic =
  | { type: "relative_risk"; value: number; ci95?: [number, number] }
  | { type: "odds_ratio"; value: number; ci95?: [number, number] }
  | { type: "absolute_risk"; valuePer1000: number; ci95?: [number, number] }
  | { type: "incidence"; valuePercent: number }
  | { type: "mortality_rate"; valuePercent: number };

export interface RiskDataPoint {
  outcome: string;
  statistic: RiskStatistic;
  populationDescription?: string;
  citation?: Citation;
}

export interface LandmarkTrial {
  id: string;
  name: string;
  year: number;
  journalCitation: string;
  sampleSize?: number;
  summary: string;
  keyFindings: string[];
  relevantRiskData?: RiskDataPoint[];
}

export type EvidenceSourceType =
  | "registry"
  | "cohort"
  | "surveillance"
  | "protocol"
  | "case_series"
  | "guideline_derived";

export interface KeyEvidenceSource {
  id: string;
  name: string;
  type: EvidenceSourceType;
  description: string;
  yearStarted?: number;
  yearPublished?: number;
  region?: string;
  url?: string;
}

// ── Risk Modifiers ───────────────────────────────────────────────────────────

export type RiskModifierFactor =
  | "maternal_age"
  | "bmi"
  | "parity"
  | "prior_stillbirth"
  | "prior_preterm_birth"
  | "prior_cesarean_count"
  | "race_ethnicity"
  | "ivf_conception"
  | "multiple_gestation"
  | "fetal_sex"
  | "gestational_age_at_diagnosis"
  | "disease_severity"
  | "medication_control_status"
  | "comorbidity_count"
  | "smoking"
  | "other";

export interface RiskModifier {
  factor: RiskModifierFactor;
  effect: string;
  riskData?: RiskDataPoint;
}

// ── Special Considerations ───────────────────────────────────────────────────

export type SpecialConsiderationType =
  | "anticoagulation_bridging"
  | "medication_adjustment"
  | "anesthesia_consideration"
  | "monitoring_requirement"
  | "contraindication"
  | "neonatal_consideration"
  | "postpartum_management"
  | "surgical_planning"
  | "imaging_surveillance"
  | "medication_continuation"
  | "delivery_site_requirement"
  | "other";

export interface SpecialConsideration {
  type: SpecialConsiderationType;
  description: string;
  timing?: string;
  citation?: Citation;
}

// ── Condition Interactions ───────────────────────────────────────────────────

export interface ConditionInteraction {
  interactingConditionId: string;
  interactionType:
    | "additive_risk"
    | "timing_shift"
    | "route_change"
    | "monitoring_change";
  combinedTimingGuidance?: DeliveryTiming;
  combinedRouteGuidance?: DeliveryRoute;
  description: string;
  riskData?: RiskDataPoint;
  citation?: Citation;
}

// ── The Core Entity ──────────────────────────────────────────────────────────

export interface ObstetricCondition {
  id: string;
  name: string;
  category: ConditionCategory;
  tags: string[];

  parentConditionId?: string;
  subVariants?: ObstetricCondition[];
  stratificationAxis?: string;

  guidelineRecommendations: GuidelineRecommendation[];
  pastFortyWeeks: PastFortyWeeksStatus;

  clinicalNotes?: string;
  physiologyExplanation?: string;
  specialConsiderations: SpecialConsideration[];

  riskData: RiskDataPoint[];
  riskModifiers: RiskModifier[];
  landmarkTrials: LandmarkTrial[];
  keyEvidenceSources: KeyEvidenceSource[];

  interactions: ConditionInteraction[];

  lastReviewedDate?: string;
  icdCodes?: string[];
}

// ── Risk Calculator Types ────────────────────────────────────────────────────

export interface BaselineRiskPoint {
  ga: GestationalAgeDays;
  riskPer1000: number;
  ci95Low: number;
  ci95High: number;
}

export interface CalculatorRiskFactor {
  id: string;
  label: string;
  description: string;
  factor: RiskModifierFactor;
  multiplier: number;
  ci95?: [number, number];
  evidenceGrade: EvidenceGrade;
  /**
   * Data reliability score (0-1) for the confidence scorer.
   * Independent of ACOG evidence grade — reflects how reliable the specific
   * multiplier value is, based on study design, sample size, and directness.
   *   0.85-0.95: Large meta-analysis or systematic review
   *   0.75-0.84: Large registry study (n>5K) or well-designed cohort
   *   0.55-0.74: Case-control, smaller studies, or significant indirectness
   *   0.15-0.54: Expert consensus, modeling, or extrapolation
   */
  dataReliability: number;
  source: Citation;
  isHypothesized: boolean;
  category: "maternal" | "fetal" | "obstetric_history" | "social_determinant";
}

export interface CalculatorInteraction {
  factorIds: [string, string];
  interactionMultiplier: number;
  description: string;
  evidenceGrade: EvidenceGrade;
  isHypothesized: boolean;
}

export interface RiskCalculation {
  ga: GestationalAgeDays;
  baselineRiskPer1000: number;
  adjustedRiskPer1000: number;
  /** Propagated 95% CI via log-scale quadrature (GUM/meta-analytic method) */
  adjustedRiskCI95: [number, number];
  /** Zhang & Yu (1998) corrected risk when OR→RR divergence detected. Null if negligible. */
  orCorrectedRiskPer1000?: number;
  factorContributions: Array<{
    factorId: string;
    label: string;
    multiplier: number;
    evidenceGrade: EvidenceGrade;
    dataReliability: number;
    isHypothesized: boolean;
  }>;
  interactionAdjustments: Array<{
    factorIds: [string, string];
    adjustment: number;
    isHypothesized: boolean;
  }>;
  confidenceScore: ConfidenceScore;
}

/**
 * Two-layer confidence assessment.
 *
 * Formula: Score = 100 × EQ × MV × IP × MP × RP
 *
 * EQ = (R_baseline + Σ R_i) / (1 + n), R_baseline = 0.95
 * MV = max(0.40, 1.0 - 0.03n - 0.005n²)
 * IP = max(0.75, 1.0 - 0.05H - 0.02P)
 * MP = stepwise from combined multiplier M
 * RP = stepwise from adjusted absolute risk (OR→RR validity)
 */
export interface ConfidenceScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label:
    | "High confidence"
    | "Moderate confidence"
    | "Limited confidence"
    | "Low confidence"
    | "Very low confidence";
  breakdown: {
    evidenceQuality: number;
    modelValidity: number;
    interactionPenalty: number;
    magnitudePlausibility: number;
    rareDiseaseValidity: number;
  };
  explanation: string;
}

// ── Calculator Input/Output ──────────────────────────────────────────────────

export interface CalculatorInput {
  ga: GestationalAgeDays;
  activeFactorIds: string[];
  applyInteractions: boolean;
}

export interface ConfidenceScorerInput {
  activeFactorIds: string[];
  applyInteractions: boolean;
}

export interface NeonatalDeliveryRiskPoint {
  ga: GestationalAgeDays;
  neonatalDeathPer1000: number;
  nicuAdmissionPercent: number;
  rdsTtnPercent: number;
}

// ── Top-level Dataset ────────────────────────────────────────────────────────

export interface DeliveryTimingDataset {
  version: string;
  lastUpdated: string;
  foundationalPrinciples: string[];
  conditions: ObstetricCondition[];
}
