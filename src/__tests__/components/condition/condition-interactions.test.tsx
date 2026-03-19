import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConditionInteractions } from "@/components/condition/condition-interactions";
import type { ConditionInteraction } from "@/data/types";

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const interactions: ConditionInteraction[] = [
  {
    interactingConditionId: "gest-diabetes",
    interactionType: "additive_risk",
    description: "Pre-existing diabetes combined with hypertension increases preeclampsia risk.",
  },
  {
    interactingConditionId: "chronic-htn",
    interactionType: "timing_shift",
    description: "Chronic HTN shifts delivery window earlier.",
    combinedTimingGuidance: {
      type: "range",
      range: { earliest: 259, latest: 266 },
    },
  },
];

describe("ConditionInteractions", () => {
  it("renders nothing when interactions is empty", () => {
    const { container } = render(<ConditionInteractions interactions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the Interactions card header", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(screen.getByText("Interactions")).toBeInTheDocument();
  });

  it("renders interaction type badges", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(screen.getByText("Additive Risk")).toBeInTheDocument();
    expect(screen.getByText("Timing Shift")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(
      screen.getByText(/Pre-existing diabetes combined/),
    ).toBeInTheDocument();
  });

  it("renders links to interacting conditions", () => {
    render(<ConditionInteractions interactions={interactions} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/conditions/gest-diabetes");
    expect(links[1]).toHaveAttribute("href", "/conditions/chronic-htn");
  });
});
