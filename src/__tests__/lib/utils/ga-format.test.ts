import { describe, it, expect } from "vitest";
import {
  gaToDisplay,
  displayToGA,
  gaToWeeksAndDays,
  gaRangeToDisplay,
} from "@/lib/utils/ga-format";

describe("gaToDisplay", () => {
  it("formats 259 as 37w0d", () => {
    expect(gaToDisplay(259)).toBe("37w0d");
  });
  it("formats 273 as 39w0d", () => {
    expect(gaToDisplay(273)).toBe("39w0d");
  });
  it("formats 265 as 37w6d", () => {
    expect(gaToDisplay(265)).toBe("37w6d");
  });
  it("formats 294 as 42w0d", () => {
    expect(gaToDisplay(294)).toBe("42w0d");
  });
});

describe("displayToGA", () => {
  it("parses '37w0d' to 259", () => {
    expect(displayToGA("37w0d")).toBe(259);
  });
  it("parses '39w6d' to 279", () => {
    expect(displayToGA("39w6d")).toBe(279);
  });
  it("parses '42w0d' to 294", () => {
    expect(displayToGA("42w0d")).toBe(294);
  });
  it("throws on invalid format", () => {
    expect(() => displayToGA("invalid")).toThrow();
  });
});

describe("gaToWeeksAndDays", () => {
  it("converts 259 to { weeks: 37, days: 0 }", () => {
    expect(gaToWeeksAndDays(259)).toEqual({ weeks: 37, days: 0 });
  });
  it("converts 265 to { weeks: 37, days: 6 }", () => {
    expect(gaToWeeksAndDays(265)).toEqual({ weeks: 37, days: 6 });
  });
});

describe("gaRangeToDisplay", () => {
  it("shows range for different values", () => {
    expect(gaRangeToDisplay(259, 265)).toBe("37w0d–37w6d");
  });
  it("shows single value when equal", () => {
    expect(gaRangeToDisplay(259, 259)).toBe("37w0d");
  });
});
