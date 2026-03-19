import { describe, it, expect } from "vitest";
import {
  gaRangesOverlap,
  mostRestrictiveRange,
  isGAInRange,
  gaRangeIntersection,
} from "@/lib/utils/ga-math";
import type { GARange } from "@/data/types";

describe("gaRangesOverlap", () => {
  it("returns true for overlapping ranges", () => {
    const a: GARange = { earliest: 259, latest: 272 };
    const b: GARange = { earliest: 266, latest: 279 };
    expect(gaRangesOverlap(a, b)).toBe(true);
  });
  it("returns false for non-overlapping ranges", () => {
    const a: GARange = { earliest: 259, latest: 265 };
    const b: GARange = { earliest: 273, latest: 279 };
    expect(gaRangesOverlap(a, b)).toBe(false);
  });
  it("returns true for touching ranges", () => {
    const a: GARange = { earliest: 259, latest: 266 };
    const b: GARange = { earliest: 266, latest: 279 };
    expect(gaRangesOverlap(a, b)).toBe(true);
  });
});

describe("mostRestrictiveRange", () => {
  it("returns the intersection of multiple ranges", () => {
    const ranges: GARange[] = [
      { earliest: 259, latest: 279 },
      { earliest: 266, latest: 272 },
    ];
    expect(mostRestrictiveRange(ranges)).toEqual({ earliest: 266, latest: 272 });
  });
  it("returns null for non-overlapping ranges", () => {
    const ranges: GARange[] = [
      { earliest: 259, latest: 265 },
      { earliest: 273, latest: 279 },
    ];
    expect(mostRestrictiveRange(ranges)).toBeNull();
  });
  it("returns the single range when only one provided", () => {
    expect(mostRestrictiveRange([{ earliest: 259, latest: 272 }])).toEqual({
      earliest: 259,
      latest: 272,
    });
  });
  it("returns null for empty array", () => {
    expect(mostRestrictiveRange([])).toBeNull();
  });
});

describe("isGAInRange", () => {
  it("returns true when GA is within range", () => {
    expect(isGAInRange(266, { earliest: 259, latest: 272 })).toBe(true);
  });
  it("returns true at boundaries", () => {
    expect(isGAInRange(259, { earliest: 259, latest: 272 })).toBe(true);
    expect(isGAInRange(272, { earliest: 259, latest: 272 })).toBe(true);
  });
  it("returns false outside range", () => {
    expect(isGAInRange(258, { earliest: 259, latest: 272 })).toBe(false);
    expect(isGAInRange(273, { earliest: 259, latest: 272 })).toBe(false);
  });
});

describe("gaRangeIntersection", () => {
  it("returns the overlap of two ranges", () => {
    const a: GARange = { earliest: 259, latest: 279 };
    const b: GARange = { earliest: 266, latest: 286 };
    expect(gaRangeIntersection(a, b)).toEqual({ earliest: 266, latest: 279 });
  });
  it("returns null when no overlap", () => {
    const a: GARange = { earliest: 259, latest: 265 };
    const b: GARange = { earliest: 273, latest: 279 };
    expect(gaRangeIntersection(a, b)).toBeNull();
  });
});
