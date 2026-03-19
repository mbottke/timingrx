"use client";

import { useMethodology } from "./methodology-provider";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { getFactorColor } from "@/data/methodology/factor-colors";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { w } from "@/data/helpers";
import { Switch } from "@/components/ui/switch";
import type { GestationalAgeDays } from "@/data/types";

const GA_MIN = w(37);
const GA_MAX = w(42);
const GA_STEP = 7; // 1 week

export function FactorToolbar() {
  const {
    ga,
    setGA,
    activeFactorIds,
    toggleFactor,
    applyInteractions,
    setApplyInteractions,
    reset,
  } = useMethodology();

  function handleDecrement() {
    const next = (ga - GA_STEP) as GestationalAgeDays;
    if (next >= GA_MIN) setGA(next);
  }

  function handleIncrement() {
    const next = (ga + GA_STEP) as GestationalAgeDays;
    if (next <= GA_MAX) setGA(next);
  }

  return (
    <div className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        {/* GA selector */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground mr-1">GA</span>
          <button
            onClick={handleDecrement}
            disabled={ga <= GA_MIN}
            aria-label="Decrease gestational age by one week"
            className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[4.5rem] text-center text-sm font-mono font-semibold tabular-nums">
            {gaToDisplay(ga)}
          </span>
          <button
            onClick={handleIncrement}
            disabled={ga >= GA_MAX}
            aria-label="Increase gestational age by one week"
            className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            +
          </button>
        </div>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

        {/* Factor toggle pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {riskFactorMultipliers.map((factor) => {
            const isActive = activeFactorIds.includes(factor.id);
            const color = getFactorColor(factor.id);
            return (
              <button
                key={factor.id}
                onClick={() => toggleFactor(factor.id)}
                aria-pressed={isActive}
                className={[
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  isActive
                    ? `${color.bgClass} border-transparent text-white`
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span>{factor.label}</span>
                <span
                  className={[
                    "tabular-nums",
                    isActive ? "text-white/80" : "text-muted-foreground/70",
                  ].join(" ")}
                >
                  ×{factor.multiplier}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

        {/* Apply Interactions toggle */}
        <label className="flex cursor-pointer items-center gap-2">
          <Switch
            checked={applyInteractions}
            onCheckedChange={setApplyInteractions}
            size="sm"
            aria-label="Apply interactions"
          />
          <span className="text-xs font-medium text-foreground">
            Apply Interactions
          </span>
        </label>

        {/* Reset button */}
        <button
          onClick={reset}
          aria-label="Reset all methodology controls to defaults"
          className="ml-auto inline-flex h-6 items-center rounded border border-border bg-background px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
