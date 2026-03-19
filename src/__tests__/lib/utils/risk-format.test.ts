import { describe, it, expect } from "vitest";
import {
  formatRiskStatistic,
  getRiskSeverity,
  generateTeachingInterpretation,
} from "@/lib/utils/risk-format";
import type { RiskStatistic } from "@/data/types";

describe("formatRiskStatistic", () => {
  it("formats relative_risk", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 2.5 };
    expect(formatRiskStatistic(stat)).toBe("RR 2.5");
  });

  it("formats odds_ratio", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 1.8 };
    expect(formatRiskStatistic(stat)).toBe("OR 1.8");
  });

  it("formats absolute_risk", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 15 };
    expect(formatRiskStatistic(stat)).toBe("15 per 1,000");
  });

  it("formats incidence", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5.2 };
    expect(formatRiskStatistic(stat)).toBe("5.2%");
  });

  it("formats mortality_rate", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 0.3 };
    expect(formatRiskStatistic(stat)).toBe("0.3% mortality");
  });
});

describe("getRiskSeverity", () => {
  it("returns 'high' for RR >= 2.0", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 2.5 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for RR 1.5-2.0", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.7 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for RR < 1.5", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.2 };
    expect(getRiskSeverity(stat)).toBe("default");
  });

  it("returns 'high' for OR >= 2.0", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 3.0 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for OR 1.5-2.0", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 1.6 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'high' for incidence >= 10%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 15 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for incidence 2-10%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for incidence < 2%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 1 };
    expect(getRiskSeverity(stat)).toBe("default");
  });

  it("returns 'high' for mortality >= 10%", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 12 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'high' for absolute_risk >= 100 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 150 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for absolute_risk 20-100 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 50 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for absolute_risk < 20 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 10 };
    expect(getRiskSeverity(stat)).toBe("default");
  });
});

describe("generateTeachingInterpretation", () => {
  it("interprets relative_risk with CI", () => {
    const stat: RiskStatistic = {
      type: "relative_risk",
      value: 2.5,
      ci95: [1.8, 3.4],
    };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("2.5");
    expect(result).toContain("more likely");
    expect(result).toContain("1.8");
    expect(result).toContain("3.4");
  });

  it("interprets relative_risk without CI", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.5 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("1.5");
    expect(result).toContain("more likely");
    expect(result).not.toContain("confidence interval");
  });

  it("interprets odds_ratio", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 3.0 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("3");
    expect(result).toContain("odds");
  });

  it("interprets absolute_risk with 1-in-N", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 10 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("10 per 1,000");
    expect(result).toContain("1 in 100");
  });

  it("interprets incidence with 1-in-N", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("5%");
    expect(result).toContain("1 in 20");
  });

  it("interprets mortality_rate", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 2 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("2%");
    expect(result).toContain("Mortality");
  });

  it("appends populationDescription when provided", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    const result = generateTeachingInterpretation(stat, "women with GDM");
    expect(result).toContain("women with GDM");
  });
});
