"use client";

import { useId } from "react";

/**
 * TimingRx wordmark — HTML "Timing" + SVG pharmacy ℞ symbol.
 *
 * "Timing" is a real <span> so it inherits the page's Geist font naturally.
 * The ℞ is an inline SVG with a stylized, bold pharmacy symbol.
 *
 * Variants:
 * - header: compact for the nav bar
 * - hero: large, centered, with subtitle
 * - footer: small, subtle for page footers
 */

interface TimingRxLogoProps {
  className?: string;
  variant?: "header" | "hero" | "footer";
}

export function TimingRxLogo({
  className = "",
  variant = "header",
}: TimingRxLogoProps) {
  const uid = useId().replace(/:/g, "");
  const rxGrad = `rx-${uid}`;

  const isHero = variant === "hero";
  const isFooter = variant === "footer";

  // Size config per variant
  const textSize = isHero ? "text-4xl" : isFooter ? "text-sm" : "text-lg";
  const textColor = isHero || isFooter ? "text-foreground" : "text-[var(--header-fg,#f0f0f5)]";
  const svgSize = isHero ? "h-11 w-11" : isFooter ? "h-4 w-4" : "h-5 w-5";
  const svgDrop = isHero ? "-9px" : isFooter ? "-3px" : "-5px";
  const strokeW = isHero ? "4.5" : isFooter ? "3.5" : "3.5";

  const wordmark = (
    <span className="inline-flex items-baseline gap-0">
      {/* "Timing" — real HTML text, inherits Geist font */}
      <span className={`font-semibold tracking-tight ${textSize} ${textColor}`}>
        Timing
      </span>

      {/* ℞ pharmacy symbol — stylized, bold */}
      <svg
        viewBox="0 0 42 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgSize}
        style={{ marginBottom: svgDrop }}
      >
        <defs>
          <linearGradient id={rxGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b93ef" />
            <stop offset="40%" stopColor="#b055f7" />
            <stop offset="100%" stopColor="#e04cb0" />
          </linearGradient>
        </defs>

        {/* R: stem + bowl as one continuous path (vertical-only lines
            with zero-width bounding boxes break gradient rendering) */}
        <path
          d="M3,40 L3,2 L18,2 C27,2 32,7 32,14 C32,21 27,25 18,25 L3,25"
          stroke={`url(#${rxGrad})`}
          strokeWidth={strokeW}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R leg / first X stroke — bold diagonal from junction */}
        <line
          x1="18"
          y1="25"
          x2="38"
          y2="42"
          stroke={`url(#${rxGrad})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {/* X cross stroke — from junction corner */}
        <line
          x1="38"
          y1="25"
          x2="18"
          y2="42"
          stroke={`url(#${rxGrad})`}
          strokeWidth={strokeW}
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
    <span className={className} role="img" aria-label="TimingRx">
      {wordmark}
    </span>
  );
}
