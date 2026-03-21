import { describe, it, expect } from "vitest";
import { getFactorsForCondition, hasCalculatorMapping } from "@/lib/utils/condition-factor-mapping";

describe("condition-factor-mapping", () => {
  it("returns correct factors for chronic HTN", () => {
    expect(getFactorsForCondition("chronic_htn")).toEqual(["chronic_hypertension"]);
  });

  it("returns empty array for unmapped condition", () => {
    expect(getFactorsForCondition("nonexistent")).toEqual([]);
  });

  it("hasCalculatorMapping returns false for conditions with empty array", () => {
    expect(hasCalculatorMapping("gdm_diet_controlled")).toBe(false);
  });

  it("hasCalculatorMapping returns true for mapped conditions", () => {
    expect(hasCalculatorMapping("ama_40_plus")).toBe(true);
  });
});
