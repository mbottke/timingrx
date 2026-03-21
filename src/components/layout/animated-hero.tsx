"use client";

/**
 * Animated decorative background SVG — two diverging risk curves
 * that draw themselves on mount using Framer Motion pathLength animation.
 * Purely decorative; placed behind hero sections via absolute positioning.
 */

import { motion } from "framer-motion";

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
        <linearGradient id="hero-grad-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--brand-purple, #b055f7)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="hero-grad-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="hero-grad-dot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" />
        </linearGradient>
      </defs>

      {/* Lower curve — baseline/population risk, purple tint, gentle rise */}
      <motion.path
        d="M0 160 C200 155, 400 140, 600 120 S750 95, 800 80"
        stroke="url(#hero-grad-purple)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Upper curve — adjusted/elevated risk, pink tint, steeper rise */}
      <motion.path
        d="M0 155 C200 140, 350 100, 500 60 S680 15, 800 5"
        stroke="url(#hero-grad-pink)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Pulsing data point dots along the lower curve */}
      <motion.circle
        cx="200"
        cy="148"
        r="3"
        fill="url(#hero-grad-dot)"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: [1, 1.4, 1] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.4 },
          scale: { delay: 0.8, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.circle
        cx="450"
        cy="128"
        r="3"
        fill="url(#hero-grad-dot)"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: [1, 1.4, 1] }}
        transition={{
          opacity: { delay: 1.0, duration: 0.4 },
          scale: { delay: 1.0, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Pulsing data point dots along the upper curve */}
      <motion.circle
        cx="300"
        cy="120"
        r="3"
        fill="url(#hero-grad-dot)"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: [1, 1.4, 1] }}
        transition={{
          opacity: { delay: 1.1, duration: 0.4 },
          scale: { delay: 1.1, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.circle
        cx="550"
        cy="52"
        r="3"
        fill="url(#hero-grad-dot)"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: [1, 1.4, 1] }}
        transition={{
          opacity: { delay: 1.3, duration: 0.4 },
          scale: { delay: 1.3, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </svg>
  );
}
