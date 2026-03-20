"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { RiskCalculation, GestationalAgeDays } from "@/data/types";
import type { EquivalenceMapping } from "./use-timeline-equivalence";
import { GA_WEEKS } from "./use-timeline-playback";

// ── Layout constants ────────────────────────────────────────────────────────
const PADDING = { top: 30, right: 60, bottom: 40, left: 20 };
const CHART_HEIGHT = 200;
const NODE_R = 8;
const NODE_R_ACTIVE = 12;
const REFERENCE_LINES = [1.0, 2.0]; // per 1,000

// ── Helpers ─────────────────────────────────────────────────────────────────

function severityNodeColor(risk: number): string {
  if (risk >= 2.0) return "var(--risk-high)";
  if (risk >= 1.0) return "var(--risk-moderate)";
  return "var(--risk-low)";
}

/** Build a smooth SVG path through data points using cubic bezier */
function buildCurvePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

/** Build closed CI band path (top curve forward, bottom curve backward) */
function buildBandPath(
  topPoints: { x: number; y: number }[],
  bottomPoints: { x: number; y: number }[]
): string {
  if (topPoints.length < 2) return "";
  const forward = buildCurvePath(topPoints);
  // Reverse for the bottom edge
  const rev = [...bottomPoints].reverse();
  let back = `L${rev[0].x},${rev[0].y}`;
  for (let i = 1; i < rev.length; i++) {
    const prev = rev[i - 1];
    const curr = rev[i];
    const cpX = (prev.x + curr.x) / 2;
    back += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
  }
  return forward + back + "Z";
}

// ── Component ───────────────────────────────────────────────────────────────

interface TimelineChartProps {
  riskCurve: RiskCalculation[];
  currentGA: GestationalAgeDays;
  setGA: (ga: GestationalAgeDays) => void;
  equivalences: EquivalenceMapping[];
  isPlaying: boolean;
}

export function TimelineChart({
  riskCurve,
  currentGA,
  setGA,
  equivalences,
  isPlaying,
}: TimelineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    obs.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => obs.disconnect();
  }, []);

  const hasFactors = riskCurve.some(
    (pt) => pt.adjustedRiskPer1000 !== pt.baselineRiskPer1000
  );

  // Compute scales
  const plotW = width - PADDING.left - PADDING.right;
  const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  // Y scale: max of all visible values (adjusted CI high, or baseline if no factors)
  const maxRisk = useMemo(() => {
    let max = 0;
    for (const pt of riskCurve) {
      max = Math.max(max, pt.baselineRiskPer1000);
      if (hasFactors) {
        max = Math.max(max, pt.adjustedRiskCI95[1]);
      }
    }
    // Add 15% headroom
    return max * 1.15;
  }, [riskCurve, hasFactors]);

  const xScale = useCallback(
    (ga: GestationalAgeDays) => {
      const idx = GA_WEEKS.indexOf(ga as (typeof GA_WEEKS)[number]);
      if (idx === -1) return PADDING.left;
      return PADDING.left + (idx / (GA_WEEKS.length - 1)) * plotW;
    },
    [plotW]
  );

  const yScale = useCallback(
    (risk: number) => {
      return PADDING.top + plotH - (risk / maxRisk) * plotH;
    },
    [plotH, maxRisk]
  );

  // Build curve points
  const baselinePoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga),
    y: yScale(pt.baselineRiskPer1000),
  }));
  const adjustedPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga),
    y: yScale(pt.adjustedRiskPer1000),
  }));
  const ciHighPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga),
    y: yScale(pt.adjustedRiskCI95[1]),
  }));
  const ciLowPoints = riskCurve.map((pt) => ({
    x: xScale(pt.ga),
    y: yScale(pt.adjustedRiskCI95[0]),
  }));

  const handleNodeClick = useCallback(
    (ga: GestationalAgeDays) => setGA(ga),
    [setGA]
  );

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={width}
        height={CHART_HEIGHT}
        className="select-none"
        aria-hidden="true"
      >
        {/* Reference lines */}
        {REFERENCE_LINES.map((val) => {
          const y = yScale(val);
          if (y < PADDING.top || y > PADDING.top + plotH) return null;
          return (
            <g key={`ref-${val}`}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={width - PADDING.right}
                y2={y}
                stroke="var(--muted-foreground)"
                strokeWidth={0.5}
                strokeDasharray="4,6"
                opacity={0.4}
              />
              <text
                x={width - PADDING.right + 6}
                y={y + 3}
                fontSize={9}
                fill="var(--muted-foreground)"
                opacity={0.6}
              >
                {val}/1k
              </text>
            </g>
          );
        })}

        {/* CI band (only when factors active) */}
        {hasFactors && (
          <path
            d={buildBandPath(ciHighPoints, ciLowPoints)}
            fill="var(--brand-coral)"
            opacity={0.12}
          />
        )}

        {/* Baseline curve (always) */}
        <path
          d={buildCurvePath(baselinePoints)}
          stroke="var(--primary)"
          strokeWidth={1.5}
          strokeDasharray="6,4"
          fill="none"
        />

        {/* Adjusted curve (only when factors active) */}
        {hasFactors && (
          <path
            d={buildCurvePath(adjustedPoints)}
            stroke="var(--brand-coral)"
            strokeWidth={2.5}
            fill="none"
          />
        )}

        {/* Equivalence markers */}
        {hasFactors &&
          equivalences.map((eq) => {
            if (!eq.equivalentBaselineWeek) return null;
            const sourceX = xScale(eq.sourceGA);
            const targetIdx = GA_WEEKS.findIndex(
              (g) => Math.floor(g / 7) === eq.equivalentBaselineWeek
            );
            if (targetIdx === -1) return null;
            const targetX = xScale(GA_WEEKS[targetIdx]);
            const sourceRisk = riskCurve.find((pt) => pt.ga === eq.sourceGA);
            if (!sourceRisk) return null;
            const y = yScale(sourceRisk.adjustedRiskPer1000) - 8;
            return (
              <g key={`eq-${eq.sourceGA}`}>
                <line
                  x1={sourceX}
                  y1={y}
                  x2={targetX}
                  y2={y}
                  stroke="var(--ga-caution)"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
                <text
                  x={(sourceX + targetX) / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--ga-caution)"
                  fontWeight={500}
                >
                  {Math.floor(eq.sourceGA / 7)}w adj ≈{" "}
                  {eq.equivalentBaselineWeek}w base
                </text>
              </g>
            );
          })}

        {/* Selected week hairline */}
        <line
          x1={xScale(currentGA)}
          y1={PADDING.top}
          x2={xScale(currentGA)}
          y2={PADDING.top + plotH}
          stroke="var(--foreground)"
          strokeWidth={1}
          opacity={0.15}
        />

        {/* Week nodes */}
        {riskCurve.map((pt) => {
          const x = xScale(pt.ga);
          const risk = hasFactors
            ? pt.adjustedRiskPer1000
            : pt.baselineRiskPer1000;
          const y = yScale(risk);
          const isActive = pt.ga === currentGA;
          const r = isActive ? NODE_R_ACTIVE : NODE_R;
          const week = Math.floor(pt.ga / 7);
          return (
            <g key={pt.ga}>
              {/* Invisible larger click target */}
              <rect
                x={x - 20}
                y={PADDING.top}
                width={40}
                height={plotH + PADDING.bottom}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(pt.ga)}
              />
              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={severityNodeColor(risk)}
                stroke="var(--background)"
                strokeWidth={isActive ? 3 : 2}
                style={{
                  cursor: "pointer",
                  transition:
                    "r 200ms ease-out, cx 200ms ease-out, cy 200ms ease-out",
                }}
                className={
                  isActive && isPlaying ? "timeline-node-pulse" : ""
                }
                onClick={() => handleNodeClick(pt.ga)}
              />
              {/* Active ring */}
              {isActive && (
                <circle
                  cx={x}
                  cy={y}
                  r={r + 4}
                  fill="none"
                  stroke={severityNodeColor(risk)}
                  strokeWidth={2}
                  opacity={0.3}
                />
              )}
              {/* Week label */}
              <text
                x={x}
                y={PADDING.top + plotH + 20}
                textAnchor="middle"
                fontSize={isActive ? 12 : 11}
                fontWeight={isActive ? 700 : 400}
                fill={
                  isActive
                    ? "var(--foreground)"
                    : "var(--muted-foreground)"
                }
              >
                {week}w
              </text>
            </g>
          );
        })}
      </svg>

      {/* SR-only week buttons for accessibility */}
      <div className="sr-only">
        {riskCurve.map((pt) => {
          const week = Math.floor(pt.ga / 7);
          const risk = hasFactors
            ? pt.adjustedRiskPer1000
            : pt.baselineRiskPer1000;
          return (
            <button
              key={pt.ga}
              onClick={() => handleNodeClick(pt.ga)}
              aria-label={`${week} weeks, risk ${risk.toFixed(2)} per 1000`}
            >
              {week} weeks
            </button>
          );
        })}
      </div>
    </div>
  );
}
