import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EvidenceSourceTypeBadge } from "@/components/condition/evidence-source-type-badge";

describe("EvidenceSourceTypeBadge", () => {
  it("renders the display label for cohort", () => {
    render(<EvidenceSourceTypeBadge type="cohort" />);
    expect(screen.getByText("Cohort")).toBeInTheDocument();
  });

  it("renders the display label for registry", () => {
    render(<EvidenceSourceTypeBadge type="registry" />);
    expect(screen.getByText("Registry")).toBeInTheDocument();
  });

  it("renders the display label for guideline_derived", () => {
    render(<EvidenceSourceTypeBadge type="guideline_derived" />);
    expect(screen.getByText("Guideline")).toBeInTheDocument();
  });

  it("renders uppercase text", () => {
    const { container } = render(<EvidenceSourceTypeBadge type="protocol" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("uppercase");
  });
});
