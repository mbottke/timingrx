"use client";

import { useState, useMemo, useCallback } from "react";
import { calculateRiskCurve } from "@/lib/calculator/risk-engine";
import type { RiskCalculation } from "@/data/types";

export interface Scenario {
  id: string;
  name: string;
  factorIds: string[];
  applyInteractions: boolean;
  color: string;
}

const SCENARIO_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

export function useScenarioCompare() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: "1", name: "Scenario A", factorIds: [], applyInteractions: false, color: SCENARIO_COLORS[0] },
  ]);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 4) return;
    const idx = scenarios.length;
    setScenarios((s) => [
      ...s,
      {
        id: String(idx + 1),
        name: `Scenario ${String.fromCharCode(65 + idx)}`,
        factorIds: [],
        applyInteractions: false,
        color: SCENARIO_COLORS[idx % SCENARIO_COLORS.length],
      },
    ]);
  }, [scenarios.length]);

  const removeScenario = useCallback((id: string) => {
    setScenarios((s) => s.filter((sc) => sc.id !== id));
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<Omit<Scenario, "id" | "color">>) => {
    setScenarios((s) =>
      s.map((sc) => (sc.id === id ? { ...sc, ...updates } : sc))
    );
  }, []);

  const toggleFactor = useCallback((scenarioId: string, factorId: string) => {
    setScenarios((s) =>
      s.map((sc) => {
        if (sc.id !== scenarioId) return sc;
        const has = sc.factorIds.includes(factorId);
        return {
          ...sc,
          factorIds: has
            ? sc.factorIds.filter((f) => f !== factorId)
            : [...sc.factorIds, factorId],
        };
      })
    );
  }, []);

  const curves = useMemo<Map<string, RiskCalculation[]>>(() => {
    const map = new Map<string, RiskCalculation[]>();
    for (const sc of scenarios) {
      map.set(
        sc.id,
        calculateRiskCurve({
          activeFactorIds: sc.factorIds,
          applyInteractions: sc.applyInteractions,
        })
      );
    }
    return map;
  }, [scenarios]);

  return { scenarios, addScenario, removeScenario, updateScenario, toggleFactor, curves };
}
