import type { GestationalAgeDays } from "@/data/types";
import { interpolateBaseline } from "./risk-engine";
import { w } from "@/data/helpers";

export interface NNTResult {
  /** NNT to prevent 1 stillbirth by delivering now vs waiting 1 week */
  nntOneWeek: number;
  /** Risk if waiting 1 more week (per 1,000) */
  riskIfWaiting: number;
  /** Risk if delivering now (per 1,000, neonatal death) */
  riskIfDelivering: number;
  /** The risk differential (per 1,000) */
  riskDifferential: number;
  /** Context comparisons */
  context: {
    arriveNNTCesarean: number; // 28 (ARRIVE trial)
    swepisNNTDeath: number; // 230 (SWEPIS trial)
    cochraneNNTDeath: number; // 544 (Cochrane)
    alkmarkNNTNullip: number; // 79 (Alkmark, nulliparous)
  };
}

/**
 * Compute NNT to prevent 1 stillbirth by inducing at the current GA
 * vs waiting 1 additional week.
 *
 * NNT = 1 / absolute_risk_reduction
 * ARR = risk_of_waiting_one_week - neonatal_death_risk_of_delivering_now
 */
export function calculateNNT(
  ga: GestationalAgeDays,
  combinedMultiplier: number = 1
): NNTResult {
  const currentRisk = interpolateBaseline(ga) * combinedMultiplier;
  const nextWeekRisk = interpolateBaseline(ga + 7) * combinedMultiplier;

  // Approximate neonatal death risk by GA (simplified — from neonatal data)
  const neonatalRisk = estimateNeonatalDeathRisk(ga);

  // ARR = (stillbirth risk if waiting 1 week) - (neonatal death risk if delivering now)
  const riskDifferential = (nextWeekRisk - neonatalRisk) / 1000;

  const nnt =
    riskDifferential > 0
      ? Math.round(1 / riskDifferential)
      : Infinity;

  return {
    nntOneWeek: nnt,
    riskIfWaiting: nextWeekRisk,
    riskIfDelivering: neonatalRisk,
    riskDifferential: nextWeekRisk - neonatalRisk,
    context: {
      arriveNNTCesarean: 28,
      swepisNNTDeath: 230,
      cochraneNNTDeath: 544,
      alkmarkNNTNullip: 79,
    },
  };
}

/** Simplified neonatal death risk estimate by GA */
function estimateNeonatalDeathRisk(ga: GestationalAgeDays): number {
  // Approximate from neonatal delivery risk data
  if (ga < w(37)) return 1.5;
  if (ga < w(38)) return 0.8;
  if (ga < w(39)) return 0.5;
  if (ga < w(41)) return 0.3;
  if (ga < w(42)) return 0.4;
  return 0.6;
}
