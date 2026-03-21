"use client";

import type { DivergenceResult } from "@/lib/utils/guideline-divergence";
import { gaToDisplay } from "@/lib/utils/ga-format";

export function DivergenceIndicator({ result }: { result: DivergenceResult }) {
  if (!result.hasDivergence || !result.divergenceGA) return null;

  const globalEarliest = Math.min(...result.divergenceGA.map((r) => r.earliest));
  const globalLatest = Math.max(...result.divergenceGA.map((r) => r.latest));
  const span = globalLatest - globalEarliest;

  if (span === 0) return null;

  const divergenceWeeks = (result.maxDivergenceDays / 7).toFixed(1);

  // Bar colors for each guideline body
  const bodyColors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-orange-500",
  ];

  return (
    <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 dark:border-amber-700/50 dark:bg-amber-950/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-5 items-center rounded-full bg-amber-200 px-2 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-800 dark:text-amber-100">
          Divergent
        </span>
        <span className="text-xs text-amber-800 dark:text-amber-200">
          Guidelines diverge by ~{divergenceWeeks} weeks
        </span>
      </div>

      {/* Divergence bar */}
      <div className="relative h-4 rounded-full bg-amber-100 dark:bg-amber-900/40 overflow-hidden">
        {result.divergenceGA.map((range, i) => {
          const left = ((range.earliest - globalEarliest) / span) * 100;
          const width = ((range.latest - range.earliest) / span) * 100;
          return (
            <div
              key={range.body}
              className={`absolute top-0 h-full rounded-full opacity-70 ${bodyColors[i % bodyColors.length]}`}
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 2)}%`,
              }}
              title={`${range.body}: ${gaToDisplay(range.earliest)} – ${gaToDisplay(range.latest)}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {result.divergenceGA.map((range, i) => (
          <span key={range.body} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span
              className={`inline-block h-2 w-2 rounded-full ${bodyColors[i % bodyColors.length]}`}
            />
            {range.body}: {gaToDisplay(range.earliest)} &ndash; {gaToDisplay(range.latest)}
          </span>
        ))}
      </div>
    </div>
  );
}
