import { describe, it, expect } from "vitest";
import { calculateMortalityIndex, findMortalityCrossover } from "@/lib/calculator/mortality-index";

describe("mortality index for UI consumption", () => {
  it("returns 6 data points from 37w to 42w", () => {
    const index = calculateMortalityIndex(1);
    expect(index).toHaveLength(6);
    expect(index[0].ga).toBe(37 * 7);
    expect(index[5].ga).toBe(42 * 7);
  });

  it("crossover moves earlier with higher multiplier", () => {
    const crossBase = findMortalityCrossover(1);
    const crossHigh = findMortalityCrossover(3.0);
    if (crossBase !== null && crossHigh !== null) {
      expect(crossHigh).toBeLessThanOrEqual(crossBase);
    }
  });

  it("each point has expectantRisk and deliveryRisk", () => {
    const index = calculateMortalityIndex(2.0);
    for (const point of index) {
      expect(point.expectantRisk).toBeGreaterThan(0);
      expect(point.deliveryRisk).toBeGreaterThan(0);
      expect(typeof point.favorDelivery).toBe("boolean");
    }
  });
});
