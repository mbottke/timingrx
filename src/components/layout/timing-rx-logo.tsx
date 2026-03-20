"use client";

import { useId } from "react";

/**
 * TimingRx SVG wordmark — adapted from the professional logo designs.
 *
 * Design DNA preserved:
 * - Italic "Timing" flowing into bold, gradient "Rx" with prescription ℞ slash
 * - Sweeping gradient arc underneath (signature flourish)
 * - Constellation accent dots on the right (data/precision motif)
 * - Blue → Purple → Magenta gradient spectrum
 *
 * Simplified for web:
 * - Pure SVG paths (no raster glow effects)
 * - Works at header scale (h-8) and hero scale
 * - Uses CSS custom properties for theme-aware text color
 * - useId() ensures gradient IDs are unique per instance
 */

interface TimingRxLogoProps {
  /** Height class — the width scales proportionally */
  className?: string;
  /** Show the subtitle "Evidence-Based Obstetric Guidance" */
  showSubtitle?: boolean;
  /** Show the sweeping arc and constellation dots */
  showFlourish?: boolean;
}

export function TimingRxLogo({
  className = "h-8",
  showSubtitle = false,
  showFlourish = true,
}: TimingRxLogoProps) {
  const uid = useId().replace(/:/g, "");
  const rxGrad = `rx-${uid}`;
  const arcGrad = `arc-${uid}`;
  const dotGlow = `glow-${uid}`;

  const viewH = showSubtitle ? 58 : 42;

  return (
    <svg
      viewBox={`0 0 190 ${viewH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="TimingRx — Evidence-Based Obstetric Guidance"
    >
      <defs>
        {/* Blue → Purple → Magenta — from the professional logo palette */}
        <linearGradient id={rxGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b8def" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#d946a8" />
        </linearGradient>
        {/* Arc gradient — cyan to magenta sweep */}
        <linearGradient id={arcGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#818cf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d946a8" stopOpacity="0.35" />
        </linearGradient>
        {/* Soft glow for the accent dots */}
        <filter id={dotGlow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
      </defs>

      {/* ── "Timing" ── italic serif, matching the pro logo typography */}
      <text
        x="2"
        y="28"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontSize="26"
        fontWeight="400"
        fontStyle="italic"
        letterSpacing="-0.5"
        fill="var(--header-fg, #f0f0f5)"
      >
        Timing
      </text>

      {/* ── Prescription ℞ ── hand-crafted R with bowl, leg, and diagonal slash */}
      <g transform="translate(100, 5)">
        {/* R vertical stem */}
        <path
          d="M0,27 L0,0"
          stroke={`url(#${rxGrad})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* R bowl (the curved top of the R) */}
        <path
          d="M0,0 L13,0 C19,0 23,4 23,10 C23,15 19,19 13,19 L0,19"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* R leg descending to the right */}
        <path
          d="M13,19 L26,29"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* ℞ prescription slash — the iconic diagonal through the R's leg */}
        <line
          x1="5"
          y1="31"
          x2="19"
          y2="13"
          stroke={`url(#${rxGrad})`}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>

      {/* ── "x" ── italic, gradient-filled to match the ℞ */}
      <text
        x="130"
        y="28"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontSize="24"
        fontWeight="400"
        fontStyle="italic"
        fill={`url(#${rxGrad})`}
      >
        x
      </text>

      {showFlourish && (
        <>
          {/* ── Sweeping arc underneath ── the signature flourish from the pro logos */}
          <path
            d="M8,34 Q55,40 95,35 Q130,30 155,27 Q170,25 178,28"
            stroke={`url(#${arcGrad})`}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Constellation dots ── clinical data/precision motif */}
          {/* Primary bright dot — cyan */}
          <circle cx="162" cy="8" r="2" fill="#22d3ee" opacity="0.85" />
          <circle
            cx="162"
            cy="8"
            r="3.5"
            fill="#22d3ee"
            opacity="0.2"
            filter={`url(#${dotGlow})`}
          />
          {/* Secondary — purple */}
          <circle cx="170" cy="14" r="1.3" fill="#818cf8" opacity="0.65" />
          {/* Tertiary — violet */}
          <circle cx="166" cy="20" r="0.9" fill="#a855f7" opacity="0.45" />
          {/* Tiny trailing accents */}
          <circle cx="174" cy="7" r="0.6" fill="#22d3ee" opacity="0.35" />
          <circle cx="175" cy="19" r="0.5" fill="#d946a8" opacity="0.25" />
        </>
      )}

      {/* ── Subtitle with decorative rule lines ── */}
      {showSubtitle && (
        <>
          <line
            x1="8"
            y1="46"
            x2="30"
            y2="46"
            stroke="var(--header-muted, #888)"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <text
            x="95"
            y="50"
            fontFamily="-apple-system, 'Helvetica Neue', sans-serif"
            fontSize="6.5"
            fontWeight="400"
            letterSpacing="2.5"
            textAnchor="middle"
            fill="var(--header-muted, #888)"
            opacity="0.65"
          >
            EVIDENCE-BASED OBSTETRIC GUIDANCE
          </text>
          <line
            x1="160"
            y1="46"
            x2="182"
            y2="46"
            stroke="var(--header-muted, #888)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </>
      )}
    </svg>
  );
}
