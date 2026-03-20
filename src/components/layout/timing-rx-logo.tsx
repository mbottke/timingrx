"use client";

import { useId } from "react";

/**
 * TimingRx SVG wordmark — bold "TIMING" + integrated pharmacy ℞ symbol.
 *
 * The ℞ is drawn as one mark: the R's descending leg crosses with an x stroke,
 * and the classic prescription slash cuts diagonally through — exactly how the
 * pharmacy symbol works (R + x fused, not separate letters).
 */

interface TimingRxLogoProps {
  className?: string;
  showSubtitle?: boolean;
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
      viewBox={`0 0 195 ${viewH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="TimingRx — Evidence-Based Obstetric Guidance"
    >
      <defs>
        <linearGradient id={rxGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b8def" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#d946a8" />
        </linearGradient>
        <linearGradient id={arcGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#818cf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d946a8" stopOpacity="0.35" />
        </linearGradient>
        <filter id={dotGlow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
      </defs>

      {/* ── "TIMING" ── bold, all caps, sans-serif */}
      <text
        x="2"
        y="27"
        fontFamily="-apple-system, 'Helvetica Neue', 'Arial', sans-serif"
        fontSize="25"
        fontWeight="700"
        letterSpacing="1"
        fill="var(--header-fg, #f0f0f5)"
      >
        TIMING
      </text>

      {/* ── Pharmacy ℞ symbol ── R with integrated x crossing at the leg */}
      <g transform="translate(112, 3)">
        {/*
          The pharmacy ℞ drawn as one fused mark:
          - Vertical stem (left side of R)
          - Bowl curves across the top and back
          - Leg descends from bowl junction (first stroke of X)
          - Cross stroke intersects the leg (second stroke of X)
          - Prescription slash diagonally through the leg area
        */}

        {/* R body: stem + bowl + horizontal bar back to stem */}
        <path
          d="M0,30 L0,0 L14,0 C22,0 26,4.5 26,11 C26,17 22,21 14,21 L0,21"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R leg — descends from bowl junction (becomes first X stroke) */}
        <line
          x1="14"
          y1="21"
          x2="32"
          y2="35"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* X cross stroke — intersects the leg */}
        <line
          x1="30"
          y1="20"
          x2="14"
          y2="35"
          stroke={`url(#${rxGrad})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* ℞ prescription slash — the classic diagonal */}
        <line
          x1="6"
          y1="34"
          x2="22"
          y2="14"
          stroke={`url(#${rxGrad})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {showFlourish && (
        <>
          {/* Sweeping arc flourish */}
          <path
            d="M8,34 Q55,40 95,35 Q135,30 160,27 Q175,25 183,28"
            stroke={`url(#${arcGrad})`}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Constellation accent dots */}
          <circle cx="168" cy="8" r="2" fill="#22d3ee" opacity="0.85" />
          <circle
            cx="168"
            cy="8"
            r="3.5"
            fill="#22d3ee"
            opacity="0.2"
            filter={`url(#${dotGlow})`}
          />
          <circle cx="176" cy="14" r="1.3" fill="#818cf8" opacity="0.65" />
          <circle cx="172" cy="20" r="0.9" fill="#a855f7" opacity="0.45" />
          <circle cx="180" cy="7" r="0.6" fill="#22d3ee" opacity="0.35" />
          <circle cx="181" cy="19" r="0.5" fill="#d946a8" opacity="0.25" />
        </>
      )}

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
            x="97"
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
            x1="164"
            y1="46"
            x2="186"
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
