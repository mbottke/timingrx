"use client";

import { useId } from "react";

/**
 * TimingRx wordmark — HTML "Timing" + SVG pharmacy ℞ symbol.
 *
 * "Timing" is a real <span> so it inherits the page's Geist font naturally.
 * The ℞ is an inline SVG: R with fused x crossing at the leg + prescription slash.
 */

interface TimingRxLogoProps {
  className?: string;
  /** Scale variant — header (compact) or hero (large with subtitle) */
  variant?: "header" | "hero";
}

export function TimingRxLogo({
  className = "",
  variant = "header",
}: TimingRxLogoProps) {
  const uid = useId().replace(/:/g, "");
  const rxGrad = `rx-${uid}`;

  const isHero = variant === "hero";

  return (
    <span
      className={`inline-flex items-baseline gap-0 ${className}`}
      role="img"
      aria-label="TimingRx"
    >
      {/* "Timing" — real HTML text, inherits Geist font from the page */}
      <span
        className={`font-semibold tracking-tight text-[var(--header-fg,#f0f0f5)] ${
          isHero ? "text-4xl" : "text-lg"
        }`}
      >
        Timing
      </span>

      {/* ℞ pharmacy symbol — SVG inline, vertically aligned to the text */}
      <svg
        viewBox="0 0 38 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isHero ? "h-9 w-9" : "h-5 w-5"}
        style={{ marginBottom: isHero ? "-2px" : "-1px" }}
      >
        <defs>
          <linearGradient id={rxGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b8def" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946a8" />
          </linearGradient>
        </defs>

        {/* R body: stem + bowl + bar back to stem */}
        <path
          d="M2,36 L2,2 L16,2 C24,2 28,6.5 28,13 C28,19 24,23 16,23 L2,23"
          stroke={`url(#${rxGrad})`}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R leg — descends from bowl junction (first X stroke) */}
        <line
          x1="16"
          y1="23"
          x2="34"
          y2="38"
          stroke={`url(#${rxGrad})`}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* X cross stroke — intersects the leg */}
        <line
          x1="32"
          y1="22"
          x2="16"
          y2="38"
          stroke={`url(#${rxGrad})`}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* ℞ prescription slash */}
        <line
          x1="8"
          y1="38"
          x2="24"
          y2="16"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </span>
  );
}
