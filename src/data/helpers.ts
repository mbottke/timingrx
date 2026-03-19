/**
 * Convenience functions for condition data entry.
 * Reduces repetitive boilerplate when authoring 150+ condition files.
 */
import type {
  GestationalAgeDays,
  DeliveryTiming,
  Citation,
  GuidelineBody,
  EvidenceGrade,
  EvidenceStrength,
} from "./types";

/** Convert weeks+days to GestationalAgeDays */
export function w(weeks: number, days: number = 0): GestationalAgeDays {
  return weeks * 7 + days;
}

/** Create a delivery timing range */
export function range(
  earliest: GestationalAgeDays,
  latest: GestationalAgeDays,
  options?: { preferEarlierEnd?: boolean; preferLaterEnd?: boolean }
): DeliveryTiming {
  return { type: "range", range: { earliest, latest }, ...options };
}

/** Create an "individualize" timing */
export function individualize(...triggers: string[]): DeliveryTiming {
  return { type: "individualize", clinicalTriggers: triggers };
}

/** Create an "immediate" timing */
export function immediate(context: string): DeliveryTiming {
  return { type: "immediate", context };
}

/** Create a citation */
export function cite(
  body: GuidelineBody,
  documentId: string,
  year?: number,
  url?: string
): Citation {
  return { body, documentId, year, url };
}

/** Map raw grade strings to evidence strength */
export function grade(raw: string): EvidenceGrade {
  const strengthMap: Record<string, EvidenceStrength> = {
    A: "high",
    "1A": "high",
    B: "moderate",
    "1B": "moderate",
    "2B": "low",
    C: "low",
    "2C": "very_low",
    D: "very_low",
  };
  return { raw, strength: strengthMap[raw] ?? "expert_consensus" };
}
