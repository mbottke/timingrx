import { describe, it, expect } from "vitest";
import {
  calculateRisk,
  calculateRiskCurve,
  interpolateBaseline,
} from "@/lib/calculator/risk-engine";
import { w } from "@/data/helpers";

describe("interpolateBaseline", () => {
  it("returns exact value at data points", () => {
    expect(interpolateBaseline(w(39))).toBeCloseTo(0.4, 2);
    expect(interpolateBaseline(w(40))).toBeCloseTo(0.69, 2);
    expect(interpolateBaseline(w(42))).toBeCloseTo(3.18, 2);
  });

  it("interpolates between weekly data points", () => {
    const mid = interpolateBaseline(w(39, 3)); // 39w3d — midway between 39w and 40w
    expect(mid).toBeGreaterThan(0.4);
    expect(mid).toBeLessThan(0.69);
  });

  it("clamps below 37w to 37w value", () => {
    expect(interpolateBaseline(w(36))).toBeCloseTo(0.11, 2);
  });

  it("clamps above 42w to 42w value", () => {
    expect(interpolateBaseline(w(43))).toBeCloseTo(3.18, 2);
  });
});

describe("calculateRisk", () => {
  it("returns baseline risk when no factors selected", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: [],
      applyInteractions: false,
    });
    expect(result.baselineRiskPer1000).toBeCloseTo(0.4, 2);
    expect(result.adjustedRiskPer1000).toBeCloseTo(0.4, 2);
    expect(result.factorContributions).toHaveLength(0);
  });

  it("applies single risk factor multiplier", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
    });
    expect(result.baselineRiskPer1000).toBeCloseTo(0.4, 2);
    expect(result.adjustedRiskPer1000).toBeCloseTo(0.4 * 1.88, 1);
    expect(result.factorContributions).toHaveLength(1);
    expect(result.factorContributions[0].multiplier).toBe(1.88);
  });

  it("applies multiple risk factors multiplicatively", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["age_gte_40", "bmi_gte_40"],
      applyInteractions: false,
    });
    expect(result.adjustedRiskPer1000).toBeCloseTo(0.4 * 1.88 * 3.0, 1);
  });

  it("applies interaction adjustments when enabled", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["preexisting_diabetes", "bmi_gte_40"],
      applyInteractions: true,
    });
    expect(result.adjustedRiskPer1000).toBeCloseTo(
      0.4 * 2.9 * 3.0 * 0.85,
      1
    );
    expect(result.interactionAdjustments).toHaveLength(1);
  });

  it("does NOT apply interactions when disabled", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["preexisting_diabetes", "bmi_gte_40"],
      applyInteractions: false,
    });
    expect(result.adjustedRiskPer1000).toBeCloseTo(0.4 * 2.9 * 3.0, 1);
    expect(result.interactionAdjustments).toHaveLength(0);
  });

  it("ignores unknown factor IDs gracefully", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["nonexistent_factor"],
      applyInteractions: false,
    });
    expect(result.adjustedRiskPer1000).toBeCloseTo(0.4, 2);
    expect(result.factorContributions).toHaveLength(0);
  });

  it("computes propagated 95% CI", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
    });
    expect(result.adjustedRiskCI95[0]).toBeLessThan(result.adjustedRiskPer1000);
    expect(result.adjustedRiskCI95[1]).toBeGreaterThan(
      result.adjustedRiskPer1000
    );
  });

  it("includes confidence score", () => {
    const result = calculateRisk({
      ga: w(39),
      activeFactorIds: [],
      applyInteractions: false,
    });
    expect(result.confidenceScore.score).toBeGreaterThanOrEqual(90);
    expect(result.confidenceScore.grade).toBe("A");
  });
});

describe("calculateRiskCurve", () => {
  it("returns points for all GA weeks 37-42", () => {
    const curve = calculateRiskCurve({
      activeFactorIds: [],
      applyInteractions: false,
    });
    expect(curve.length).toBe(6);
    expect(curve[0].ga).toBe(w(37));
    expect(curve[5].ga).toBe(w(42));
  });

  it("risk increases monotonically for baseline", () => {
    const curve = calculateRiskCurve({
      activeFactorIds: [],
      applyInteractions: false,
    });
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].adjustedRiskPer1000).toBeGreaterThan(
        curve[i - 1].adjustedRiskPer1000
      );
    }
  });

  it("adjusted curve is shifted up when factors applied", () => {
    const baseline = calculateRiskCurve({
      activeFactorIds: [],
      applyInteractions: false,
    });
    const adjusted = calculateRiskCurve({
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
    });
    for (let i = 0; i < baseline.length; i++) {
      expect(adjusted[i].adjustedRiskPer1000).toBeGreaterThan(
        baseline[i].adjustedRiskPer1000
      );
    }
  });
});
