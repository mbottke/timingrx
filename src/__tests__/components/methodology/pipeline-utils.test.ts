import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  lerpColor,
  gradeToColor,
} from "@/components/methodology/pipeline/pipeline-utils";

// ── hexToRgb ──────────────────────────────────────────────────────────────────

describe("hexToRgb", () => {
  it("parses a 6-digit hex with # prefix", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses a 6-digit hex without # prefix", () => {
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("parses a hex with mixed case", () => {
    expect(hexToRgb("#0000FF")).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("parses rgb() format with spaces", () => {
    expect(hexToRgb("rgb(128, 64, 32)")).toEqual({ r: 128, g: 64, b: 32 });
  });

  it("parses rgb() format without spaces", () => {
    expect(hexToRgb("rgb(255,0,0)")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses rgb() format with extra whitespace", () => {
    expect(hexToRgb("rgb( 10 , 20 , 30 )")).toEqual({ r: 10, g: 20, b: 30 });
  });
});

// ── lerpColor ─────────────────────────────────────────────────────────────────

describe("lerpColor", () => {
  it("returns colorA at t=0", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("rgb(0, 0, 0)");
  });

  it("returns colorB at t=1", () => {
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("rgb(255, 255, 255)");
  });

  it("interpolates midpoint at t=0.5", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("rgb(128, 128, 128)");
  });

  it("works with rgb() format inputs", () => {
    expect(lerpColor("rgb(0, 0, 0)", "rgb(200, 100, 50)", 0.5)).toBe(
      "rgb(100, 50, 25)"
    );
  });

  it("works with mixed hex and rgb() inputs", () => {
    const result = lerpColor("#ff0000", "rgb(0, 0, 255)", 0.5);
    expect(result).toBe("rgb(128, 0, 128)");
  });
});

// ── gradeToColor ──────────────────────────────────────────────────────────────

describe("gradeToColor", () => {
  it("maps grade A to green", () => {
    expect(gradeToColor("A")).toBe("#22c55e");
  });

  it("maps grade B to blue", () => {
    expect(gradeToColor("B")).toBe("#3b82f6");
  });

  it("maps grade C to amber", () => {
    expect(gradeToColor("C")).toBe("#f59e0b");
  });

  it("maps grade D to orange", () => {
    expect(gradeToColor("D")).toBe("#f97316");
  });

  it("maps grade F to red", () => {
    expect(gradeToColor("F")).toBe("#ef4444");
  });
});
