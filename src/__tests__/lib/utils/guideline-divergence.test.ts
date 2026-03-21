import { describe, it, expect } from "vitest";
import { detectDivergence } from "@/lib/utils/guideline-divergence";
import type { GuidelineRecommendation } from "@/data/types";

function makeRangeRec(
  body: string,
  earliest: number,
  latest: number,
): GuidelineRecommendation {
  return {
    citations: [
      { body: body as any, documentId: `${body}-doc`, title: `${body} guideline` },
    ],
    timing: { type: "range", range: { earliest, latest } },
    route: "either",
    grade: { raw: "1B", strength: "moderate" },
    notes: "",
  };
}

describe("detectDivergence", () => {
  it("returns no divergence for a single recommendation", () => {
    const result = detectDivergence([makeRangeRec("ACOG", 259, 273)]);
    expect(result.hasDivergence).toBe(false);
    expect(result.maxDivergenceDays).toBe(0);
  });

  it("returns no divergence for two identical ranges", () => {
    const result = detectDivergence([
      makeRangeRec("ACOG", 259, 273),
      makeRangeRec("NICE", 259, 273),
    ]);
    expect(result.hasDivergence).toBe(false);
    expect(result.maxDivergenceDays).toBe(0);
  });

  it("detects divergence for partially overlapping ranges", () => {
    const result = detectDivergence([
      makeRangeRec("ACOG", 259, 273), // 37w0d – 39w0d
      makeRangeRec("NICE", 266, 280), // 38w0d – 40w0d
    ]);
    expect(result.hasDivergence).toBe(true);
    // global span = 280 - 259 = 21, overlap = 273 - 266 = 7, divergence = 21 - 7 = 14
    expect(result.maxDivergenceDays).toBe(14);
    expect(result.overlapGA).toEqual({ earliest: 266, latest: 273 });
    expect(result.divergenceGA).toHaveLength(2);
  });

  it("detects full divergence for non-overlapping ranges", () => {
    const result = detectDivergence([
      makeRangeRec("ACOG", 259, 266), // 37w0d – 38w0d
      makeRangeRec("SMFM", 273, 280), // 39w0d – 40w0d
    ]);
    expect(result.hasDivergence).toBe(true);
    // global span = 280 - 259 = 21, no overlap, divergence = 21
    expect(result.maxDivergenceDays).toBe(21);
    expect(result.overlapGA).toBeUndefined();
  });

  it("ignores non-range timing types", () => {
    const immediateRec: GuidelineRecommendation = {
      citations: [{ body: "ACOG", documentId: "acog-1" }],
      timing: { type: "immediate", context: "emergency" },
      route: "cesarean_required",
      grade: { raw: "1A", strength: "high" },
    };
    const result = detectDivergence([
      immediateRec,
      makeRangeRec("NICE", 259, 273),
    ]);
    expect(result.hasDivergence).toBe(false);
    expect(result.maxDivergenceDays).toBe(0);
  });
});
