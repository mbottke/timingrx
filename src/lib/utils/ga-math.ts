import type { GARange, GestationalAgeDays } from "@/data/types";

export function gaRangesOverlap(a: GARange, b: GARange): boolean {
  return a.earliest <= b.latest && b.earliest <= a.latest;
}

export function mostRestrictiveRange(ranges: GARange[]): GARange | null {
  if (ranges.length === 0) return null;

  const earliest = Math.max(...ranges.map((r) => r.earliest));
  const latest = Math.min(...ranges.map((r) => r.latest));

  if (earliest > latest) return null;
  return { earliest, latest };
}

export function isGAInRange(ga: GestationalAgeDays, range: GARange): boolean {
  return ga >= range.earliest && ga <= range.latest;
}

export function gaRangeIntersection(a: GARange, b: GARange): GARange | null {
  const earliest = Math.max(a.earliest, b.earliest);
  const latest = Math.min(a.latest, b.latest);
  if (earliest > latest) return null;
  return { earliest, latest };
}
