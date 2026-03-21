import { describe, it, expect } from "vitest";
import { findEquivalentBaselineGA, riskAsOneInX } from "@/lib/calculator/risk-equivalence";

describe("risk equivalence", () => {
  it("finds equivalent GA for elevated risk", () => {
    const equivalentGA = findEquivalentBaselineGA(1.5);
    expect(equivalentGA).not.toBeNull();
    if (equivalentGA) {
      expect(equivalentGA).toBeGreaterThan(37 * 7);
      expect(equivalentGA).toBeLessThan(43 * 7);
    }
  });

  it("returns null for risk below baseline minimum", () => {
    expect(findEquivalentBaselineGA(0.01)).toBeNull();
  });

  it("formats risk as 1 in X correctly", () => {
    expect(riskAsOneInX(2.0)).toBe("1 in 500");
    expect(riskAsOneInX(5.0)).toBe("1 in 200");
  });

  it("returns N/A for zero or negative risk", () => {
    expect(riskAsOneInX(0)).toBe("N/A");
    expect(riskAsOneInX(-1)).toBe("N/A");
  });

  it("returns null for risk above baseline maximum", () => {
    expect(findEquivalentBaselineGA(999)).toBeNull();
  });
});
