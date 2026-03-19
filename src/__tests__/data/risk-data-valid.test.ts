import { describe, it, expect } from "vitest";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { hypothesizedInteractions } from "@/data/risk-models/hypothesized-interactions";

describe("Baseline stillbirth curve", () => {
  it("has data points for GA 37-42 weeks", () => {
    expect(baselineStillbirthCurve.length).toBe(6);
  });

  it("all risk values are positive", () => {
    for (const p of baselineStillbirthCurve) {
      expect(p.riskPer1000).toBeGreaterThan(0);
    }
  });

  it("risk increases monotonically with GA", () => {
    for (let i = 1; i < baselineStillbirthCurve.length; i++) {
      expect(baselineStillbirthCurve[i].riskPer1000).toBeGreaterThan(
        baselineStillbirthCurve[i - 1].riskPer1000
      );
    }
  });

  it("CI low < value < CI high", () => {
    for (const p of baselineStillbirthCurve) {
      expect(p.ci95Low).toBeLessThan(p.riskPer1000);
      expect(p.ci95High).toBeGreaterThan(p.riskPer1000);
    }
  });
});

describe("Risk factor multipliers", () => {
  it("all multipliers are > 0", () => {
    for (const f of riskFactorMultipliers) {
      expect(f.multiplier, `Factor ${f.id}`).toBeGreaterThan(0);
    }
  });

  it("all factors have unique IDs", () => {
    const ids = riskFactorMultipliers.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all factors have evidence grades", () => {
    for (const f of riskFactorMultipliers) {
      expect(f.evidenceGrade.strength, `Factor ${f.id}`).toBeTruthy();
    }
  });

  it("all factors have dataReliability between 0 and 1", () => {
    for (const f of riskFactorMultipliers) {
      expect(f.dataReliability, `Factor ${f.id}`).toBeGreaterThan(0);
      expect(f.dataReliability, `Factor ${f.id}`).toBeLessThanOrEqual(1);
    }
  });

  it("factors with CI95 have lower < upper", () => {
    for (const f of riskFactorMultipliers) {
      if (f.ci95) {
        expect(f.ci95[0], `Factor ${f.id} CI lower`).toBeLessThan(f.ci95[1]);
      }
    }
  });
});

describe("Hypothesized interactions", () => {
  it("all reference valid factor IDs", () => {
    const validIds = new Set(riskFactorMultipliers.map((f) => f.id));
    for (const i of hypothesizedInteractions) {
      expect(
        validIds.has(i.factorIds[0]),
        `Unknown factor ${i.factorIds[0]}`
      ).toBe(true);
      expect(
        validIds.has(i.factorIds[1]),
        `Unknown factor ${i.factorIds[1]}`
      ).toBe(true);
    }
  });

  it("all interactions have multipliers > 0", () => {
    for (const i of hypothesizedInteractions) {
      expect(i.interactionMultiplier).toBeGreaterThan(0);
    }
  });

  it("all interactions are marked as hypothesized or published", () => {
    for (const i of hypothesizedInteractions) {
      expect(typeof i.isHypothesized).toBe("boolean");
    }
  });
});
