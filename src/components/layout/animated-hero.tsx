"use client";

/**
 * Animated decorative background SVG — two diverging risk curves
 * that draw themselves on mount using Framer Motion pathLength animation,
 * with a soft gradient fill between them showing the divergence zone.
 * Purely decorative; placed behind hero sections via absolute positioning.
 */

import { motion } from "framer-motion";

/** Data-point positions along each curve (x, y) */
const baselineDots = [
  [100, 158], [250, 150], [400, 140], [550, 125], [700, 100],
] as const;

const adjustedDots = [
  [100, 153], [250, 130], [400, 90], [550, 50], [700, 15],
] as const;

export function AnimatedHero({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 200"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Curve stroke gradients */}
        <linearGradient id="hero-stroke-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue, #6b93ef)" />
          <stop offset="50%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="hero-stroke-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="50%" stopColor="var(--brand-pink, #e04cb0)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.4" />
        </linearGradient>

        {/* Fill gradient for the divergence zone between curves */}
        <linearGradient id="hero-fill-zone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0" />
          <stop offset="25%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.08" />
          <stop offset="60%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.03" />
        </linearGradient>

        {/* Dot gradient */}
        <linearGradient id="hero-grad-dot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" />
        </linearGradient>

        {/* Soft glow filter for curves */}
        <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Divergence zone — filled area between the two curves */}
      <motion.path
        d="M0 160 C200 155, 400 140, 600 120 S750 95, 800 80 L800 5 C680 15, 500 60, 350 100 S200 140, 0 155 Z"
        fill="url(#hero-fill-zone)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 6, ease: "easeInOut", delay: 0.8, repeat: Infinity }}
      />

      {/* Lower curve — baseline risk, purple, gentle rise */}
      <motion.path
        d="M0 160 C200 155, 400 140, 600 120 S750 95, 800 80"
        stroke="url(#hero-stroke-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="8 4"
        filter="url(#hero-glow)"
        initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0, y: 0 }}
        animate={{ pathLength: 1, opacity: 0.55, strokeDashoffset: -24, y: [0, -2, 0, 2, 0] }}
        transition={{
          pathLength: { duration: 2.2, ease: "easeInOut" },
          opacity: { duration: 2.2, ease: "easeInOut" },
          strokeDashoffset: { duration: 3, ease: "linear", repeat: Infinity, delay: 2.2 },
          y: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: 2.2 },
        }}
      />

      {/* Upper curve — adjusted risk, pink, steeper rise */}
      <motion.path
        d="M0 155 C200 140, 350 100, 500 60 S680 15, 800 5"
        stroke="url(#hero-stroke-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="10 5"
        filter="url(#hero-glow)"
        initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0, y: 0 }}
        animate={{ pathLength: 1, opacity: 0.55, strokeDashoffset: -30, y: [0, -3, 0, 3, 0] }}
        transition={{
          pathLength: { duration: 2.2, ease: "easeInOut", delay: 0.3 },
          opacity: { duration: 2.2, ease: "easeInOut", delay: 0.3 },
          strokeDashoffset: { duration: 2.5, ease: "linear", repeat: Infinity, delay: 2.5 },
          y: { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 2.5 },
        }}
      />

      {/* Divergence origin — where curves separate */}
      <motion.circle
        cx="80"
        cy="156"
        r="4"
        fill="url(#hero-grad-dot)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.5, scale: [1, 1.3, 1] }}
        transition={{
          opacity: { delay: 0.4, duration: 0.6 },
          scale: { delay: 0.4, duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Data points along baseline curve */}
      {baselineDots.map(([cx, cy], i) => (
        <motion.circle
          key={`b${i}`}
          cx={cx}
          cy={cy}
          r="3"
          fill="var(--brand-purple, #b055f7)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: [1, 1.25, 1] }}
          transition={{
            opacity: { delay: 0.8 + i * 0.25, duration: 0.5 },
            scale: { delay: 0.8 + i * 0.25, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {/* Data points along adjusted curve */}
      {adjustedDots.map(([cx, cy], i) => (
        <motion.circle
          key={`a${i}`}
          cx={cx}
          cy={cy}
          r="3"
          fill="var(--brand-pink, #e04cb0)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: [1, 1.25, 1] }}
          transition={{
            opacity: { delay: 1.0 + i * 0.25, duration: 0.5 },
            scale: { delay: 1.0 + i * 0.25, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
    </svg>
  );
}
