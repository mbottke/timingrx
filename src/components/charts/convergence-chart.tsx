"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { convergenceData } from "@/data/physiologic";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { chartColors } from "./chart-theme";
import { ChartGradientDefs } from "./chart-gradient-defs";

const COLORS = {
  fluid: "#3b82f6",
  meconium: "#f59e0b",
  macrosomia: "#10b981",
  stillbirth: "var(--brand-pink)",
} as const;

export function ConvergenceChart() {
  const data = convergenceData.map((point) => ({
    ...point,
    ga: gaToDisplay(point.ga),
  }));

  return (
    <div className="w-full" style={{ height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 25, left: 20 }}>
          <ChartGradientDefs />
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

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

          {/* Left Y-axis: percentage (0-100) */}
          <YAxis
            yAxisId="left"
            tick={{ fill: chartColors.text, fontSize: 11 }}
            domain={[0, 100]}
            width={45}
            label={{
              value: "Percent (%)",
              angle: -90,
              position: "center",
              dx: -14,
              fill: chartColors.text,
              fontSize: 11,
              style: { textAnchor: "middle" },
            }}
          />

          {/* Right Y-axis: stillbirth per 1,000 x10 */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: chartColors.text, fontSize: 11 }}
            domain={[0, 40]}
            width={50}
            label={{
              value: "Stillbirth (per 1k, x10)",
              angle: 90,
              position: "center",
              dx: 18,
              fill: chartColors.text,
              fontSize: 11,
              style: { textAnchor: "middle" },
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              if (!d) return null;
              return (
                <div className="rounded-lg border bg-card p-3 shadow-md text-xs space-y-1">
                  <p className="font-semibold font-mono">{d.ga}</p>
                  <p style={{ color: COLORS.fluid }}>
                    Amniotic Fluid: <span className="font-mono tabular-nums">{d.amnioticFluidPercentPeak}%</span> of peak
                  </p>
                  <p style={{ color: COLORS.meconium }}>
                    Meconium Staining: <span className="font-mono tabular-nums">{d.meconiumStainedFluidPercent}%</span>
                  </p>
                  <p style={{ color: COLORS.macrosomia }}>
                    Macrosomia (&gt;4000g): <span className="font-mono tabular-nums">{d.macrosomiaOver4000gPercent}%</span>
                  </p>
                  <p style={{ color: "#f43f5e" }}>
                    Stillbirth: <span className="font-mono tabular-nums">{(d.stillbirthPer1000x10 / 10).toFixed(2)}</span> per 1,000
                  </p>
                </div>
              );
            }}
          />

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 16, fontSize: 11 }}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="amnioticFluidPercentPeak"
            stroke={COLORS.fluid}
            strokeWidth={2.5}
            dot={{ fill: COLORS.fluid, r: 3 }}
            name="Amniotic Fluid (% peak)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="meconiumStainedFluidPercent"
            stroke={COLORS.meconium}
            strokeWidth={2.5}
            dot={{ fill: COLORS.meconium, r: 3 }}
            name="Meconium Staining (%)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="macrosomiaOver4000gPercent"
            stroke={COLORS.macrosomia}
            strokeWidth={2.5}
            dot={{ fill: COLORS.macrosomia, r: 3 }}
            name="Macrosomia >4000g (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="stillbirthPer1000x10"
            stroke={COLORS.stillbirth}
            strokeWidth={2.5}
            dot={{ fill: "#f43f5e", r: 3 }}
            name="Stillbirth (per 1k, x10)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
