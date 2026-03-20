"use client";

import { useId } from "react";

/**
 * TimingRx wordmark — HTML "Timing" + SVG pharmacy ℞ symbol.
 *
 * "Timing" is a real <span> so it inherits the page's Geist font naturally.
 * The ℞ is an inline SVG: R with fused x crossing at the leg.
 *
 * hero variant: larger, centered, with "Evidence-Based Obstetric Guidance" subtitle.
 * header variant: compact for the nav bar.
 */

interface TimingRxLogoProps {
  className?: string;
  variant?: "header" | "hero";
}

export function TimingRxLogo({
  className = "",
  variant = "header",
}: TimingRxLogoProps) {
  const uid = useId().replace(/:/g, "");
  const rxGrad = `rx-${uid}`;

  const isHero = variant === "hero";

  const wordmark = (
    <span className="inline-flex items-baseline gap-0">
      {/* "Timing" — real HTML text, inherits Geist font */}
      <span
        className={`font-semibold tracking-tight ${
          isHero
            ? "text-4xl text-foreground"
            : "text-lg text-[var(--header-fg,#f0f0f5)]"
        }`}
      >
        Timing
      </span>

      {/* ℞ pharmacy symbol */}
      <svg
        viewBox="0 0 38 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isHero ? "h-10 w-10" : "h-5 w-5"}
        style={{ marginBottom: isHero ? "-8px" : "-5px" }}
      >
        <defs>
          <linearGradient id={rxGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b8def" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946a8" />
          </linearGradient>
        </defs>

        {/* R body: stem + bowl + bar back to stem — bold stroke */}
        <path
          d="M2,38 L2,2 L16,2 C24,2 28,6.5 28,13 C28,19 24,23 16,23 L2,23"
          stroke={`url(#${rxGrad})`}
          strokeWidth={isHero ? "4" : "3"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R leg — descends from bowl junction (first X stroke) */}
        <line
          x1="16"
          y1="23"
          x2="34"
          y2="40"
          stroke={`url(#${rxGrad})`}
          strokeWidth={isHero ? "4" : "3"}
          strokeLinecap="round"
        />

        {/* X cross stroke — from R's bowl junction corner */}
        <line
          x1="34"
          y1="23"
          x2="16"
          y2="40"
          stroke={`url(#${rxGrad})`}
          strokeWidth={isHero ? "4" : "3"}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );

  if (isHero) {
    return (
      <div
        className={`flex flex-col items-center gap-1 ${className}`}
        role="img"
        aria-label="TimingRx — Evidence-Based Obstetric Guidance"
      >
        {wordmark}
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
          EVIDENCE-BASED OBSTETRIC GUIDANCE
        </span>
      </div>
    );
  }

  return (
    <span
      className={`${className}`}
      role="img"
      aria-label="TimingRx"
    >
      {wordmark}
    </span>
  );
}
