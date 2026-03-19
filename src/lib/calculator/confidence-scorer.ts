import type { ConfidenceScore } from "@/data/types";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { hypothesizedInteractions } from "@/data/risk-models/hypothesized-interactions";

const R_BASELINE = 0.95;

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

interface ConfidenceScorerInput {
  activeFactorIds: string[];
  applyInteractions: boolean;
  combinedMultiplier: number;
  adjustedRiskProportion: number;
}

/**
 * Score = 100 × EQ × MV × IP × MP × RP
 *
 * EQ = Evidence Quality (data reliability of inputs)
 * MV = Model Validity (multiplicative independence assumption)
 * IP = Interaction Penalty (hypothesized interaction uncertainty)
 * MP = Magnitude Plausibility (extreme combined multiplier)
 * RP = Rare Disease Validity (OR ≈ RR assumption, Zhang & Yu 1998)
 */
export function calculateConfidence(
  input: ConfidenceScorerInput
): ConfidenceScore {
  const activeFactors = input.activeFactorIds
    .map((id) => factorMap.get(id))
    .filter((f) => f !== undefined);

  const n = activeFactors.length;

  // EQ: Evidence Quality
  const reliabilities = activeFactors.map((f) => f.dataReliability);
  const sumR = reliabilities.reduce((acc, r) => acc + r, 0);
  const eq = (R_BASELINE + sumR) / (1 + n);

  // MV: Model Validity — polynomial decay
  const mv = Math.max(0.4, 1.0 - 0.03 * n - 0.005 * n * n);

  // IP: Interaction Penalty
  let hypothesizedCount = 0;
  let publishedCount = 0;
  if (input.applyInteractions) {
    const activeIdSet = new Set(input.activeFactorIds);
    for (const interaction of hypothesizedInteractions) {
      if (
        activeIdSet.has(interaction.factorIds[0]) &&
        activeIdSet.has(interaction.factorIds[1])
      ) {
        if (interaction.isHypothesized) {
          hypothesizedCount++;
        } else {
          publishedCount++;
        }
      }
    }
  }
  const ip = Math.max(
    0.75,
    1.0 - 0.05 * hypothesizedCount - 0.02 * publishedCount
  );

  // MP: Magnitude Plausibility — stepwise with linear interpolation
  const mp = magnitudePlausibility(input.combinedMultiplier);

  // RP: Rare Disease Validity — OR ≈ RR assumption
  const rp = rareDiseaseValidity(input.adjustedRiskProportion);

  const rawScore = 100 * eq * mv * ip * mp * rp;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  const gradeInfo = scoreToGrade(score);

  return {
    score,
    grade: gradeInfo.grade,
    label: gradeInfo.label,
    breakdown: {
      evidenceQuality: round3(eq),
      modelValidity: round3(mv),
      interactionPenalty: round3(ip),
      magnitudePlausibility: round3(mp),
      rareDiseaseValidity: round3(rp),
    },
    explanation: generateExplanation(
      n,
      score,
      gradeInfo.grade,
      hypothesizedCount,
      input.combinedMultiplier,
      input.adjustedRiskProportion
    ),
  };
}

function magnitudePlausibility(m: number): number {
  if (m < 4) return 1.0;
  if (m < 8) return lerp(1.0, 0.93, (m - 4) / 4);
  if (m < 15) return lerp(0.93, 0.85, (m - 8) / 7);
  if (m < 25) return lerp(0.85, 0.78, (m - 15) / 10);
  return lerp(0.78, 0.72, Math.min((m - 25) / 25, 1));
}

function rareDiseaseValidity(riskProportion: number): number {
  if (riskProportion < 0.01) return 1.0;
  if (riskProportion < 0.05) return lerp(1.0, 0.95, (riskProportion - 0.01) / 0.04);
  if (riskProportion < 0.1) return lerp(0.95, 0.88, (riskProportion - 0.05) / 0.05);
  if (riskProportion < 0.2) return lerp(0.88, 0.78, (riskProportion - 0.1) / 0.1);
  return lerp(0.78, 0.65, Math.min((riskProportion - 0.2) / 0.2, 1));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function scoreToGrade(score: number): {
  grade: ConfidenceScore["grade"];
  label: ConfidenceScore["label"];
} {
  if (score >= 85) return { grade: "A", label: "High confidence" };
  if (score >= 70) return { grade: "B", label: "Moderate confidence" };
  if (score >= 55) return { grade: "C", label: "Limited confidence" };
  if (score >= 40) return { grade: "D", label: "Low confidence" };
  return { grade: "F", label: "Very low confidence" };
}

function generateExplanation(
  factorCount: number,
  score: number,
  grade: string,
  hypothesizedInteractionCount: number,
  combinedMultiplier: number,
  adjustedRiskProportion: number
): string {
  const parts: string[] = [];

  if (factorCount === 0) {
    parts.push(
      "Based entirely on the Muglu 2019 meta-analysis (n=15 million pregnancies). " +
        "No additional risk factors applied."
    );
  } else if (factorCount <= 2) {
    parts.push(
      `Uses ${factorCount} well-studied risk factor${factorCount > 1 ? "s" : ""} ` +
        "applied to high-quality baseline data."
    );
    if (combinedMultiplier < 4) {
      parts.push(
        "The multiplicative assumption is reasonable for this combination."
      );
    }
  } else if (factorCount <= 4) {
    parts.push(
      `Combines ${factorCount} risk factors. The multiplicative independence assumption ` +
        "is increasingly strained with more factors."
    );
  } else {
    parts.push(
      `Combines ${factorCount} risk factors from separate studies. ` +
        "The multiplicative model has NOT been validated for this combination."
    );
  }

  if (hypothesizedInteractionCount > 0) {
    parts.push(
      `${hypothesizedInteractionCount} hypothesized interaction adjustment${hypothesizedInteractionCount > 1 ? "s" : ""} applied. ` +
        "These improve accuracy but introduce additional uncertainty."
    );
  }

  if (adjustedRiskProportion >= 0.01) {
    parts.push(
      "The OR\u2248RR approximation is weakening at this combined risk level. " +
        "The Zhang & Yu corrected estimate may be more accurate."
    );
  }

  if (grade === "D" || grade === "F") {
    parts.push(
      "Clinical judgment should weigh heavily against this estimate."
    );
  }

  return parts.join(" ");
}
