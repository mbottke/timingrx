"use client";

import { useId } from "react";

/**
 * Kairos brand system — diverging risk curves wordmark.
 *
 * Two curves rise from a shared decision node: the steep curve (adjusted risk
 * with factors, pink) and the gentle curve (baseline, blue). The widening gap
 * between them IS the clinical insight.
 *
 * Variants:
 * - header: Diverging mark + "kairos" wordmark for the nav bar
 * - hero: Integrated dual-curve wordmark with subtitle for landing page
 * - heading: Inline use in headings like "How kairos Works"
 * - footer: Compact wordmark for page footers
 */

interface KairosLogoProps {
  className?: string;
  variant?: "header" | "hero" | "heading" | "footer";
}

export function KairosLogo({
  className = "",
  variant = "header",
}: KairosLogoProps) {
  const uid = useId().replace(/:/g, "");
  const g1 = `kairos-steep-${uid}`;
  const g2 = `kairos-gentle-${uid}`;
  const gFull = `kairos-full-${uid}`;

  const isHero = variant === "hero";
  const isFooter = variant === "footer";
  const isHeading = variant === "heading";

  // Text sizing per variant
  const textSize = isHero
    ? "text-4xl"
    : isHeading
      ? "text-2xl"
      : isFooter
        ? "text-sm"
        : "text-lg";

  const textColor =
    isHero || isFooter || isHeading
      ? "text-foreground"
      : "text-[var(--header-fg,#f0f0f5)]";

  // ── Hero variant: integrated dual-curve wordmark ──────────────────────────
  if (isHero) {
    return (
      <div
        className={`flex flex-col items-center gap-1 ${className}`}
        role="img"
        aria-label="Kairos — Obstetric Decision Intelligence"
      >
        <svg
          width="230"
          height="68"
          viewBox="0 0 230 68"
          fill="none"
          className="w-[230px] h-[68px]"
        >
          <defs>
            <linearGradient id={gFull} x1="0" y1="0" x2="230" y2="0">
              <stop offset="0%" stopColor="#6b93ef" />
              <stop offset="45%" stopColor="#b055f7" />
              <stop offset="100%" stopColor="#e04cb0" />
            </linearGradient>
          </defs>
          {/* Baseline — dashed, gentle rise */}
          <path
            d="M6,58 C50,56 100,52 150,46 C180,42 200,38 224,34"
            stroke="#6b93ef"
            strokeWidth={1.8}
            strokeLinecap="round"
            fill="none"
            opacity={0.35}
            strokeDasharray="4,5"
          />
          {/* Adjusted — solid, steep rise */}
          <path
            d="M6,58 C40,54 80,46 120,34 C150,24 180,14 220,4"
            stroke={`url(#${gFull})`}
            strokeWidth={2.8}
            strokeLinecap="round"
            fill="none"
          />
          {/* Wordmark */}
          <text
            x={8}
            y={46}
            fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif"
            fontSize={34}
            fontWeight={700}
            letterSpacing={-1.5}
            fill="currentColor"
            className="fill-foreground"
          >
            kairos
          </text>
          {/* Pink dot — period accent after "s" */}
          <circle cx={107} cy={44} r={2.5} fill="var(--brand-pink, #e04cb0)" />
        </svg>
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
          OBSTETRIC DECISION INTELLIGENCE
        </span>
      </div>
    );
  }

  // ── Header / Heading variant: diverging mark + wordmark ────────────────────
  if (variant === "header" || isHeading) {
    const svgW = isHeading ? 170 : 150;
    const svgH = isHeading ? 42 : 36;
    const vb = "0 0 190 46";
    const fontSize = isHeading ? 24 : 22;

    return (
      <span className={className} role="img" aria-label="Kairos">
        <svg
          width={svgW}
          height={svgH}
          viewBox={vb}
          fill="none"
          className={`w-[${svgW}px] h-[${svgH}px]`}
        >
          <defs>
            <linearGradient id={g1} x1="6" y1="38" x2="42" y2="4">
              <stop offset="0%" stopColor="#b055f7" />
              <stop offset="100%" stopColor="#e04cb0" />
            </linearGradient>
            <linearGradient id={g2} x1="6" y1="38" x2="184" y2="22">
              <stop offset="0%" stopColor="#b055f7" />
              <stop offset="100%" stopColor="#6b93ef" />
            </linearGradient>
          </defs>
          {/* Steep curve — adjusted risk */}
          <path
            d="M8,38 C16,34 24,24 32,14 C36,9 38,6 42,4"
            stroke={`url(#${g1})`}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
          {/* Gentle curve — baseline, under wordmark */}
          <path
            d="M8,38 C40,35 80,31 120,28 C150,25 170,23 184,22"
            stroke={`url(#${g2})`}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          {/* Wordmark */}
          <text
            x={48}
            y={32}
            fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif"
            fontSize={fontSize}
            fontWeight={700}
            letterSpacing={-1}
            fill="currentColor"
            className={textColor === "text-foreground" ? "fill-foreground" : "fill-[var(--header-fg,#f0f0f5)]"}
          >
            kairos
          </text>
          {/* Pink dot — period accent after "s" */}
          <circle cx={113} cy={31} r={2} fill="var(--brand-pink, #e04cb0)" />
        </svg>
      </span>
    );
  }

  // ── Footer variant: compact wordmark ───────────────────────────────────────
  return (
    <span className={className} role="img" aria-label="Kairos">
      <svg
        width={100}
        height={24}
        viewBox="0 0 190 46"
        fill="none"
        className="w-[100px] h-[24px]"
      >
        <defs>
          <linearGradient id={g1} x1="6" y1="38" x2="42" y2="4">
            <stop offset="0%" stopColor="#b055f7" />
            <stop offset="100%" stopColor="#e04cb0" />
          </linearGradient>
          <linearGradient id={g2} x1="6" y1="38" x2="184" y2="22">
            <stop offset="0%" stopColor="#b055f7" />
            <stop offset="100%" stopColor="#6b93ef" />
          </linearGradient>
        </defs>
        <path
          d="M8,38 C16,34 24,24 32,14 C36,9 38,6 42,4"
          stroke={`url(#${g1})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8,38 C40,35 80,31 120,28 C150,25 170,23 184,22"
          stroke={`url(#${g2})`}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <text
          x={48}
          y={32}
          fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif"
          fontSize={22}
          fontWeight={700}
          letterSpacing={-1}
          fill="currentColor"
          className="fill-foreground"
        >
          kairos
        </text>
        <circle cx={113} cy={31} r={2} fill="var(--brand-pink, #e04cb0)" />
      </svg>
    </span>
  );
}
