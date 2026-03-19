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
} from "recharts";
import type { RiskCalculation } from "@/data/types";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { baselineStillbirthCurve } from "@/data/risk-models/baseline-stillbirth";
import { chartColors } from "./chart-theme";
import { w } from "@/data/helpers";

interface Props {
  riskCurve: RiskCalculation[];
  currentGA: number;
  hasFactors: boolean;
}

export function StillbirthRiskCurve({ riskCurve, currentGA, hasFactors }: Props) {
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
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

          {/* Risk zone shading */}
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

          {/* ACOG guideline annotation */}
          <ReferenceLine
            x="41w0d"
            stroke={chartColors.text}
            strokeDasharray="4 4"
            label={{
              value: "ACOG: offer induction",
              position: "top",
              fill: chartColors.text,
              fontSize: 10,
            }}
          />
          <ReferenceLine
            x="42w0d"
            stroke={chartColors.stillbirth}
            strokeDasharray="4 4"
            label={{
              value: "Never beyond 42w",
              position: "top",
              fill: chartColors.stillbirth,
              fontSize: 10,
            }}
          />

          <XAxis
            dataKey="ga"
            tick={{ fill: chartColors.text, fontSize: 12 }}
            label={{
              value: "Gestational Age",
              position: "bottom",
              offset: 0,
              fill: chartColors.text,
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fill: chartColors.text, fontSize: 12 }}
            domain={[0, yMax]}
            label={{
              value: "Stillbirth per 1,000",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: chartColors.text,
              fontSize: 12,
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              if (!d) return null;
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md text-xs space-y-1">
                  <p className="font-medium">{d.ga}</p>
                  <p className="text-muted-foreground">
                    Baseline: {d.baseline.toFixed(2)} per 1,000
                  </p>
                  {hasFactors && (
                    <>
                      <p className="text-[var(--risk-high)] font-medium">
                        Adjusted: {d.adjusted.toFixed(2)} per 1,000
                      </p>
                      <p className="text-muted-foreground">
                        95% CI: {d.ciLow.toFixed(2)} – {d.ciHigh.toFixed(2)}
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
              fill={chartColors.ci}
              fillOpacity={1}
            />
          )}

          {/* Baseline curve (dashed when factors active) */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke={chartColors.baseline}
            strokeWidth={hasFactors ? 1.5 : 2.5}
            strokeDasharray={hasFactors ? "6 3" : undefined}
            dot={{ fill: chartColors.baseline, r: hasFactors ? 2 : 4 }}
            name="Baseline"
          />

          {/* Adjusted curve (only when factors active) */}
          {hasFactors && (
            <Line
              type="monotone"
              dataKey="adjusted"
              stroke={chartColors.adjusted}
              strokeWidth={2.5}
              dot={{ fill: chartColors.adjusted, r: 4, strokeWidth: 2, stroke: "#fff" }}
              name="Adjusted"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
