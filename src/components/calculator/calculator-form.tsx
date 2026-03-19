"use client";

import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";
import type { CalculatorState } from "@/lib/hooks/use-calculator";
import { gaToDisplay } from "@/lib/utils/ga-format";
import { w } from "@/data/helpers";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

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
      {/* GA Slider */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Gestational Age</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-2xl font-bold font-mono">
                {gaToDisplay(state.ga)}
              </span>
            </div>
            <Slider
              value={[state.ga]}
              onValueChange={(v) => setGA(Array.isArray(v) ? v[0] : v)}
              min={w(37)}
              max={w(42)}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>37w0d</span>
              <span>39w0d</span>
              <span>41w0d</span>
              <span>42w0d</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    className={`w-full flex items-center justify-between rounded-md border p-2 text-left text-xs transition-colors ${
                      isActive
                        ? "border-[var(--risk-high)] bg-[var(--risk-high)]/5"
                        : "border-transparent hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-medium ${isActive ? "text-[var(--risk-high)]" : ""}`}
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
                      <span className="text-muted-foreground truncate">
                        {factor.description}
                      </span>
                    </div>
                    <span className="font-mono text-xs ml-2 whitespace-nowrap">
                      {isActive ? `×${factor.multiplier}` : ""}
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
