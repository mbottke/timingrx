"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Label,
} from "recharts";
import type { RiskCalculation } from "@/data/types";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { chartColors } from "./chart-theme";
import { ChartGradientDefs } from "./chart-gradient-defs";

interface Props {
  riskCurve: RiskCalculation[];
  currentGA: number;
  hasFactors: boolean;
  /** Override chart container height (CSS value, e.g. "250px" or "100%") */
  height?: string;
}

/** Custom label renderer for data points showing the adjusted risk value. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdjustedDotLabel(props: any) {
  const { x, y, value } = props;
  if (x == null || y == null || value == null) return null;
  return (
    <text
      x={x}
      y={y - 10}
      textAnchor="middle"
      fontSize={9}
      fontFamily="var(--font-geist-mono), monospace"
      fontWeight={600}
      fill="var(--brand-pink)"
    >
      {Number(value).toFixed(2)}
    </text>
  );
}

export function StillbirthRiskCurve({ riskCurve, currentGA, hasFactors, height }: Props) {
  const data = riskCurve.map((point, i) => ({
    ga: gaToDisplay(point.ga),
    gaRaw: point.ga,
    baseline: baselineStillbirthCurve[i]?.riskPer1000 ?? 0,
    adjusted: point.adjustedRiskPer1000,
    ciLow: point.adjustedRiskCI95[0],
    ciHigh: point.adjustedRiskCI95[1],
  }));

  const maxY = Math.max(
    ...data.map((d) => d.ciHigh),
    ...data.map((d) => d.adjusted)
  );
  const yMax = Math.ceil(maxY * 1.2 * 10) / 10;

  return (
    <div className="w-full" style={{ height: height ?? "350px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 25, left: 20 }}>
          <ChartGradientDefs />
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

          {/* Risk zone shading — subtle tints */}
          <ReferenceArea
            x1="37w0d"
            x2="39w0d"
            fill={chartColors.safe}
            fillOpacity={1}
          />
          <ReferenceArea
            x1="39w0d"
            x2="41w0d"
            fill={chartColors.caution}
            fillOpacity={1}
          />
          <ReferenceArea
            x1="41w0d"
            x2="42w0d"
            fill={chartColors.danger}
            fillOpacity={1}
          />

          {/* ACOG guideline annotations — labels below the X-axis ticks */}
          <ReferenceLine
            x="41w0d"
            stroke={chartColors.text}
            strokeDasharray="4 4"
            label={{
              value: "Offer induction →",
              position: "insideBottomLeft",
              fill: chartColors.text,
              fontSize: 9,
              dy: -6,
              dx: 2,
            }}
          />
          <ReferenceLine
            x="42w0d"
            stroke="var(--brand-pink)"
            strokeDasharray="4 4"
            label={{
              value: "← Never beyond",
              position: "insideBottomRight",
              fill: "var(--brand-pink)",
              fontSize: 9,
              dy: -6,
              dx: -2,
            }}
          />

          <XAxis
            dataKey="ga"
            tick={{ fill: chartColors.text, fontSize: 11 }}
            label={{
              value: "Gestational Age",
              position: "bottom",
              offset: 5,
              fill: chartColors.text,
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: chartColors.text, fontSize: 11 }}
            domain={[0, yMax]}
            width={55}
          >
            {/* Custom centered Y-axis label */}
            <Label
              value="Stillbirth per 1,000"
              angle={-90}
              position="center"
              dx={-18}
              fill={chartColors.text}
              fontSize={11}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              if (!d) return null;
              return (
                <div className="rounded-lg border bg-card p-3 shadow-md text-xs space-y-1">
                  <p className="font-semibold font-mono">{d.ga}</p>
                  <p className="text-muted-foreground">
                    Baseline: <span className="font-mono tabular-nums">{d.baseline.toFixed(2)}</span> per 1,000
                  </p>
                  {hasFactors && (
                    <>
                      <p className="text-[var(--brand-pink)] font-medium">
                        Adjusted: <span className="font-mono tabular-nums">{d.adjusted.toFixed(2)}</span> per 1,000
                      </p>
                      <p className="text-muted-foreground">
                        95% CI: <span className="font-mono tabular-nums">{d.ciLow.toFixed(2)} – {d.ciHigh.toFixed(2)}</span>
                      </p>
                    </>
                  )}
                </div>
              );
            }}
          />

          {/* CI band (only when factors active) */}
          {hasFactors && (
            <Area
              type="monotone"
              dataKey="ciHigh"
              stroke="none"
              fill={chartColors.ciGradient}
              fillOpacity={1}
            />
          )}

          {/* Baseline curve (dashed when factors active) */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke={chartColors.baselineGradient}
            strokeWidth={hasFactors ? 1.5 : 2.5}
            strokeDasharray={hasFactors ? "6 3" : undefined}
            dot={{ fill: "var(--brand-purple)", r: hasFactors ? 2 : 3 }}
            name="Baseline"
            label={
              !hasFactors
                ? (props: any) => (
                    <AdjustedDotLabel
                      x={props.x as number}
                      y={props.y as number}
                      value={props.value as number}
                      index={props.index as number}
                    />
                  )
                : undefined
            }
          />

          {/* Adjusted curve (only when factors active) */}
          {hasFactors && (
            <Line
              type="monotone"
              dataKey="adjusted"
              stroke={chartColors.adjustedGradient}
              strokeWidth={2.5}
              dot={{ fill: "var(--brand-pink)", r: 4, strokeWidth: 2, stroke: "var(--background)" }}
              name="Adjusted"
              label={(props: any) => (
                <AdjustedDotLabel
                  x={props.x as number}
                  y={props.y as number}
                  value={props.value as number}
                  index={props.index as number}
                />
              )}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
