import type { GestationalAgeDays } from "@/data/types";
import { interpolateBaseline } from "./risk-engine";
import { neonatalDeliveryRisk } from "@/data/risk-models/neonatal-delivery-risk";
import { w } from "@/data/helpers";

export interface MortalityIndexPoint {
  ga: GestationalAgeDays;
  /** Stillbirth risk of waiting 1 more week (per 1,000) */
  expectantRisk: number;
  /** Neonatal death risk of delivering now (per 1,000) */
  deliveryRisk: number;
  /** Whether expectant management risk exceeds delivery risk at this GA */
  favorDelivery: boolean;
}

/**
 * Mortality index comparison (Page et al. 2013 methodology).
 *
 * Compares the stillbirth risk of continuing pregnancy (expectant management)
 * with the neonatal death risk of delivery at each GA week.
 * When expectant risk exceeds delivery risk, the balance favors delivery.
 */
export function calculateMortalityIndex(
  combinedMultiplier: number = 1
): MortalityIndexPoint[] {
  const points: MortalityIndexPoint[] = [];

  for (let gaWeek = 37; gaWeek <= 42; gaWeek++) {
    const ga = w(gaWeek);
    const expectantRisk = interpolateBaseline(ga) * combinedMultiplier;

    // Find neonatal risk for this GA
    const neoPoint = neonatalDeliveryRisk.find((p) => p.ga === ga);
    const deliveryRisk = neoPoint?.neonatalDeathPer1000 ?? 0.3;

    points.push({
      ga,
      expectantRisk,
      deliveryRisk,
      favorDelivery: expectantRisk > deliveryRisk,
    });
  }

  return points;
}

/**
 * Find the GA at which mortality index crosses over
 * (expectant management risk exceeds delivery risk).
 */
export function findMortalityCrossover(
  combinedMultiplier: number = 1
): GestationalAgeDays | null {
  const index = calculateMortalityIndex(combinedMultiplier);
  for (const point of index) {
    if (point.favorDelivery) return point.ga;
  }
  return null;
}
