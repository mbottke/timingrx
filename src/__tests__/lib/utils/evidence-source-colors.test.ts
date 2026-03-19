import { describe, it, expect } from "vitest";
import {
  evidenceSourceColorClass,
  evidenceSourceLabel,
  EVIDENCE_SOURCE_LABELS,
} from "@/lib/utils/evidence-source-colors";

describe("evidenceSourceColorClass", () => {
  it("returns guideline class", () => {
    expect(evidenceSourceColorClass("guideline_derived")).toBe(
      "bg-[var(--evidence-source-guideline)] text-white",
    );
  });

  it("returns case_series class", () => {
    expect(evidenceSourceColorClass("case_series")).toBe(
      "bg-[var(--evidence-source-case-series)] text-white",
    );
  });

  it("returns protocol class", () => {
    expect(evidenceSourceColorClass("protocol")).toBe(
      "bg-[var(--evidence-source-protocol)] text-white",
    );
  });

  it("returns cohort class", () => {
    expect(evidenceSourceColorClass("cohort")).toBe(
      "bg-[var(--evidence-source-cohort)] text-white",
    );
  });

  it("returns surveillance class", () => {
    expect(evidenceSourceColorClass("surveillance")).toBe(
      "bg-[var(--evidence-source-surveillance)] text-white",
    );
  });

  it("returns registry class", () => {
    expect(evidenceSourceColorClass("registry")).toBe(
      "bg-[var(--evidence-source-registry)] text-white",
    );
  });
});

describe("evidenceSourceLabel", () => {
  it("maps all 6 types to display labels", () => {
    expect(evidenceSourceLabel("guideline_derived")).toBe("Guideline");
    expect(evidenceSourceLabel("case_series")).toBe("Case Series");
    expect(evidenceSourceLabel("protocol")).toBe("Protocol");
    expect(evidenceSourceLabel("cohort")).toBe("Cohort");
    expect(evidenceSourceLabel("surveillance")).toBe("Surveillance");
    expect(evidenceSourceLabel("registry")).toBe("Registry");
  });
});

describe("EVIDENCE_SOURCE_LABELS", () => {
  it("contains all 6 entries", () => {
    expect(Object.keys(EVIDENCE_SOURCE_LABELS)).toHaveLength(6);
  });
});
