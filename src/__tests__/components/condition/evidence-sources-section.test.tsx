import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EvidenceSourcesSection } from "@/components/condition/evidence-sources-section";
import type { KeyEvidenceSource } from "@/data/types";

// Mock localStorage since jsdom doesn't always provide it
const store: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  },
  writable: true,
});

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const sources: KeyEvidenceSource[] = [
  {
    id: "carpreg-ii",
    name: "CARPREG II",
    type: "cohort",
    description: "Canadian cardiac pregnancy risk score.",
    yearStarted: 1994,
    region: "Canada",
    url: "https://example.com",
  },
  {
    id: "ropac",
    name: "ROPAC",
    type: "registry",
    description: "Registry of pregnancy and cardiac disease.",
    yearStarted: 2007,
    region: "Global (60+ countries)",
  },
];

describe("EvidenceSourcesSection", () => {
  it("renders nothing when sources is empty", () => {
    const { container } = render(<EvidenceSourcesSection sources={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card title", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("Key Evidence Sources")).toBeInTheDocument();
  });

  it("renders source names", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("CARPREG II")).toBeInTheDocument();
    expect(screen.getByText("ROPAC")).toBeInTheDocument();
  });

  it("renders type badges", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("Cohort")).toBeInTheDocument();
    expect(screen.getByText("Registry")).toBeInTheDocument();
  });

  it("renders metadata", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText(/1994/)).toBeInTheDocument();
    expect(screen.getByText(/Canada/)).toBeInTheDocument();
  });

  it("renders external link when url present", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    const links = screen.getAllByText("↗");
    expect(links).toHaveLength(1);
  });
});
