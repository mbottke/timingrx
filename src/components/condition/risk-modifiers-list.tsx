"use client";

import type { RiskModifier, RiskModifierFactor } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { formatRiskStatistic, generateTeachingInterpretation } from "@/lib/utils/risk-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FACTOR_LABELS: Record<RiskModifierFactor, string> = {
  maternal_age: "Age",
  bmi: "BMI",
  parity: "Parity",
  prior_stillbirth: "Prior Stillbirth",
  prior_preterm_birth: "Prior Preterm",
  prior_cesarean_count: "Prior Cesarean",
  race_ethnicity: "Ethnicity",
  ivf_conception: "IVF",
  multiple_gestation: "Multiples",
  fetal_sex: "Fetal Sex",
  gestational_age_at_diagnosis: "GA at Dx",
  disease_severity: "Severity",
  medication_control_status: "Med Control",
  comorbidity_count: "Comorbidities",
  smoking: "Smoking",
  other: "Other",
};

export function RiskModifiersList({ modifiers }: { modifiers: RiskModifier[] }) {
  const { teachingMode, teachingExpanded } = useTeachingMode();

  if (modifiers.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-[var(--risk-moderate)]">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Risk Modifiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {modifiers.map((mod, i) => (
            <li key={i}>
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-[11px] uppercase font-semibold bg-muted-foreground/80 text-background px-1.5 py-0.5 rounded-[3px]">
                  {FACTOR_LABELS[mod.factor]}
                </span>
                <span className="text-sm leading-relaxed">
                  {mod.effect}
                  {mod.riskData && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-mono">
                      ({formatRiskStatistic(mod.riskData.statistic)})
                    </span>
                  )}
                </span>
              </div>
              {teachingMode && teachingExpanded && (
                <div className="mt-1.5 ml-[calc(0.375rem+1.5rem)] border-l-[3px] border-primary/30 pl-3 text-sm italic text-primary">
                  → Clinical mechanism: {mod.effect}
                  {mod.riskData &&
                    ` ${generateTeachingInterpretation(mod.riskData.statistic, mod.riskData.populationDescription)}`}
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
