import type { GestationalAgeDays } from "@/data/types";
import { interpolateBaseline } from "./risk-engine";
import { w } from "@/data/helpers";

/**
 * Find the GA at which baseline risk equals the given adjusted risk.
 * E.g., "Your adjusted risk at 39w equals baseline risk at 41w3d."
 */
export function findEquivalentBaselineGA(
  adjustedRiskPer1000: number
): GestationalAgeDays | null {
  let low = w(37);
  let high = w(43);

  const lowRisk = interpolateBaseline(low);
  const highRisk = interpolateBaseline(high);

  if (adjustedRiskPer1000 < lowRisk) return null;
  if (adjustedRiskPer1000 > highRisk) return null;

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const midRisk = interpolateBaseline(mid);
    if (Math.abs(midRisk - adjustedRiskPer1000) < 0.001) return mid;
    if (midRisk < adjustedRiskPer1000) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round((low + high) / 2);
}

/**
 * Format risk as "1 in X" for clinical communication.
 */
export function riskAsOneInX(riskPer1000: number): string {
  if (riskPer1000 <= 0) return "N/A";
  const oneInX = Math.round(1000 / riskPer1000);
  return `1 in ${oneInX.toLocaleString()}`;
}
