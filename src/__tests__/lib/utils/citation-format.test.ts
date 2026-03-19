import { describe, it, expect } from "vitest";
import { formatCitation, formatCitations } from "@/lib/utils/citation-format";
import type { Citation } from "@/data/types";

describe("formatCitation", () => {
  it("formats ACOG citation with year", () => {
    const c: Citation = { body: "ACOG", documentId: "CO 831", year: 2021 };
    expect(formatCitation(c)).toBe("ACOG CO 831 (2021)");
  });
  it("formats SMFM citation without duplicating body", () => {
    const c: Citation = { body: "SMFM", documentId: "SMFM #53", year: 2021 };
    expect(formatCitation(c)).toBe("SMFM #53 (2021)");
  });
  it("handles missing year", () => {
    const c: Citation = { body: "ESC", documentId: "CVD Pregnancy Guidelines" };
    expect(formatCitation(c)).toBe("ESC CVD Pregnancy Guidelines");
  });
});

describe("formatCitations", () => {
  it("joins multiple citations with semicolons", () => {
    const citations: Citation[] = [
      { body: "ACOG", documentId: "CO 831", year: 2021 },
      { body: "SMFM", documentId: "SMFM #53", year: 2021 },
    ];
    expect(formatCitations(citations)).toBe(
      "ACOG CO 831 (2021); SMFM #53 (2021)"
    );
  });
  it("handles single citation", () => {
    const citations: Citation[] = [
      { body: "NICE", documentId: "NG133", year: 2019 },
    ];
    expect(formatCitations(citations)).toBe("NICE NG133 (2019)");
  });
});
