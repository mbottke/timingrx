"use client";

/**
 * Animated hero — two luminous diverging curves with ethereal, coordinated
 * motion. Uses global wave functions so the entire curve breathes as one,
 * with amplitude gently increasing along the length to suggest growing
 * divergence. Solid glowing strokes with ghost echoes for depth.
 *
 * preserveAspectRatio="none" stretches edge-to-edge.
 * All animation is 60fps via useAnimationFrame with direct DOM mutation.
 */

import { useRef, useState, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";

/* ── constants ───────────────────────────────────────────────────── */

const PHI = 1.618033988749895;
const NUM_POINTS = 13;
const VB_W = 1000;
const VB_H = 200;

// Base Y positions — gentle rise (baseline) and steep rise (adjusted)
const baseBaseY = [170, 169, 167, 164, 160, 155, 148, 140, 130, 118, 105, 91, 78];
const adjBaseY = [168, 165, 160, 151, 138, 120, 98, 74, 52, 34, 20, 10, 5];

/* ── math helpers ────────────────────────────────────────────────── */

/** Catmull-Rom → cubic bezier SVG path */
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

/**
 * Global coordinated wave — the whole curve moves together.
 * `positionScale` (0→1 along the curve) gently increases amplitude
 * so the right side sways more, like a ribbon anchored at the left.
 */
function globalWave(t: number, positionScale: number): number {
  const amp = 1.0 + positionScale * 2.5; // left: ±1, right: ±3.5
  return (
    amp * (
      1.0  * Math.sin(t * 0.55)                          + // primary sway
      0.6  * Math.sin(t * 0.55 * PHI + 1.2)              + // secondary, phi-offset
      0.3  * Math.sin(t * 0.55 * PHI * PHI + 2.8)        + // tertiary
      0.15 * Math.sin(t * 0.24 + positionScale * 1.5)      // slow drift
    )
  );
}

/* ── component ───────────────────────────────────────────────────── */

// Dot positions: indices along the curves
const DOT_INDICES = [3, 6, 9];

export function AnimatedHero({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  // Path refs
  const baselineRef = useRef<SVGPathElement>(null);
  const baselineGhostRef = useRef<SVGPathElement>(null);
  const adjustedRef = useRef<SVGPathElement>(null);
  const adjustedGhostRef = useRef<SVGPathElement>(null);
  const zoneRef = useRef<SVGPathElement>(null);
  const bDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const aDotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Animate the hero refraction filter's turbulence
  useEffect(() => {
    if (!visible) return;
    let time = 0;
    let animId: number;

    function animate() {
      time += 0.005;
      const turbulence = document.getElementById("hero-refract-turbulence");
      if (turbulence) {
        const bfx = 0.008 + Math.sin(time) * 0.002;
        const bfy = 0.008 + Math.cos(time * 0.7) * 0.002;
        turbulence.setAttribute("baseFrequency", `${bfx} ${bfy}`);
      }
      animId = requestAnimationFrame(animate);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(animate);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [visible]);

  useAnimationFrame((time) => {
    if (!visible) return;
    const t = time / 1000;

    // ── compute points ──
    const bPts: [number, number][] = new Array(NUM_POINTS);
    const aPts: [number, number][] = new Array(NUM_POINTS);

    for (let i = 0; i < NUM_POINTS; i++) {
      const frac = i / (NUM_POINTS - 1); // 0→1 along curve
      const x = -10 + frac * (VB_W + 20);

      // Both curves share the same global wave but with a phase offset
      // so they move in gentle sympathy, not identically
      const bWave = globalWave(t, frac);
      const aWave = globalWave(t + 0.7, frac); // phase-shifted companion

      bPts[i] = [x, baseBaseY[i] + bWave];
      aPts[i] = [x, adjBaseY[i] + aWave];
    }

    // ── paths ──
    const bPath = smoothPath(bPts);
    const aPath = smoothPath(aPts);

    // Zone between curves
    const aRev = [...aPts].reverse();
    const aRevPath = smoothPath(aRev);
    const zonePath = bPath + " " + aRevPath.replace("M", "L") + " Z";

    // Apply to DOM
    baselineRef.current?.setAttribute("d", bPath);
    baselineGhostRef.current?.setAttribute("d", bPath);
    adjustedRef.current?.setAttribute("d", aPath);
    adjustedGhostRef.current?.setAttribute("d", aPath);
    zoneRef.current?.setAttribute("d", zonePath);

    // ── dots ──
    for (let di = 0; di < DOT_INDICES.length; di++) {
      const pi = DOT_INDICES[di];
      const bDot = bDotRefs.current[di];
      const aDot = aDotRefs.current[di];

      if (bDot) {
        bDot.setAttribute("cx", bPts[pi][0].toFixed(1));
        bDot.setAttribute("cy", bPts[pi][1].toFixed(1));
        // Gentle, slow pulse
        const bo = 0.25 + 0.1 * Math.sin(t * 0.7 + di * PHI);
        bDot.setAttribute("opacity", bo.toFixed(3));
      }
      if (aDot) {
        aDot.setAttribute("cx", aPts[pi][0].toFixed(1));
        aDot.setAttribute("cy", aPts[pi][1].toFixed(1));
        const ao = 0.25 + 0.1 * Math.sin(t * 0.6 + di * PHI + 1.0);
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
        transition: "opacity 2.5s ease-in",
      }}
    >
      <defs>
        {/* Stroke gradients */}
        <linearGradient id="hero-stroke-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue, #6b93ef)" stopOpacity="0.8" />
          <stop offset="40%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="hero-stroke-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.8" />
          <stop offset="40%" stopColor="var(--brand-pink, #e04cb0)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.3" />
        </linearGradient>

        {/* Divergence zone fill */}
        <linearGradient id="hero-fill-zone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0" />
          <stop offset="25%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.05" />
          <stop offset="60%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.02" />
        </linearGradient>

        {/* Line glow — soft halo around a crisp stroke */}
        <filter id="hero-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ghost echo — even wider blur for the background echo lines */}
        <filter id="hero-ghost" x="-40%" y="-60%" width="180%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>

        {/* Dot glow */}
        <filter id="hero-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* Divergence zone — soft fill between curves */}
      <path ref={zoneRef} fill="url(#hero-fill-zone)" />

      {/* Ghost echo lines — wide diffuse glow behind the main curves */}
      <path
        ref={baselineGhostRef}
        stroke="var(--brand-purple, #b055f7)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#hero-ghost)"
        opacity="0.15"
      />
      <path
        ref={adjustedGhostRef}
        stroke="var(--brand-pink, #e04cb0)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#hero-ghost)"
        opacity="0.15"
      />

      {/* Main curves — solid, crisp with soft halo */}
      <path
        ref={baselineRef}
        stroke="url(#hero-stroke-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#hero-glow)"
        opacity="0.5"
      />
      <path
        ref={adjustedRef}
        stroke="url(#hero-stroke-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#hero-glow)"
        opacity="0.5"
      />

      {/* Glowing embers — baseline */}
      {DOT_INDICES.map((_, i) => (
        <circle
          key={`b${i}`}
          ref={(el) => { bDotRefs.current[i] = el; }}
          r="4"
          fill="var(--brand-purple, #b055f7)"
          filter="url(#hero-dot-glow)"
          opacity="0"
        />
      ))}

      {/* Glowing embers — adjusted */}
      {DOT_INDICES.map((_, i) => (
        <circle
          key={`a${i}`}
          ref={(el) => { aDotRefs.current[i] = el; }}
          r="4"
          fill="var(--brand-pink, #e04cb0)"
          filter="url(#hero-dot-glow)"
          opacity="0"
        />
      ))}
    </svg>
  );
}
