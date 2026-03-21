import type { GuidelineRecommendation } from "@/data/types";

export interface DivergenceResult {
  hasDivergence: boolean;
  overlapGA?: { earliest: number; latest: number };
  divergenceGA?: Array<{ body: string; earliest: number; latest: number }>;
  maxDivergenceDays: number;
}

export function detectDivergence(
  recs: GuidelineRecommendation[],
): DivergenceResult {
  const ranges = recs
    .filter((r) => r.timing.type === "range")
    .map((r) => ({
      body: r.citations.map((c) => c.body).join("/"),
      earliest: r.timing.type === "range" ? r.timing.range.earliest : 0,
      latest: r.timing.type === "range" ? r.timing.range.latest : 0,
    }));

  if (ranges.length < 2) return { hasDivergence: false, maxDivergenceDays: 0 };

  const overlapEarliest = Math.max(...ranges.map((r) => r.earliest));
  const overlapLatest = Math.min(...ranges.map((r) => r.latest));
  const globalEarliest = Math.min(...ranges.map((r) => r.earliest));
  const globalLatest = Math.max(...ranges.map((r) => r.latest));

  const hasDivergence =
    overlapEarliest > globalEarliest || overlapLatest < globalLatest;
  const maxDivergenceDays =
    globalLatest -
    globalEarliest -
    Math.max(0, overlapLatest - overlapEarliest);

  return {
    hasDivergence,
    overlapGA:
      overlapEarliest <= overlapLatest
        ? { earliest: overlapEarliest, latest: overlapLatest }
        : undefined,
    divergenceGA: ranges,
    maxDivergenceDays,
  };
}
