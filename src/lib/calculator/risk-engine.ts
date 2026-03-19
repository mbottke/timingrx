import type {
  CalculatorInput,
  GestationalAgeDays,
  RiskCalculation,
} from "@/data/types";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { hypothesizedInteractions } from "@/data/risk-models/hypothesized-interactions";
import { calculateConfidence } from "./confidence-scorer";
import { w } from "@/data/helpers";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

/**
 * Linear interpolation of baseline stillbirth risk at any GA.
 * Returns risk per 1,000 ongoing pregnancies.
 */
export function interpolateBaseline(ga: GestationalAgeDays): number {
  const data = baselineStillbirthCurve;

  if (ga <= data[0].ga) return data[0].riskPer1000;
  if (ga >= data[data.length - 1].ga)
    return data[data.length - 1].riskPer1000;

  for (let i = 0; i < data.length - 1; i++) {
    if (ga >= data[i].ga && ga <= data[i + 1].ga) {
      const t = (ga - data[i].ga) / (data[i + 1].ga - data[i].ga);
      return data[i].riskPer1000 + t * (data[i + 1].riskPer1000 - data[i].riskPer1000);
    }
  }

  return data[data.length - 1].riskPer1000;
}

/**
 * Interpolate baseline CI bounds at a given GA.
 */
function interpolateBaselineCI(ga: GestationalAgeDays): [number, number] {
  const data = baselineStillbirthCurve;

  if (ga <= data[0].ga) return [data[0].ci95Low, data[0].ci95High];
  if (ga >= data[data.length - 1].ga) {
    return [data[data.length - 1].ci95Low, data[data.length - 1].ci95High];
  }

  for (let i = 0; i < data.length - 1; i++) {
    if (ga >= data[i].ga && ga <= data[i + 1].ga) {
      const t = (ga - data[i].ga) / (data[i + 1].ga - data[i].ga);
      const low = data[i].ci95Low + t * (data[i + 1].ci95Low - data[i].ci95Low);
      const high = data[i].ci95High + t * (data[i + 1].ci95High - data[i].ci95High);
      return [low, high];
    }
  }

  return [data[data.length - 1].ci95Low, data[data.length - 1].ci95High];
}

/**
 * Propagate 95% CI through multiplicative factors using log-scale quadrature.
 *
 * Var(ln(combined)) = Var(ln(baseline)) + Σ Var(ln(RR_i))
 * where Var(ln(RR_i)) = [(ln(upper) - ln(lower)) / (2 * 1.96)]²
 */
function propagateCI(
  baselineRisk: number,
  baselineCI: [number, number],
  activeFactors: Array<{ multiplier: number; ci95?: [number, number] }>,
  combinedMultiplier: number
): [number, number] {
  const adjustedRisk = baselineRisk * combinedMultiplier;

  // Baseline variance on log scale
  const lnBaselineVar =
    baselineCI[0] > 0 && baselineCI[1] > 0
      ? Math.pow(
          (Math.log(baselineCI[1]) - Math.log(baselineCI[0])) / (2 * 1.96),
          2
        )
      : 0;

  // Sum of factor variances on log scale
  let factorVar = 0;
  for (const f of activeFactors) {
    if (f.ci95 && f.ci95[0] > 0 && f.ci95[1] > 0) {
      const v = Math.pow(
        (Math.log(f.ci95[1]) - Math.log(f.ci95[0])) / (2 * 1.96),
        2
      );
      factorVar += v;
    }
  }

  const combinedVar = lnBaselineVar + factorVar;
  const combinedSE = Math.sqrt(combinedVar);
  const lnAdjusted = Math.log(adjustedRisk);

  return [
    Math.exp(lnAdjusted - 1.96 * combinedSE),
    Math.exp(lnAdjusted + 1.96 * combinedSE),
  ];
}

/**
 * Zhang & Yu (1998) OR → RR correction.
 * RR = OR / [(1 - P₀) + (P₀ × OR)]
 */
function zhangYuCorrection(
  baselineRiskProportion: number,
  combinedOR: number
): number {
  const correctedRR =
    combinedOR /
    (1 - baselineRiskProportion + baselineRiskProportion * combinedOR);
  return correctedRR * baselineRiskProportion * 1000;
}

/**
 * Core risk calculation for a single GA point.
 */
export function calculateRisk(input: CalculatorInput): RiskCalculation {
  const baselineRisk = interpolateBaseline(input.ga);
  const baselineCI = interpolateBaselineCI(input.ga);

  // Resolve active factors
  const activeFactors = input.activeFactorIds
    .map((id) => factorMap.get(id))
    .filter((f) => f !== undefined);

  // Calculate combined multiplier
  let combinedMultiplier = 1;
  const factorContributions: RiskCalculation["factorContributions"] = [];

  for (const factor of activeFactors) {
    combinedMultiplier *= factor.multiplier;
    factorContributions.push({
      factorId: factor.id,
      label: factor.label,
      multiplier: factor.multiplier,
      evidenceGrade: factor.evidenceGrade,
      dataReliability: factor.dataReliability,
      isHypothesized: factor.isHypothesized,
    });
  }

  // Apply interaction adjustments
  const interactionAdjustments: RiskCalculation["interactionAdjustments"] = [];
  if (input.applyInteractions) {
    const activeIdSet = new Set(input.activeFactorIds);
    for (const interaction of hypothesizedInteractions) {
      if (
        activeIdSet.has(interaction.factorIds[0]) &&
        activeIdSet.has(interaction.factorIds[1])
      ) {
        combinedMultiplier *= interaction.interactionMultiplier;
        interactionAdjustments.push({
          factorIds: interaction.factorIds,
          adjustment: interaction.interactionMultiplier,
          isHypothesized: interaction.isHypothesized,
        });
      }
    }
  }

  const adjustedRisk = baselineRisk * combinedMultiplier;

  // Propagate CI
  const adjustedRiskCI95 = propagateCI(
    baselineRisk,
    baselineCI,
    activeFactors,
    combinedMultiplier
  );

  // Zhang & Yu correction when combined risk exceeds 1%
  const adjustedRiskProportion = adjustedRisk / 1000;
  let orCorrectedRiskPer1000: number | undefined;
  if (adjustedRiskProportion >= 0.01 && combinedMultiplier > 1) {
    orCorrectedRiskPer1000 = zhangYuCorrection(
      baselineRisk / 1000,
      combinedMultiplier
    );
  }

  // Confidence score
  const confidenceScore = calculateConfidence({
    activeFactorIds: input.activeFactorIds,
    applyInteractions: input.applyInteractions,
    combinedMultiplier,
    adjustedRiskProportion,
  });

  return {
    ga: input.ga,
    baselineRiskPer1000: baselineRisk,
    adjustedRiskPer1000: adjustedRisk,
    adjustedRiskCI95,
    orCorrectedRiskPer1000,
    factorContributions,
    interactionAdjustments,
    confidenceScore,
  };
}

/**
 * Calculate the full risk curve across all GA weeks 37-42.
 */
export function calculateRiskCurve(input: {
  activeFactorIds: string[];
  applyInteractions: boolean;
}): RiskCalculation[] {
  return baselineStillbirthCurve.map((point) =>
    calculateRisk({
      ga: point.ga,
      activeFactorIds: input.activeFactorIds,
      applyInteractions: input.applyInteractions,
    })
  );
}
