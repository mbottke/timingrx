import type { NeonatalDeliveryRiskPoint } from "../types";
import { w } from "../helpers";

/**
 * GA-specific neonatal morbidity/mortality for the mortality index calculation.
 * Compares "risk of waiting" (stillbirth) vs "risk of delivering now" (neonatal).
 *
 * Sources: NICHD Neonatal Research Network, March of Dimes, MacDorman 2015.
 */
export const neonatalDeliveryRisk: NeonatalDeliveryRiskPoint[] = [
  { ga: w(34), neonatalDeathPer1000: 3.2, nicuAdmissionPercent: 52, rdsTtnPercent: 22 },
  { ga: w(35), neonatalDeathPer1000: 2.1, nicuAdmissionPercent: 35, rdsTtnPercent: 14 },
  { ga: w(36), neonatalDeathPer1000: 1.5, nicuAdmissionPercent: 20, rdsTtnPercent: 8 },
  { ga: w(37), neonatalDeathPer1000: 0.8, nicuAdmissionPercent: 8, rdsTtnPercent: 3.5 },
  { ga: w(38), neonatalDeathPer1000: 0.5, nicuAdmissionPercent: 5, rdsTtnPercent: 2.0 },
  { ga: w(39), neonatalDeathPer1000: 0.3, nicuAdmissionPercent: 3, rdsTtnPercent: 1.0 },
  { ga: w(40), neonatalDeathPer1000: 0.3, nicuAdmissionPercent: 3, rdsTtnPercent: 1.0 },
  { ga: w(41), neonatalDeathPer1000: 0.4, nicuAdmissionPercent: 4, rdsTtnPercent: 1.5 },
  { ga: w(42), neonatalDeathPer1000: 0.6, nicuAdmissionPercent: 6, rdsTtnPercent: 3.0 },
];
