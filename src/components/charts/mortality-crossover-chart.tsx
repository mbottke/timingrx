"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Label,
} from "recharts";
import { gaToDisplay } from "@/lib/utils/ga-format";
import {
  calculateMortalityIndex,
  findMortalityCrossover,
} from "@/lib/calculator/mortality-index";
import { chartColors } from "./chart-theme";
import { ChartGradientDefs } from "./chart-gradient-defs";

interface Props {
  combinedMultiplier: number;
  currentGA: number;
  height?: string;
}

export function MortalityCrossoverChart({
  combinedMultiplier,
  currentGA,
  height,
}: Props) {
  const index = calculateMortalityIndex(combinedMultiplier);
  const crossover = findMortalityCrossover(combinedMultiplier);

  const data = index.map((point) => ({
    ga: gaToDisplay(point.ga),
    gaRaw: point.ga,
    expectantRisk: point.expectantRisk,
    deliveryRisk: point.deliveryRisk,
    favorDelivery: point.favorDelivery,
  }));

  const maxY = Math.max(
    ...data.map((d) => d.expectantRisk),
    ...data.map((d) => d.deliveryRisk)
  );
  const yMax = Math.ceil(maxY * 1.3 * 10) / 10;

  const crossoverLabel = crossover ? gaToDisplay(crossover) : null;
  const currentGALabel = gaToDisplay(currentGA);

  return (
    <div className="w-full" style={{ height: height ?? "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 25, left: 20 }}
        >
          <ChartGradientDefs />
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

          {/* Zone shading based on crossover */}
          {crossoverLabel && (
            <>
              <ReferenceArea
                x1={data[0].ga}
                x2={crossoverLabel}
                fill={chartColors.safe}
                fillOpacity={1}
              />
              <ReferenceArea
                x1={crossoverLabel}
                x2={data[data.length - 1].ga}
                fill={chartColors.danger}
                fillOpacity={1}
              />
            </>
          )}
          {!crossoverLabel && (
            <ReferenceArea
              x1={data[0].ga}
              x2={data[data.length - 1].ga}
              fill={chartColors.safe}
              fillOpacity={1}
            />
          )}

          {/* Crossover reference line */}
          {crossoverLabel && (
            <ReferenceLine
              x={crossoverLabel}
              stroke="var(--brand-pink)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: "Balance favors delivery",
                position: "insideTopRight",
                fill: "var(--brand-pink)",
                fontSize: 9,
                dy: 4,
                dx: -4,
              }}
            />
          )}

          {/* Current GA marker */}
          {data.some((d) => d.ga === currentGALabel) && (
            <ReferenceLine
              x={currentGALabel}
              stroke={chartColors.text}
              strokeDasharray="2 2"
              strokeWidth={1}
              label={{
                value: "Current GA",
                position: "insideBottomLeft",
                fill: chartColors.text,
                fontSize: 9,
                dy: -6,
                dx: 4,
              }}
            />
          )}

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
            <Label
              value="Risk per 1,000"
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
                  <p className="text-[var(--brand-pink)]">
                    Expectant (stillbirth):{" "}
                    <span className="font-mono tabular-nums">
                      {d.expectantRisk.toFixed(3)}
                    </span>{" "}
                    per 1,000
                  </p>
                  <p className="text-[var(--brand-purple)]">
                    Delivery (neonatal):{" "}
                    <span className="font-mono tabular-nums">
                      {d.deliveryRisk.toFixed(3)}
                    </span>{" "}
                    per 1,000
                  </p>
                  {d.favorDelivery && (
                    <p className="text-[var(--brand-pink)] font-medium mt-1">
                      Delivery favored at this GA
                    </p>
                  )}
                </div>
              );
            }}
          />

          {/* Expectant management risk (stillbirth if waiting) */}
          <Line
            type="monotone"
            dataKey="expectantRisk"
            stroke={chartColors.adjustedGradient}
            strokeWidth={2.5}
            dot={{
              fill: "var(--brand-pink)",
              r: 3,
              strokeWidth: 2,
              stroke: "var(--background)",
            }}
            name="Expectant risk (stillbirth)"
          />

          {/* Delivery risk (neonatal death) */}
          <Line
            type="monotone"
            dataKey="deliveryRisk"
            stroke={chartColors.baselineGradient}
            strokeWidth={2.5}
            dot={{
              fill: "var(--brand-purple)",
              r: 3,
              strokeWidth: 2,
              stroke: "var(--background)",
            }}
            name="Delivery risk (neonatal)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
