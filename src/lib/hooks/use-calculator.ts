"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateRisk,
  calculateRiskCurve,
} from "@/lib/calculator/risk-engine";
import { w } from "@/data/helpers";
import type { GestationalAgeDays, RiskCalculation } from "@/data/types";

export interface CalculatorState {
  ga: GestationalAgeDays;
  activeFactorIds: string[];
  applyInteractions: boolean;
  selectedConditionIds: string[];
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    ga: w(39),
    activeFactorIds: [],
    applyInteractions: false,
    selectedConditionIds: [],
  });

  const setGA = useCallback((ga: GestationalAgeDays) => {
    setState((s) => ({ ...s, ga }));
  }, []);

  const toggleFactor = useCallback((factorId: string) => {
    setState((s) => ({
      ...s,
      activeFactorIds: s.activeFactorIds.includes(factorId)
        ? s.activeFactorIds.filter((id) => id !== factorId)
        : [...s.activeFactorIds, factorId],
    }));
  }, []);

  const setApplyInteractions = useCallback((apply: boolean) => {
    setState((s) => ({ ...s, applyInteractions: apply }));
  }, []);

  const setFactors = useCallback((ids: string[]) => {
    setState((s) => ({
      ...s,
      activeFactorIds: ids,
      applyInteractions: ids.length >= 2,
    }));
  }, []);

  const toggleCondition = useCallback((conditionId: string) => {
    setState((s) => ({
      ...s,
      selectedConditionIds: s.selectedConditionIds.includes(conditionId)
        ? s.selectedConditionIds.filter((id) => id !== conditionId)
        : [...s.selectedConditionIds, conditionId],
    }));
  }, []);

  const currentRisk = useMemo<RiskCalculation>(
    () =>
      calculateRisk({
        ga: state.ga,
        activeFactorIds: state.activeFactorIds,
        applyInteractions: state.applyInteractions,
      }),
    [state.ga, state.activeFactorIds, state.applyInteractions]
  );

  const riskCurve = useMemo<RiskCalculation[]>(
    () =>
      calculateRiskCurve({
        activeFactorIds: state.activeFactorIds,
        applyInteractions: state.applyInteractions,
      }),
    [state.activeFactorIds, state.applyInteractions]
  );

  return {
    state,
    setGA,
    toggleFactor,
    setFactors,
    setApplyInteractions,
    toggleCondition,
    currentRisk,
    riskCurve,
  };
}
