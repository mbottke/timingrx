"use client";

/**
 * Animated decorative background — two diverging risk curves with organic,
 * non-repeating motion. Each control point is perturbed by 4 layered sine
 * waves with golden-ratio-derived frequencies, so the pattern never visibly
 * repeats. Paths and dots are updated every frame via useAnimationFrame for
 * buttery-smooth 60fps animation with zero React re-renders.
 *
 * preserveAspectRatio="none" stretches the SVG edge-to-edge regardless of
 * viewport width.
 */

import { useRef, useState, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";

/* ── math helpers ────────────────────────────────────────────────── */

const PHI = 1.618033988749895;

/** Sum of sine waves — irrational frequency ratios prevent visible repetition */
function wave(
  t: number,
  configs: readonly (readonly [amp: number, freq: number, phase: number])[]
) {
  let sum = 0;
  for (let i = 0; i < configs.length; i++) {
    sum += configs[i][0] * Math.sin(t * configs[i][1] + configs[i][2]);
  }
  return sum;
}

/** Catmull-Rom → cubic-bezier SVG path for butter-smooth curves */
function smoothPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)},${cp2x.toFixed(1)} ${cp2y.toFixed(1)},${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/* ── per-point wave configs (pre-built once) ─────────────────────── */

const NUM_POINTS = 11;
const VB_W = 1000;
const VB_H = 200;
const X_STEP = VB_W / (NUM_POINTS - 1);

// Base Y positions — baseline is a gentle rise, adjusted is steeper
const baseBaseY = [168, 166, 163, 158, 152, 144, 134, 122, 108, 93, 78];
const adjBaseY  = [166, 162, 155, 142, 124, 100, 74, 48, 28, 14, 5];

// 4 sine layers per point, frequencies use PHI multiples so they never sync
function buildWaveConfigs(seed: number) {
  return Array.from({ length: NUM_POINTS }, (_, i) => [
    [3.0 + i * 0.35,  0.47 * PHI + i * 0.031 + seed * 0.1,   i * PHI + seed],
    [1.8 - i * 0.08,  0.83 + i * 0.053 + seed * 0.07,        i * 2.39 + 0.7 + seed * 1.3],
    [1.0 + i * 0.1,   1.71 * PHI + i * 0.023 + seed * 0.05,  i * 0.91 + 1.4 + seed * 0.6],
    [0.5,              0.23 + i * 0.017 + seed * 0.03,         i * 3.14 + 2.1 + seed * 2.2],
  ] as [number, number, number][]);
}

const baselineWaves = buildWaveConfigs(0);
const adjustedWaves = buildWaveConfigs(1.7);

// Which point indices get visible dots
const DOT_INDICES = [1, 3, 5, 7, 9];

/* ── component ───────────────────────────────────────────────────── */

export function AnimatedHero({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  // Direct DOM refs — no re-renders during animation
  const baselineRef = useRef<SVGPathElement>(null);
  const adjustedRef = useRef<SVGPathElement>(null);
  const zoneRef = useRef<SVGPathElement>(null);
  const bDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const aDotRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useAnimationFrame((time) => {
    if (!visible) return;
    const t = time / 1000; // seconds

    // ── compute point positions with organic perturbation ──
    const bPts: [number, number][] = new Array(NUM_POINTS);
    const aPts: [number, number][] = new Array(NUM_POINTS);

    for (let i = 0; i < NUM_POINTS; i++) {
      // Extend curves 20px past edges so they bleed off-screen
      const x = -20 + (i / (NUM_POINTS - 1)) * (VB_W + 40);
      bPts[i] = [x, baseBaseY[i] + wave(t, baselineWaves[i])];
      aPts[i] = [x, adjBaseY[i] + wave(t, adjustedWaves[i])];
    }

    // ── build SVG paths ──
    const bPath = smoothPath(bPts);
    const aPath = smoothPath(aPts);

    // Zone: baseline L→R, then adjusted R→L, close
    const aRev = [...aPts].reverse();
    const aRevPath = smoothPath(aRev);
    const zonePath = bPath + " " + aRevPath.replace("M", "L") + " Z";

    // ── apply to DOM (no React renders) ──
    baselineRef.current?.setAttribute("d", bPath);
    adjustedRef.current?.setAttribute("d", aPath);
    zoneRef.current?.setAttribute("d", zonePath);

    // Flowing dash offset — different speeds per curve
    baselineRef.current?.style.setProperty("stroke-dashoffset", String(-t * 18));
    adjustedRef.current?.style.setProperty("stroke-dashoffset", String(-t * 22));

    // ── update dots: position, radius pulse, opacity pulse ──
    for (let di = 0; di < DOT_INDICES.length; di++) {
      const pi = DOT_INDICES[di];
      const bDot = bDotRefs.current[di];
      const aDot = aDotRefs.current[di];

      if (bDot) {
        bDot.setAttribute("cx", bPts[pi][0].toFixed(1));
        bDot.setAttribute("cy", bPts[pi][1].toFixed(1));
        const br = 3 + 0.8 * Math.sin(t * 1.3 + di * PHI);
        bDot.setAttribute("r", br.toFixed(2));
        const bo = 0.35 + 0.15 * Math.sin(t * 0.9 + di * 2.1);
        bDot.setAttribute("opacity", bo.toFixed(3));
      }

      if (aDot) {
        aDot.setAttribute("cx", aPts[pi][0].toFixed(1));
        aDot.setAttribute("cy", aPts[pi][1].toFixed(1));
        const ar = 3 + 0.8 * Math.sin(t * 1.1 + di * PHI * 1.3);
        aDot.setAttribute("r", ar.toFixed(2));
        const ao = 0.35 + 0.15 * Math.sin(t * 1.1 + di * 1.7);
        aDot.setAttribute("opacity", ao.toFixed(3));
      }
    }
  });

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      className={className}
      preserveAspectRatio="none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 2s ease-in",
      }}
    >
      <defs>
        {/* Curve stroke gradients */}
        <linearGradient id="hero-stroke-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue, #6b93ef)" />
          <stop offset="50%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hero-stroke-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="50%" stopColor="var(--brand-pink, #e04cb0)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.5" />
        </linearGradient>

        {/* Fill gradient for divergence zone */}
        <linearGradient id="hero-fill-zone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0" />
          <stop offset="20%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.06" />
          <stop offset="55%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.04" />
        </linearGradient>

        {/* Soft glow */}
        <filter id="hero-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Divergence zone fill */}
      <path ref={zoneRef} fill="url(#hero-fill-zone)" />

      {/* Baseline curve */}
      <path
        ref={baselineRef}
        stroke="url(#hero-stroke-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="8 4"
        filter="url(#hero-glow)"
        opacity="0.55"
      />

      {/* Adjusted curve */}
      <path
        ref={adjustedRef}
        stroke="url(#hero-stroke-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="10 5"
        filter="url(#hero-glow)"
        opacity="0.55"
      />

      {/* Data dots — baseline */}
      {DOT_INDICES.map((_, i) => (
        <circle
          key={`b${i}`}
          ref={(el) => { bDotRefs.current[i] = el; }}
          r="3"
          fill="var(--brand-purple, #b055f7)"
          opacity="0"
        />
      ))}

      {/* Data dots — adjusted */}
      {DOT_INDICES.map((_, i) => (
        <circle
          key={`a${i}`}
          ref={(el) => { aDotRefs.current[i] = el; }}
          r="3"
          fill="var(--brand-pink, #e04cb0)"
          opacity="0"
        />
      ))}
    </svg>
  );
}
