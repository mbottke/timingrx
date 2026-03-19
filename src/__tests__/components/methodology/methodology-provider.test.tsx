import { describe, it, expect, vi } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import React from "react";
import {
  MethodologyProvider,
  useMethodology,
} from "@/components/methodology/methodology-provider";
import { interpolateBaseline } from "@/lib/calculator/risk-engine";
import { w } from "@/data/helpers";

// ── Wrapper helper ────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MethodologyProvider>{children}</MethodologyProvider>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("MethodologyProvider", () => {
  it("throws when used outside provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(() => renderHook(() => useMethodology())).toThrow(
      "useMethodology must be used within a MethodologyProvider"
    );
    consoleSpy.mockRestore();
  });

  it("provides default state (baseline only, grade A)", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    expect(result.current.ga).toBe(w(39));
    expect(result.current.activeFactorIds).toEqual([]);
    expect(result.current.applyInteractions).toBe(false);

    // Grade A with no factors
    expect(result.current.selectedGaCalculation.confidenceScore.grade).toBe(
      "A"
    );

    // Adjusted risk equals baseline when no factors
    const baseline = interpolateBaseline(w(39));
    expect(result.current.selectedGaCalculation.adjustedRiskPer1000).toBeCloseTo(
      baseline,
      6
    );
  });

  it("toggleFactor adds a factor and updates risk", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    const baselineRisk =
      result.current.selectedGaCalculation.adjustedRiskPer1000;

    act(() => {
      result.current.toggleFactor("age_gte_40");
    });

    expect(result.current.activeFactorIds).toContain("age_gte_40");
    expect(
      result.current.selectedGaCalculation.adjustedRiskPer1000
    ).toBeGreaterThan(baselineRisk);
  });

  it("toggleFactor removes a factor when toggled twice", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("age_gte_40");
    });
    act(() => {
      result.current.toggleFactor("age_gte_40");
    });

    expect(result.current.activeFactorIds).not.toContain("age_gte_40");
  });

  it("setGA updates the gestational age and recalculates", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.setGA(w(41));
    });

    expect(result.current.ga).toBe(w(41));
    expect(result.current.selectedGaCalculation.ga).toBe(w(41));
  });

  it("riskCurve covers 37-42w range", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    // Baseline stillbirth curve has a point for each week 37-42 (6 weeks)
    expect(result.current.riskCurve.length).toBeGreaterThanOrEqual(6);
    const gaValues = result.current.riskCurve.map((p) => p.ga);
    expect(Math.min(...gaValues)).toBe(w(37));
    expect(Math.max(...gaValues)).toBe(w(42));
  });

  it("stepByStepBreakdown cascades multiplication correctly", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("age_gte_40"); // multiplier 1.88
      result.current.toggleFactor("smoking"); // multiplier 1.6
    });

    const steps = result.current.stepByStepBreakdown;
    expect(steps).toHaveLength(2);

    const baseline = interpolateBaseline(w(39));

    // First step: baseline × 1.88
    expect(steps[0].riskBefore).toBeCloseTo(baseline, 6);
    expect(steps[0].riskAfter).toBeCloseTo(baseline * 1.88, 6);
    expect(steps[0].isInteraction).toBe(false);

    // Second step: (baseline × 1.88) × 1.6
    expect(steps[1].riskBefore).toBeCloseTo(baseline * 1.88, 6);
    expect(steps[1].riskAfter).toBeCloseTo(baseline * 1.88 * 1.6, 6);
  });

  it("stepByStepBreakdown adds interaction steps when applyInteractions=true", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("preexisting_diabetes");
      result.current.toggleFactor("bmi_gte_40");
      result.current.setApplyInteractions(true);
    });

    const steps = result.current.stepByStepBreakdown;
    const interactionSteps = steps.filter((s) => s.isInteraction === true);
    expect(interactionSteps.length).toBeGreaterThanOrEqual(1);
    // DM + Class III obesity interaction multiplier is 0.85
    expect(interactionSteps[0].multiplier).toBeCloseTo(0.85, 6);
  });

  it("stepByStepBreakdown has no interaction steps when applyInteractions=false", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("preexisting_diabetes");
      result.current.toggleFactor("bmi_gte_40");
      result.current.setApplyInteractions(false);
    });

    const steps = result.current.stepByStepBreakdown;
    const interactionSteps = steps.filter((s) => s.isInteraction === true);
    expect(interactionSteps).toHaveLength(0);
  });

  it("loadScenario sets correct factors (age_bmi scenario)", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.loadScenario("age_bmi");
    });

    expect(result.current.activeFactorIds).toEqual(
      expect.arrayContaining(["age_gte_40", "bmi_35_39"])
    );
    expect(result.current.applyInteractions).toBe(false);
  });

  it("loadScenario three_factors sets interactions=true", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.loadScenario("three_factors");
    });

    expect(result.current.activeFactorIds).toEqual(
      expect.arrayContaining([
        "age_gte_40",
        "bmi_gte_40",
        "preexisting_diabetes",
      ])
    );
    expect(result.current.applyInteractions).toBe(true);
  });

  it("reset returns to default state", () => {
    const { result } = renderHook(() => useMethodology(), { wrapper });

    act(() => {
      result.current.toggleFactor("age_gte_40");
      result.current.setGA(w(41));
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.ga).toBe(w(39));
    expect(result.current.activeFactorIds).toEqual([]);
    expect(result.current.applyInteractions).toBe(false);
  });

  it("renders children", () => {
    const { getByText } = render(
      <MethodologyProvider>
        <span>child content</span>
      </MethodologyProvider>
    );
    expect(getByText("child content")).toBeDefined();
  });
});
