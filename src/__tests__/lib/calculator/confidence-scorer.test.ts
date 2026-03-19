import { describe, it, expect } from "vitest";
import { calculateConfidence } from "@/lib/calculator/confidence-scorer";

describe("calculateConfidence", () => {
  it("returns grade A with high score when no factors (baseline only)", () => {
    const result = calculateConfidence({
      activeFactorIds: [],
      applyInteractions: false,
      combinedMultiplier: 1.0,
      adjustedRiskProportion: 0.0004,
    });
    expect(result.grade).toBe("A");
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.label).toBe("High confidence");
  });

  it("returns moderate confidence with one well-evidenced factor", () => {
    const result = calculateConfidence({
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
      combinedMultiplier: 1.88,
      adjustedRiskProportion: 0.00075,
    });
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.score).toBeLessThan(90);
    expect(result.grade).toBe("B");
  });

  it("penalizes for many factors (compounding uncertainty)", () => {
    const few = calculateConfidence({
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
      combinedMultiplier: 1.88,
      adjustedRiskProportion: 0.00075,
    });
    const many = calculateConfidence({
      activeFactorIds: [
        "age_gte_40",
        "bmi_gte_40",
        "preexisting_diabetes",
        "smoking",
        "prior_stillbirth",
      ],
      applyInteractions: false,
      combinedMultiplier: 1.88 * 3.0 * 2.9 * 1.6 * 3.0,
      adjustedRiskProportion: 0.01,
    });
    expect(many.score).toBeLessThan(few.score);
  });

  it("penalizes for hypothesized interactions", () => {
    const without = calculateConfidence({
      activeFactorIds: ["preexisting_diabetes", "bmi_gte_40"],
      applyInteractions: false,
      combinedMultiplier: 2.9 * 3.0,
      adjustedRiskProportion: 0.003,
    });
    const with_ = calculateConfidence({
      activeFactorIds: ["preexisting_diabetes", "bmi_gte_40"],
      applyInteractions: true,
      combinedMultiplier: 2.9 * 3.0 * 0.85,
      adjustedRiskProportion: 0.003,
    });
    expect(with_.score).toBeLessThanOrEqual(without.score);
  });

  it("provides breakdown of all 5 scoring components", () => {
    const result = calculateConfidence({
      activeFactorIds: ["age_gte_40", "smoking"],
      applyInteractions: false,
      combinedMultiplier: 1.88 * 1.6,
      adjustedRiskProportion: 0.001,
    });
    expect(result.breakdown.evidenceQuality).toBeGreaterThan(0);
    expect(result.breakdown.evidenceQuality).toBeLessThanOrEqual(1);
    expect(result.breakdown.modelValidity).toBeGreaterThan(0);
    expect(result.breakdown.modelValidity).toBeLessThanOrEqual(1);
    expect(result.breakdown.interactionPenalty).toBe(1.0); // no interactions
    expect(result.breakdown.magnitudePlausibility).toBeGreaterThan(0);
    expect(result.breakdown.rareDiseaseValidity).toBe(1.0); // risk < 1%
  });

  it("rare disease penalty activates at high combined risk", () => {
    const lowRisk = calculateConfidence({
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
      combinedMultiplier: 1.88,
      adjustedRiskProportion: 0.0008, // well under 1%
    });
    const highRisk = calculateConfidence({
      activeFactorIds: [
        "age_gte_40",
        "bmi_gte_40",
        "preexisting_diabetes",
        "sga_fetus",
      ],
      applyInteractions: false,
      combinedMultiplier: 1.88 * 3.0 * 2.9 * 3.5,
      adjustedRiskProportion: 0.06, // 6%
    });
    expect(highRisk.breakdown.rareDiseaseValidity).toBeLessThan(
      lowRisk.breakdown.rareDiseaseValidity
    );
  });

  it("generates meaningful explanation text", () => {
    const result = calculateConfidence({
      activeFactorIds: ["age_gte_40"],
      applyInteractions: false,
      combinedMultiplier: 1.88,
      adjustedRiskProportion: 0.0008,
    });
    expect(result.explanation.length).toBeGreaterThan(20);
  });

  // Calibrated scenario tests from the deep analysis
  it("scenario: 3 factors produces Grade C", () => {
    const result = calculateConfidence({
      activeFactorIds: ["age_gte_40", "bmi_gte_40", "smoking"],
      applyInteractions: false,
      combinedMultiplier: 1.88 * 3.0 * 1.6,
      adjustedRiskProportion: 0.0036,
    });
    expect(result.grade).toBe("C");
    expect(result.score).toBeGreaterThanOrEqual(55);
    expect(result.score).toBeLessThan(70);
  });

  it("scenario: 4 factors produces Grade D", () => {
    const result = calculateConfidence({
      activeFactorIds: [
        "age_gte_40",
        "bmi_gte_40",
        "preexisting_diabetes",
        "prior_stillbirth",
      ],
      applyInteractions: false,
      combinedMultiplier: 1.88 * 3.0 * 2.9 * 3.0,
      adjustedRiskProportion: 0.02,
    });
    expect(result.grade).toBe("D");
  });
});
