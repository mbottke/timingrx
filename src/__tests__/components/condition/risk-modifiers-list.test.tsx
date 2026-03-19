import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskModifiersList } from "@/components/condition/risk-modifiers-list";
import type { RiskModifier } from "@/data/types";

// Mock useTeachingMode — default to teaching OFF
vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const modifiers: RiskModifier[] = [
  {
    factor: "maternal_age",
    effect: "Risk increases significantly after age 35",
  },
  {
    factor: "bmi",
    effect: "BMI >30 associated with 2x risk of GDM",
    riskData: {
      outcome: "GDM",
      statistic: { type: "relative_risk", value: 2.0 },
    },
  },
];

describe("RiskModifiersList", () => {
  it("renders nothing when modifiers is empty", () => {
    const { container } = render(<RiskModifiersList modifiers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card with title 'Risk Modifiers'", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Risk Modifiers")).toBeInTheDocument();
  });

  it("renders factor badges with short labels", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("BMI")).toBeInTheDocument();
  });

  it("renders effect text", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Risk increases significantly after age 35")).toBeInTheDocument();
  });

  it("renders inline risk stat when riskData present", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText(/RR 2/)).toBeInTheDocument();
  });
});
