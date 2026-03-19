"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";
import { FILTER_CONFIG } from "./pipeline-utils";
import type { ConfidenceScore } from "@/data/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PipelineFiltersProps {
  /** The 5 filter stage layouts (type === "filter") */
  stages: StageLayout[];
  /** Full confidence breakdown for value lookup */
  breakdown: ConfidenceScore["breakdown"];
  onHover?: (stage: StageLayout | null) => void;
  onClick?: (stage: StageLayout) => void;
}

// ── Threshold below which the filter shows a red pulse ────────────────────────

const LOW_VALUE_THRESHOLD = 0.8;

// ── Single filter column ──────────────────────────────────────────────────────

interface FilterColumnProps {
  stage: StageLayout;
  cfgIndex: number;
  onHover?: (stage: StageLayout | null) => void;
  onClick?: (stage: StageLayout) => void;
}

function FilterColumn({ stage, cfgIndex, onHover, onClick }: FilterColumnProps) {
  const reducedMotion = useReducedMotion();
  const cfg = FILTER_CONFIG[cfgIndex];
  const value = stage.value ?? 1;
  const isLow = value < LOW_VALUE_THRESHOLD;

  const { x, y, width, height } = stage;
  const fillHeight = height * value;
  const fillY = y + height - fillHeight;

  const LABEL_OFFSET = 14;
  const VALUE_OFFSET = 14;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${cfg.abbr} filter (${cfg.key}): value ${(value * 100).toFixed(0)}%${isLow ? " — below threshold" : ""}`}
      style={{ cursor: "pointer", outline: "none" }}
      onMouseEnter={() => onHover?.(stage)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(stage)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(stage);
        }
      }}
    >
      {/* Background rect */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill="var(--muted)"
        opacity={0.4}
      />

      {/* Animated fill from bottom */}
      {reducedMotion ? (
        <rect
          x={x}
          y={fillY}
          width={width}
          height={fillHeight}
          rx={4}
          ry={4}
          fill={cfg.color}
          opacity={0.75}
        />
      ) : (
        <motion.rect
          x={x}
          width={width}
          rx={4}
          ry={4}
          fill={cfg.color}
          opacity={0.75}
          initial={{ y: y + height, height: 0 }}
          animate={{ y: fillY, height: fillHeight }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: cfgIndex * 0.05 }}
        />
      )}

      {/* Red pulse overlay when value < threshold */}
      {isLow && !reducedMotion && (
        <motion.rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          ry={4}
          fill="#ef4444"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {isLow && reducedMotion && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          ry={4}
          fill="#ef4444"
          opacity={0.15}
        />
      )}

      {/* Abbreviation label above */}
      <text
        x={x + width / 2}
        y={y - LABEL_OFFSET}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={9}
        fontWeight={600}
        fill={cfg.color}
      >
        {cfg.abbr}
      </text>

      {/* Value label below */}
      <text
        x={x + width / 2}
        y={y + height + VALUE_OFFSET}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={8}
        fill="var(--muted-foreground)"
      >
        {(value * 100).toFixed(0)}%
      </text>
    </g>
  );
}

// ── PipelineFilters ───────────────────────────────────────────────────────────

export function PipelineFilters({
  stages,
  breakdown,
  onHover,
  onClick,
}: PipelineFiltersProps) {
  // Map breakdown keys in FILTER_CONFIG order to stages
  return (
    <>
      {FILTER_CONFIG.map((cfg, i) => {
        const stage = stages.find((s) => s.id === `filter_${cfg.key}`);
        if (!stage) return null;

        // Ensure the stage value reflects the breakdown (overrides if needed)
        const stageWithValue: StageLayout = {
          ...stage,
          value: breakdown[cfg.key],
        };

        return (
          <FilterColumn
            key={cfg.key}
            stage={stageWithValue}
            cfgIndex={i}
            onHover={onHover}
            onClick={onClick}
          />
        );
      })}
    </>
  );
}
