/**
 * Gestational Age calculation formulas from authoritative sources.
 *
 * CRL:  Hadlock FP et al., Radiology 1992;182:501–505
 * BPD/HC/FL: Hadlock FP et al., Radiology 1984;152:497–501
 * IVF:  ACOG Committee Opinion No. 700 (2017, reaffirmed 2023)
 * LMP:  Naegele's rule — EDD = LMP + 280 days
 */

// ── Milliseconds in one day ──────────────────────────────────────────
const MS_PER_DAY = 86_400_000;

// ── Helpers ──────────────────────────────────────────────────────────

/** Difference in whole days between two Dates (a − b). */
export function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/** Add `n` days to a Date (returns new Date). */
export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * MS_PER_DAY);
}

/** Format a Date as "MMM D, YYYY". */
export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Result type ──────────────────────────────────────────────────────

export interface GAResult {
  /** GA in fractional weeks at the time of measurement / scan. */
  gaWeeksAtScan: number;
  /** GA in whole days at the time of measurement / scan. */
  gaDaysAtScan: number;
  /** Current GA in whole days (gaAtScan + days since scan). */
  currentGADays: number;
  /** Estimated due date. */
  edd: Date;
}

// ── LMP ──────────────────────────────────────────────────────────────

/**
 * Naegele's rule.
 * @param lmp  First day of last menstrual period.
 * @param today  Reference "today" date (defaults to now).
 * @param cycleLength  Menstrual cycle length in days (default 28).
 */
export function calcFromLMP(
  lmp: Date,
  today: Date = new Date(),
  cycleLength = 28,
): GAResult {
  const adjustment = cycleLength - 28; // modified Naegele's
  const gaDays = diffDays(today, lmp) - adjustment;
  const edd = addDays(lmp, 280 + adjustment);
  return {
    gaWeeksAtScan: gaDays / 7,
    gaDaysAtScan: gaDays,
    currentGADays: gaDays,
    edd,
  };
}

/** Reverse LMP: given an EDD, back-calculate the LMP date. */
export function eddToLMP(edd: Date, cycleLength = 28): Date {
  const adjustment = cycleLength - 28;
  return addDays(edd, -(280 + adjustment));
}

// ── CRL (1st trimester) ──────────────────────────────────────────────

/**
 * Hadlock 1992 CRL→GA regression.
 * @param crlMm  Crown-rump length in millimetres (valid 2–84 mm).
 * @param scanDate  Date the ultrasound was performed.
 * @param today  Reference "today" date.
 */
export function calcFromCRL(
  crlMm: number,
  scanDate: Date,
  today: Date = new Date(),
): GAResult {
  const gaWeeks = 5.2876 + 0.1584 * crlMm - 0.0007 * crlMm * crlMm;
  const gaDaysAtScan = Math.round(gaWeeks * 7);
  const daysSinceScan = diffDays(today, scanDate);
  const currentGADays = gaDaysAtScan + daysSinceScan;
  const edd = addDays(scanDate, 280 - gaDaysAtScan);
  return { gaWeeksAtScan: gaWeeks, gaDaysAtScan, currentGADays, edd };
}

/**
 * Reverse CRL: given GA in weeks, estimate the expected CRL (mm).
 * Solves  0.0007·x² − 0.1584·x + (gaWeeks − 5.2876) = 0
 */
export function gaToExpectedCRL(gaWeeks: number): number | null {
  const a = -0.0007;
  const b = 0.1584;
  const c = 5.2876 - gaWeeks;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  // We want the positive root (smaller root for the inverted parabola)
  const root = (-b + Math.sqrt(disc)) / (2 * a);
  return root >= 2 && root <= 84 ? Math.round(root * 10) / 10 : null;
}

/** Valid CRL range in mm. */
export const CRL_MIN = 2;
export const CRL_MAX = 84;

// ── 2nd / 3rd trimester biometry (Hadlock 1984) ──────────────────────

export type BiometryType = "fl" | "bpd" | "hc";

interface BiometryMeta {
  label: string;
  unit: string;
  /** Typical clinical range in mm. */
  minMm: number;
  maxMm: number;
  /** Hadlock regression coefficients: GA(weeks) = c0 + c1·x + c2·x²  (x in cm). */
  c0: number;
  c1: number;
  c2: number;
}

export const BIOMETRY: Record<BiometryType, BiometryMeta> = {
  fl: {
    label: "Femur Length (FL)",
    unit: "mm",
    minMm: 10,
    maxMm: 80,
    c0: 10.35,
    c1: 2.46,
    c2: 0.17,
  },
  bpd: {
    label: "Biparietal Diameter (BPD)",
    unit: "mm",
    minMm: 20,
    maxMm: 100,
    c0: 9.54,
    c1: 1.482,
    c2: 0.1676,
  },
  hc: {
    label: "Head Circumference (HC)",
    unit: "mm",
    minMm: 80,
    maxMm: 370,
    c0: 8.96,
    c1: 0.54,
    c2: 0.0003,
  },
};

/**
 * Hadlock biometry→GA calculation.
 * @param type  Which measurement (fl, bpd, hc).
 * @param valueMm  Measurement in millimetres.
 * @param scanDate  Date of the ultrasound.
 * @param today  Reference "today" date.
 */
export function calcFromBiometry(
  type: BiometryType,
  valueMm: number,
  scanDate: Date,
  today: Date = new Date(),
): GAResult {
  const { c0, c1, c2 } = BIOMETRY[type];
  const valueCm = valueMm / 10;
  const gaWeeks = c0 + c1 * valueCm + c2 * valueCm * valueCm;
  const gaDaysAtScan = Math.round(gaWeeks * 7);
  const daysSinceScan = diffDays(today, scanDate);
  const currentGADays = gaDaysAtScan + daysSinceScan;
  const edd = addDays(scanDate, 280 - gaDaysAtScan);
  return { gaWeeksAtScan: gaWeeks, gaDaysAtScan, currentGADays, edd };
}

/**
 * Reverse biometry: given GA in weeks, estimate the expected measurement (mm).
 * Solves  c2·x² + c1·x + (c0 − gaWeeks) = 0   (x in cm → convert to mm).
 */
export function gaToExpectedBiometry(
  type: BiometryType,
  gaWeeks: number,
): number | null {
  const { c0, c1, c2, minMm, maxMm } = BIOMETRY[type];
  const a = c2;
  const b = c1;
  const c = c0 - gaWeeks;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const root = (-b + Math.sqrt(disc)) / (2 * a); // positive root (cm)
  const mm = root * 10;
  return mm >= minMm && mm <= maxMm ? Math.round(mm * 10) / 10 : null;
}

// ── IVF / ART ────────────────────────────────────────────────────────

export type IVFDateType = "transfer" | "retrieval";

/**
 * IVF gestational age calculation (ACOG CO 700).
 *
 * - Egg retrieval:   GA = days since retrieval + 14
 * - Day-3 transfer:  GA = days since transfer + 17
 * - Day-5 transfer:  GA = days since transfer + 19
 * - Day-6 transfer:  GA = days since transfer + 20
 *
 * EDD = reference date + (266 − embryo age at transfer) for transfers,
 *        or reference date + 266 for retrievals.
 *
 * @param dateType  "transfer" or "retrieval"
 * @param date  The transfer or retrieval date.
 * @param embryoAge  Embryo age at transfer in days (3, 5, or 6). Ignored for retrieval.
 * @param today  Reference "today" date.
 */
export function calcFromIVF(
  dateType: IVFDateType,
  date: Date,
  embryoAge: number,
  today: Date = new Date(),
): GAResult {
  const daysSince = diffDays(today, date);

  let gaDays: number;
  let edd: Date;

  if (dateType === "retrieval") {
    gaDays = daysSince + 14; // retrieval ≈ ovulation → +2w0d
    edd = addDays(date, 266); // 38 weeks from conception
  } else {
    gaDays = daysSince + 14 + embryoAge; // +14 for LMP offset + embryo age
    edd = addDays(date, 266 - embryoAge);
  }

  return {
    gaWeeksAtScan: gaDays / 7,
    gaDaysAtScan: gaDays,
    currentGADays: gaDays,
    edd,
  };
}
