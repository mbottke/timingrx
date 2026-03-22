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

  // ── Hero variant: frosted glass wordmark ──────────────────────────────────
  if (isHero) {
    const frostFilter = `kairos-frost-${uid}`;
    return (
      <div
        className={`flex flex-col items-center gap-1 ${className}`}
        role="img"
        aria-label="Kairos — Obstetric Decision Intelligence"
      >
        <svg
          width="230"
          height="56"
          viewBox="0 0 230 56"
          fill="none"
          className="w-[230px] h-[56px]"
        >
          <defs>
            {/* Frosted glass text effect — slight blur + specular edge */}
            <filter id={frostFilter} x="-5%" y="-15%" width="110%" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="softAlpha" />
              <feSpecularLighting in="softAlpha" surfaceScale={4} specularConstant={0.6} specularExponent={30} lightingColor="#ffffff" result="specHighlight">
                <fePointLight x={60} y={-30} z={200} />
              </feSpecularLighting>
              <feComposite in="specHighlight" in2="SourceAlpha" operator="in" result="clippedSpec" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="clippedSpec" />
              </feMerge>
            </filter>
          </defs>
          {/* Wordmark — dark, semi-transparent for frosted glass feel */}
          <text
            x={8}
            y={40}
            fontFamily="var(--font-geist-sans), Inter, system-ui, sans-serif"
            fontSize={42}
            fontWeight={800}
            letterSpacing={-2}
            className="kairos-hero-text-fill"
            filter={`url(#${frostFilter})`}
          >
            kairos
          </text>
          {/* Pink dot — period accent */}
          <circle cx={134} cy={38} r={3} fill="#e04cb0" opacity={0.8} />
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
          <circle cx={113} cy={31} r={2} fill="#e04cb0" />
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
        <circle cx={113} cy={31} r={2} fill="#e04cb0" />
      </svg>
    </span>
  );
}
