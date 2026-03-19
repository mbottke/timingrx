"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Convert a hex/rgb color to an rgba string with the given opacity. */
function withOpacity(color: string, opacity: number): string {
  if (color.startsWith("#")) {
    const hex = color.replace(/^#/, "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  return color;
}

// ── Animation variants ────────────────────────────────────────────────────────

const slideInVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15 } },
};

const noMotionVariants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 1, y: 0, scale: 1 },
};

// ── Stage node props ──────────────────────────────────────────────────────────

export interface StageNodeProps {
  stage: StageLayout;
  onHover?: (stage: StageLayout | null) => void;
  onClick?: (stage: StageLayout) => void;
}

// ── Shared container ──────────────────────────────────────────────────────────

function StageContainer({
  stage,
  children,
  ariaLabel,
  onHover,
  onClick,
}: StageNodeProps & {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? noMotionVariants : slideInVariants;

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      style={{ cursor: "pointer", outline: "none" }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      onHoverStart={() => onHover?.(stage)}
      onHoverEnd={() => onHover?.(null)}
      onClick={() => onClick?.(stage)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(stage);
        }
      }}
      whileFocus={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.6))" }}
    >
      {children}
    </motion.g>
  );
}

// ── MugluNode ─────────────────────────────────────────────────────────────────

export function MugluNode({ stage, onHover, onClick }: StageNodeProps) {
  const { x, y, width, height, value } = stage;

  return (
    <StageContainer
      stage={stage}
      onHover={onHover}
      onClick={onClick}
      ariaLabel={`Muglu 2019 baseline node. Baseline risk: ${value?.toFixed(2) ?? "—"} per 1000.`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        ry={10}
        fill="var(--background)"
        stroke="var(--primary)"
        strokeWidth={2}
      />
      <text
        x={x + width / 2}
        y={y + height * 0.38}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight={600}
        fill="var(--foreground)"
      >
        Muglu 2019
      </text>
      <text
        x={x + width / 2}
        y={y + height * 0.72}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={700}
        fill="var(--primary)"
      >
        {value !== undefined ? `${value.toFixed(2)}/1000` : "—"}
      </text>
    </StageContainer>
  );
}

// ── GateNode ──────────────────────────────────────────────────────────────────

export function GateNode({ stage, onHover, onClick }: StageNodeProps) {
  const { x, y, width, height, color = "#94a3b8", label = "", multiplier, cumulativeRisk, isInteraction } = stage;

  const borderColor = color;
  const bgColor = withOpacity(color, 0.08);
  const labelPrefix = isInteraction ? "↳ " : "";
  const displayLabel = isInteraction
    ? `${labelPrefix}${label}`
    : label;

  return (
    <StageContainer
      stage={stage}
      onHover={onHover}
      onClick={onClick}
      ariaLabel={`${isInteraction ? "Interaction gate" : "Risk factor gate"}: ${label}. Multiplier: ×${multiplier?.toFixed(2) ?? "—"}. Cumulative risk: ${cumulativeRisk?.toFixed(2) ?? "—"} per 1000.`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={1.5}
        strokeDasharray={isInteraction ? "4 3" : undefined}
      />
      {/* Label */}
      <text
        x={x + 8}
        y={y + height * 0.38}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={9}
        fontWeight={isInteraction ? 400 : 500}
        fontStyle={isInteraction ? "italic" : "normal"}
        fill="var(--foreground)"
      >
        {displayLabel.length > 26
          ? `${displayLabel.slice(0, 24)}…`
          : displayLabel}
      </text>
      {/* Multiplier */}
      <text
        x={x + 8}
        y={y + height * 0.72}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={10}
        fontWeight={700}
        fill={borderColor}
      >
        ×{multiplier?.toFixed(2) ?? "—"}
      </text>
      {/* Cumulative risk */}
      {cumulativeRisk !== undefined && (
        <text
          x={x + width - 8}
          y={y + height * 0.72}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={9}
          fill="var(--muted-foreground)"
        >
          {cumulativeRisk.toFixed(2)}/1000
        </text>
      )}
    </StageContainer>
  );
}

// ── CINode ────────────────────────────────────────────────────────────────────

export function CINode({ stage, onHover, onClick }: StageNodeProps) {
  const { x, y, width, height, value } = stage;

  return (
    <StageContainer
      stage={stage}
      onHover={onHover}
      onClick={onClick}
      ariaLabel={`95% Confidence Interval chamber. Adjusted risk: ${value?.toFixed(2) ?? "—"} per 1000.`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        ry={10}
        fill="var(--background)"
        stroke="#7c3aed"
        strokeWidth={2}
      />
      <text
        x={x + width / 2}
        y={y + height * 0.38}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fontWeight={600}
        fill="#7c3aed"
      >
        95% Confidence Interval
      </text>
      {value !== undefined && (
        <text
          x={x + width / 2}
          y={y + height * 0.72}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
          fontWeight={700}
          fill="var(--foreground)"
        >
          {value.toFixed(2)}/1000
        </text>
      )}
    </StageContainer>
  );
}

// ── OutputNode ────────────────────────────────────────────────────────────────

export function OutputNode({ stage, onHover, onClick }: StageNodeProps) {
  const { x, y, width, height, color = "#94a3b8", label = "", value } = stage;

  const bgColor = withOpacity(color, 0.12);

  return (
    <StageContainer
      stage={stage}
      onHover={onHover}
      onClick={onClick}
      ariaLabel={`Output node. Confidence grade: ${label}. Adjusted risk: ${value?.toFixed(2) ?? "—"} per 1000.`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill={bgColor}
        stroke={color}
        strokeWidth={2.5}
      />
      {/* Large grade letter */}
      <text
        x={x + 40}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={32}
        fontWeight={800}
        fill={color}
      >
        {label}
      </text>
      {/* Risk value */}
      {value !== undefined && (
        <text
          x={x + width / 2 + 16}
          y={y + height * 0.38}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fontWeight={700}
          fill="var(--foreground)"
        >
          {value.toFixed(2)}/1000
        </text>
      )}
      <text
        x={x + width / 2 + 16}
        y={y + height * 0.68}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        adjusted risk
      </text>
    </StageContainer>
  );
}

// ── PipelineStage router ──────────────────────────────────────────────────────

/**
 * Route a StageLayout to the correct node component based on its type.
 */
export function PipelineStage({ stage, onHover, onClick }: StageNodeProps) {
  switch (stage.type) {
    case "muglu":
      return <MugluNode stage={stage} onHover={onHover} onClick={onClick} />;
    case "gate":
    case "interaction":
      return <GateNode stage={stage} onHover={onHover} onClick={onClick} />;
    case "ci":
      return <CINode stage={stage} onHover={onHover} onClick={onClick} />;
    case "output":
      return <OutputNode stage={stage} onHover={onHover} onClick={onClick} />;
    case "filter":
      // Filters are rendered by PipelineFilters component
      return null;
    default:
      return null;
  }
}
