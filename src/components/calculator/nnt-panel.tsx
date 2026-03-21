"use client";

import { useMemo } from "react";
import type { GestationalAgeDays } from "@/data/types";
import { calculateNNT } from "@/lib/calculator/nnt-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NNTPanelProps {
  ga: GestationalAgeDays;
  combinedMultiplier: number;
}

/** Trial benchmark markers for the context bar */
const BENCHMARKS = [
  { label: "ARRIVE", nnt: 28, color: "var(--chart-baseline)" },
  { label: "Alkmark", nnt: 79, color: "var(--evidence-moderate)" },
  { label: "SWEPIS", nnt: 230, color: "var(--chart-adjusted)" },
  { label: "Cochrane", nnt: 544, color: "var(--ga-caution)" },
] as const;

/** Map a value onto a 0-100% log scale between min and max */
function logPosition(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  if (value >= max) return 100;
  return (
    ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100
  );
}

export function NNTPanel({ ga, combinedMultiplier }: NNTPanelProps) {
  const result = useMemo(
    () => calculateNNT(ga, combinedMultiplier),
    [ga, combinedMultiplier]
  );

  const isInfinite = !isFinite(result.nntOneWeek);

  // Log-scale range: 10 to 1000
  const LOG_MIN = 10;
  const LOG_MAX = 1000;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Numbers Needed to Treat (NNT)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {isInfinite ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            At this GA, delivery risk exceeds waiting risk — NNT is not
            meaningful.
          </div>
        ) : (
          <>
            {/* Primary NNT display */}
            <div className="text-center space-y-1">
              <span className="font-mono text-3xl font-bold tabular-nums">
                {result.nntOneWeek.toLocaleString()}
              </span>
              <p className="text-xs text-muted-foreground">
                inductions to prevent 1 stillbirth (vs. waiting 1 week)
              </p>
            </div>

            {/* Risk comparison row */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="text-center flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  Risk if waiting
                </div>
                <span className="font-mono text-sm font-medium text-[var(--risk-high)]">
                  {result.riskIfWaiting.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  per 1,000
                </span>
              </div>
              <div className="text-muted-foreground text-xs px-2">vs.</div>
              <div className="text-center flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  Risk if delivering
                </div>
                <span className="font-mono text-sm font-medium">
                  {result.riskIfDelivering.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  per 1,000
                </span>
              </div>
            </div>

            {/* Context bar — log-scale comparison */}
            <div className="border-t pt-3 space-y-2">
              <div className="text-xs text-muted-foreground font-medium">
                Trial context (log scale)
              </div>
              <div className="relative h-8 rounded-full bg-muted">
                {/* Benchmark markers */}
                {BENCHMARKS.map((b) => {
                  const pos = logPosition(b.nnt, LOG_MIN, LOG_MAX);
                  return (
                    <div
                      key={b.label}
                      className="absolute top-0 h-full flex flex-col items-center"
                      style={{ left: `${pos}%` }}
                    >
                      <div
                        className="w-0.5 h-full"
                        style={{ backgroundColor: b.color }}
                      />
                    </div>
                  );
                })}
                {/* Current NNT marker */}
                {result.nntOneWeek >= LOG_MIN &&
                  result.nntOneWeek <= LOG_MAX && (
                    <div
                      className="absolute top-0 h-full flex items-center"
                      style={{
                        left: `${logPosition(result.nntOneWeek, LOG_MIN, LOG_MAX)}%`,
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground border-2 border-background -ml-[5px]" />
                    </div>
                  )}
              </div>
              {/* Labels below the bar */}
              <div className="relative h-4">
                {BENCHMARKS.map((b) => {
                  const pos = logPosition(b.nnt, LOG_MIN, LOG_MAX);
                  return (
                    <span
                      key={b.label}
                      className="absolute text-[10px] text-muted-foreground -translate-x-1/2 whitespace-nowrap"
                      style={{ left: `${pos}%` }}
                    >
                      {b.label} ({b.nnt})
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
