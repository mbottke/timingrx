"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { GestationalAgeDays, RiskCalculation } from "@/data/types";
import { w } from "@/data/helpers";
import { calculateRisk, calculateRiskCurve } from "@/lib/calculator/risk-engine";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import { hypothesizedInteractions } from "@/data/risk-models/hypothesized-interactions";
import { getFactorColor } from "@/data/methodology/factor-colors";
import {
  methodologyScenarios,
  type MethodologyScenario,
} from "@/data/methodology/scenarios";

// ── StepBreakdown ─────────────────────────────────────────────────────────────

export interface StepBreakdown {
  factorId: string;
  label: string;
  multiplier: number;
  riskBefore: number;
  riskAfter: number;
  color: string;
  isInteraction?: boolean;
}

// ── State ────────────────────────────────────────────────────────────────────

interface MethodologyState {
  ga: GestationalAgeDays;
  activeFactorIds: string[];
  applyInteractions: boolean;
}

const DEFAULT_STATE: MethodologyState = {
  ga: w(39),
  activeFactorIds: [],
  applyInteractions: false,
};

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_GA"; ga: GestationalAgeDays }
  | { type: "TOGGLE_FACTOR"; factorId: string }
  | { type: "SET_APPLY_INTERACTIONS"; value: boolean }
  | { type: "LOAD_SCENARIO"; scenario: MethodologyScenario }
  | { type: "RESET" };

function reducer(state: MethodologyState, action: Action): MethodologyState {
  switch (action.type) {
    case "SET_GA":
      return { ...state, ga: action.ga };
    case "TOGGLE_FACTOR": {
      const exists = state.activeFactorIds.includes(action.factorId);
      return {
        ...state,
        activeFactorIds: exists
          ? state.activeFactorIds.filter((id) => id !== action.factorId)
          : [...state.activeFactorIds, action.factorId],
      };
    }
    case "SET_APPLY_INTERACTIONS":
      return { ...state, applyInteractions: action.value };
    case "LOAD_SCENARIO":
      return {
        ...state,
        activeFactorIds: action.scenario.activeFactorIds,
        applyInteractions: action.scenario.applyInteractions,
      };
    case "RESET":
      return DEFAULT_STATE;
    default:
      return state;
  }
}

// ── Context value type ────────────────────────────────────────────────────────

interface MethodologyContextValue extends MethodologyState {
  // Actions
  setGA: (ga: GestationalAgeDays) => void;
  toggleFactor: (factorId: string) => void;
  setApplyInteractions: (value: boolean) => void;
  loadScenario: (scenarioId: string) => void;
  reset: () => void;

  // Derived
  riskCurve: RiskCalculation[];
  selectedGaCalculation: RiskCalculation;
  stepByStepBreakdown: StepBreakdown[];
}

// ── Context ───────────────────────────────────────────────────────────────────

const MethodologyContext = createContext<MethodologyContextValue | null>(null);

// ── Factor lookup map ─────────────────────────────────────────────────────────

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

// ── Provider ──────────────────────────────────────────────────────────────────

export function MethodologyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  const setGA = useCallback((ga: GestationalAgeDays) => {
    dispatch({ type: "SET_GA", ga });
  }, []);

  const toggleFactor = useCallback((factorId: string) => {
    dispatch({ type: "TOGGLE_FACTOR", factorId });
  }, []);

  const setApplyInteractions = useCallback((value: boolean) => {
    dispatch({ type: "SET_APPLY_INTERACTIONS", value });
  }, []);

  const loadScenario = useCallback((scenarioId: string) => {
    const scenario = methodologyScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      dispatch({ type: "LOAD_SCENARIO", scenario });
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Derived: full 37-42w risk curve
  const riskCurve = useMemo(
    () =>
      calculateRiskCurve({
        activeFactorIds: state.activeFactorIds,
        applyInteractions: state.applyInteractions,
      }),
    [state.activeFactorIds, state.applyInteractions]
  );

  // Derived: risk at the selected GA
  const selectedGaCalculation = useMemo(
    () =>
      calculateRisk({
        ga: state.ga,
        activeFactorIds: state.activeFactorIds,
        applyInteractions: state.applyInteractions,
      }),
    [state.ga, state.activeFactorIds, state.applyInteractions]
  );

  // Derived: cascading step-by-step breakdown
  const stepByStepBreakdown = useMemo((): StepBreakdown[] => {
    const baseline = selectedGaCalculation.baselineRiskPer1000;
    const steps: StepBreakdown[] = [];
    let cumulativeRisk = baseline;

    for (const factorId of state.activeFactorIds) {
      const factor = factorMap.get(factorId);
      if (!factor) continue;

      const riskBefore = cumulativeRisk;
      const riskAfter = cumulativeRisk * factor.multiplier;
      cumulativeRisk = riskAfter;

      steps.push({
        factorId,
        label: factor.label,
        multiplier: factor.multiplier,
        riskBefore,
        riskAfter,
        color: getFactorColor(factorId).hex,
        isInteraction: false,
      });
    }

    // Apply interactions when enabled
    if (state.applyInteractions) {
      const activeIdSet = new Set(state.activeFactorIds);
      for (const interaction of hypothesizedInteractions) {
        const [idA, idB] = interaction.factorIds;
        if (activeIdSet.has(idA) && activeIdSet.has(idB)) {
          const riskBefore = cumulativeRisk;
          const riskAfter = cumulativeRisk * interaction.interactionMultiplier;
          cumulativeRisk = riskAfter;

          // Use color of the first factor in the pair
          const color = getFactorColor(idA).hex;

          steps.push({
            factorId: `interaction_${idA}_${idB}`,
            label: `Interaction: ${factorMap.get(idA)?.label ?? idA} + ${factorMap.get(idB)?.label ?? idB}`,
            multiplier: interaction.interactionMultiplier,
            riskBefore,
            riskAfter,
            color,
            isInteraction: true,
          });
        }
      }
    }

    return steps;
  }, [selectedGaCalculation, state.activeFactorIds, state.applyInteractions]);

  const value: MethodologyContextValue = {
    ...state,
    setGA,
    toggleFactor,
    setApplyInteractions,
    loadScenario,
    reset,
    riskCurve,
    selectedGaCalculation,
    stepByStepBreakdown,
  };

  return (
    <MethodologyContext.Provider value={value}>
      {children}
    </MethodologyContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMethodology(): MethodologyContextValue {
  const ctx = useContext(MethodologyContext);
  if (!ctx) {
    throw new Error("useMethodology must be used within a MethodologyProvider");
  }
  return ctx;
}
