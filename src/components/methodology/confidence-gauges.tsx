"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { ConfidenceScore } from "@/data/types";

// ── Gauge config ───────────────────────────────────────────────────────────────

interface GaugeConfig {
  key: keyof ConfidenceScore["breakdown"];
  label: string;
  color: string;
}

const GAUGES: GaugeConfig[] = [
  { key: "evidenceQuality", label: "EQ", color: "#3b82f6" },
  { key: "modelValidity", label: "MV", color: "#8b5cf6" },
  { key: "interactionPenalty", label: "IP", color: "#f59e0b" },
  { key: "magnitudePlausibility", label: "MP", color: "#14b8a6" },
  { key: "rareDiseaseValidity", label: "RP", color: "#f43f5e" },
];

// ── Grade colors ───────────────────────────────────────────────────────────────

const GRADE_COLORS: Record<ConfidenceScore["grade"], string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

// ── Single animated gauge bar ──────────────────────────────────────────────────

interface GaugeBarProps {
  value: number;
  color: string;
  label: string;
}

function GaugeBar({ value, color, label }: GaugeBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: prefersReducedMotion ? 10000 : 180, damping: 22 });
  const heightPct = useTransform(spring, (v) => `${Math.round(v * 100)}%`);

  // Pulse state tracking via ref to avoid re-render loops
  const prevValueRef = useRef(value);

  useEffect(() => {
    motionVal.set(value);
    prevValueRef.current = value;
  }, [value, motionVal]);

  // Determine pulse color based on value
  const pulseBg =
    value < 0.6
      ? "rgba(239,68,68,0.35)"
      : value < 0.8
        ? "rgba(239,68,68,0.18)"
        : "transparent";

  const pulseKey = value < 0.6 ? "strong" : value < 0.8 ? "mild" : "none";

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Value label above bar */}
      <span className="font-mono text-xs font-semibold" style={{ color }}>
        {(value * 100).toFixed(0)}
      </span>

      {/* Bar container */}
      <div
        className="relative w-8 overflow-hidden rounded-md border"
        style={{
          height: "96px", // h-24
          background: "hsl(var(--muted))",
          borderColor: "hsl(var(--border))",
        }}
      >
        {/* Pulse overlay */}
        {pulseKey !== "none" && (
          <motion.div
            key={`pulse-${pulseKey}`}
            className="pointer-events-none absolute inset-0 z-10 rounded-md"
            animate={{ opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: pulseBg }}
          />
        )}

        {/* Animated fill — grows from bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-md"
          style={{
            height: heightPct,
            background: color,
            opacity: 0.85,
          }}
        />
      </div>

      {/* Key label below bar */}
      <span
        className="text-xs font-bold tracking-wide"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main ConfidenceGauges component ───────────────────────────────────────────

export interface ConfidenceGaugesProps {
  confidenceScore: ConfidenceScore;
}

export function ConfidenceGauges({ confidenceScore }: ConfidenceGaugesProps) {
  const { breakdown, score, grade } = confidenceScore;
  const gradeColor = GRADE_COLORS[grade];

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Confidence Component Gauges
      </p>

      {/* Five gauge bars */}
      <div className="flex items-end justify-around gap-2 pb-2">
        {GAUGES.map((g) => (
          <GaugeBar
            key={g.key}
            value={breakdown[g.key]}
            color={g.color}
            label={g.label}
          />
        ))}
      </div>

      {/* Multiplication chain */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1 font-mono text-xs">
        {GAUGES.map((g, i) => (
          <span key={g.key} className="flex items-center gap-1">
            <span
              className="rounded px-1.5 py-0.5 font-semibold"
              style={{
                color: g.color,
                background: `${g.color}18`,
              }}
            >
              {breakdown[g.key].toFixed(3)}
            </span>
            {i < GAUGES.length - 1 && (
              <span className="text-muted-foreground">×</span>
            )}
          </span>
        ))}

        <span className="mx-1 text-muted-foreground">=</span>

        <span className="font-bold text-sm" style={{ color: gradeColor }}>
          {(
            breakdown.evidenceQuality *
            breakdown.modelValidity *
            breakdown.interactionPenalty *
            breakdown.magnitudePlausibility *
            breakdown.rareDiseaseValidity
          ).toFixed(3)}
        </span>

        <span className="text-muted-foreground">×100 =</span>

        {/* Final score */}
        <span
          className="rounded-md px-2 py-0.5 text-sm font-bold"
          style={{ color: gradeColor, background: `${gradeColor}18` }}
        >
          {score}
        </span>

        {/* Grade badge */}
        <span
          className="ml-1 rounded-md px-2 py-0.5 text-sm font-bold"
          style={{ background: gradeColor, color: "#fff" }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
