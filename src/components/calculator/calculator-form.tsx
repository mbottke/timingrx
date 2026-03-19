"use client";

import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import type { CalculatorState } from "@/lib/hooks/use-calculator";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GAEntry } from "@/components/calculator/ga-entry";
import { CheckIcon } from "lucide-react";

interface Props {
  state: CalculatorState;
  setGA: (ga: number) => void;
  toggleFactor: (id: string) => void;
  setApplyInteractions: (apply: boolean) => void;
}

const categoryLabels: Record<string, string> = {
  maternal: "Maternal Factors",
  fetal: "Fetal Factors",
  obstetric_history: "Obstetric History",
  social_determinant: "Social Determinants",
};

const categoryOrder = [
  "maternal",
  "fetal",
  "obstetric_history",
  "social_determinant",
] as const;

export function CalculatorForm({
  state,
  setGA,
  toggleFactor,
  setApplyInteractions,
}: Props) {
  const factorsByCategory = new Map<string, typeof riskFactorMultipliers>();
  for (const f of riskFactorMultipliers) {
    const existing = factorsByCategory.get(f.category) ?? [];
    existing.push(f);
    factorsByCategory.set(f.category, existing);
  }

  return (
    <div className="space-y-4">
      {/* GA Entry — multiple methods */}
      <GAEntry currentGA={state.ga} onGAChange={setGA} />

      {/* Risk Factors by Category */}
      {categoryOrder.map((cat) => {
        const factors = factorsByCategory.get(cat);
        if (!factors) return null;
        return (
          <Card key={cat}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {categoryLabels[cat]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {factors.map((factor) => {
                const isActive = state.activeFactorIds.includes(factor.id);
                return (
                  <button
                    key={factor.id}
                    onClick={() => toggleFactor(factor.id)}
                    className={`w-full flex items-center justify-between rounded-md border border-l-2 p-2 text-left transition-all ${
                      isActive
                        ? "border-[var(--risk-high)] border-l-[var(--risk-high)] bg-[var(--risk-high)]/5 shadow-sm"
                        : "border-border border-l-primary/30 hover:bg-accent/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isActive && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-[var(--risk-high)]" />
                      )}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-semibold ${isActive ? "text-[var(--risk-high)]" : ""}`}
                          >
                            {factor.label}
                          </span>
                          <EvidenceGradeBadge grade={factor.evidenceGrade} />
                          {factor.isHypothesized && (
                            <Badge
                              variant="outline"
                              className="text-[8px] px-1"
                            >
                              Est.
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {factor.description}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs ml-2 whitespace-nowrap ${
                        isActive
                          ? "font-bold text-[var(--risk-high)]"
                          : "text-muted-foreground"
                      }`}
                    >
                      {`×${factor.multiplier}`}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Interaction Toggle */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Apply Interaction Adjustments</p>
              <p className="text-xs text-muted-foreground">
                Hypothesized corrections for shared pathophysiology
              </p>
            </div>
            <Switch
              checked={state.applyInteractions}
              onCheckedChange={setApplyInteractions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
