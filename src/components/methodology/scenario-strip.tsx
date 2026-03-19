"use client";

import { cn } from "@/lib/utils";
import { useMethodology } from "./methodology-provider";
import { methodologyScenarios } from "@/data/methodology/scenarios";

// ── ScenarioStrip ─────────────────────────────────────────────────────────────

export function ScenarioStrip() {
  const { loadScenario, activeFactorIds, applyInteractions } = useMethodology();

  // Determine which scenario is currently active by matching factor IDs and interactions
  const activeScenarioId = methodologyScenarios.find((s) => {
    if (s.applyInteractions !== applyInteractions) return false;
    if (s.activeFactorIds.length !== activeFactorIds.length) return false;
    return s.activeFactorIds.every((id) => activeFactorIds.includes(id));
  })?.id ?? null;

  return (
    <div className="flex flex-wrap gap-2">
      {methodologyScenarios.map((scenario) => {
        const isActive = scenario.id === activeScenarioId;
        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => loadScenario(scenario.id)}
            title={scenario.description}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 bg-muted text-muted-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-foreground"
            )}
          >
            {scenario.label}
            <span
              className={cn(
                "ml-1.5 rounded px-1 py-0.5 text-[10px] font-bold",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted-foreground/10"
              )}
            >
              {scenario.expectedGrade}
            </span>
          </button>
        );
      })}
    </div>
  );
}
