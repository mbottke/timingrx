import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AnimatedNumber } from "@/components/methodology/animated-number";

describe("AnimatedNumber", () => {
  it("renders the target value directly", () => {
    const { container } = render(<AnimatedNumber value={3.14159} decimals={2} />);
    // The component writes the formatted value via a ref effect
    expect(container.textContent).toContain("3.14");
  });

  it("applies className to the outer span", () => {
    const { container } = render(
      <AnimatedNumber value={1.5} className="test-class" />
    );
    const outer = container.querySelector("span");
    expect(outer?.className).toContain("test-class");
  });

  it("renders suffix text", () => {
    const { container } = render(
      <AnimatedNumber value={5} suffix=" per 1,000" />
    );
    expect(container.textContent).toContain("per 1,000");
  });

  it("formats with correct number of decimals", () => {
    const { container } = render(
      <AnimatedNumber value={2.0} decimals={3} />
    );
    expect(container.textContent).toContain("2.000");
  });

  it("handles zero value", () => {
    const { container } = render(<AnimatedNumber value={0} decimals={2} />);
    expect(container.textContent).toContain("0.00");
  });
});
