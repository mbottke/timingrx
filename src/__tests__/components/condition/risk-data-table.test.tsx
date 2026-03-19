import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskDataTable } from "@/components/condition/risk-data-table";
import type { RiskDataPoint } from "@/data/types";

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const riskData: RiskDataPoint[] = [
  {
    outcome: "Stillbirth",
    statistic: { type: "relative_risk", value: 2.5, ci95: [1.8, 3.4] },
    citation: { body: "ACOG", documentId: "CO 831", year: 2021 },
  },
  {
    outcome: "Neonatal mortality",
    statistic: { type: "incidence", valuePercent: 0.5 },
  },
  {
    outcome: "Preeclampsia",
    statistic: { type: "absolute_risk", valuePer1000: 50, ci95: [30, 70] },
    populationDescription: "nulliparous women",
  },
];

describe("RiskDataTable", () => {
  it("renders nothing when riskData is empty", () => {
    const { container } = render(<RiskDataTable riskData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card title with count", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("Risk Data")).toBeInTheDocument();
    expect(screen.getByText("3 outcomes")).toBeInTheDocument();
  });

  it("renders outcome names", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("Stillbirth")).toBeInTheDocument();
    expect(screen.getByText("Neonatal mortality")).toBeInTheDocument();
    expect(screen.getByText("Preeclampsia")).toBeInTheDocument();
  });

  it("renders formatted statistics", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("RR 2.5")).toBeInTheDocument();
    expect(screen.getByText("0.5%")).toBeInTheDocument();
    expect(screen.getByText("50 per 1,000")).toBeInTheDocument();
  });

  it("renders CI when present, dash when absent", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("1.8–3.4")).toBeInTheDocument();
    expect(screen.getByText("30–70")).toBeInTheDocument();
    // Neonatal mortality has no ci95
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders formatted citation when present", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("ACOG CO 831 (2021)")).toBeInTheDocument();
  });
});
