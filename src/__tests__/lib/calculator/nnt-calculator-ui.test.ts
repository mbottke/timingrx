import { describe, it, expect } from "vitest";
import { calculateNNT } from "@/lib/calculator/nnt-calculator";

describe("NNT calculator for UI", () => {
  it("returns finite NNT at 39w with baseline multiplier", () => {
    const result = calculateNNT(39 * 7, 1);
    expect(result.nntOneWeek).toBeGreaterThan(0);
    expect(result.nntOneWeek).toBeLessThan(Infinity);
  });

  it("NNT decreases with higher multiplier", () => {
    const nntBase = calculateNNT(40 * 7, 1);
    const nntHigh = calculateNNT(40 * 7, 3.0);
    expect(nntHigh.nntOneWeek).toBeLessThanOrEqual(nntBase.nntOneWeek);
  });

  it("includes context comparison values", () => {
    const result = calculateNNT(39 * 7, 1);
    expect(result.context.arriveNNTCesarean).toBe(28);
    expect(result.context.swepisNNTDeath).toBe(230);
    expect(result.context.cochraneNNTDeath).toBe(544);
  });
});
