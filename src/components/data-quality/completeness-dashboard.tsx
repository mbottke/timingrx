"use client";

import { useMemo } from "react";
import { allConditions } from "@/data/conditions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvidenceStrength } from "@/data/types";

interface MetricCard {
  label: string;
  count: number;
  total: number;
  color: string; // Tailwind color class stem, e.g. "emerald"
}

const EVIDENCE_GRADE_CONFIG: Record<
  EvidenceStrength,
  { label: string; color: string }
> = {
  high: { label: "High", color: "emerald" },
  moderate: { label: "Moderate", color: "blue" },
  low: { label: "Low", color: "amber" },
  very_low: { label: "Very Low", color: "muted" },
  expert_consensus: { label: "Expert Consensus", color: "muted" },
};

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    muted: "bg-muted-foreground/50",
    primary: "bg-primary",
  };
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-muted">
      <div
        className={`h-2 rounded-full transition-all ${bgMap[color] ?? "bg-primary"}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function StatCard({ label, count, total, color }: MetricCard) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">
          {count}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {total} ({pct}%)
          </span>
        </p>
        <ProgressBar pct={pct} color={color} />
      </CardContent>
    </Card>
  );
}

export function CompletenessDashboard() {
  const metrics = useMemo(() => {
    const total = allConditions.length;

    const withGuidelines = allConditions.filter(
      (c) => c.guidelineRecommendations.length > 0
    ).length;

    const withRiskData = allConditions.filter(
      (c) => c.riskData.length > 0
    ).length;

    const withTrials = allConditions.filter(
      (c) => c.landmarkTrials.length > 0
    ).length;

    const withEvidenceSources = allConditions.filter(
      (c) => c.keyEvidenceSources.length > 0
    ).length;

    const withClinicalNotes = allConditions.filter(
      (c) => !!c.clinicalNotes
    ).length;

    const withInteractions = allConditions.filter(
      (c) => c.interactions.length > 0
    ).length;

    const withRiskModifiers = allConditions.filter(
      (c) => c.riskModifiers.length > 0
    ).length;

    // Evidence strength breakdown: count conditions by their strongest (first) recommendation grade
    const strengthCounts: Record<EvidenceStrength, number> = {
      high: 0,
      moderate: 0,
      low: 0,
      very_low: 0,
      expert_consensus: 0,
    };

    for (const c of allConditions) {
      const grade = c.guidelineRecommendations[0]?.grade?.strength;
      if (grade && grade in strengthCounts) {
        strengthCounts[grade]++;
      }
    }

    return {
      total,
      withGuidelines,
      withRiskData,
      withTrials,
      withEvidenceSources,
      withClinicalNotes,
      withInteractions,
      withRiskModifiers,
      strengthCounts,
    };
  }, []);

  const completenessCards: MetricCard[] = [
    {
      label: "Guideline Recommendations",
      count: metrics.withGuidelines,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Risk Data",
      count: metrics.withRiskData,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Landmark Trials",
      count: metrics.withTrials,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Key Evidence Sources",
      count: metrics.withEvidenceSources,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Clinical Notes",
      count: metrics.withClinicalNotes,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Condition Interactions",
      count: metrics.withInteractions,
      total: metrics.total,
      color: "primary",
    },
    {
      label: "Risk Modifiers",
      count: metrics.withRiskModifiers,
      total: metrics.total,
      color: "primary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="mb-3 text-lg font-medium">
          Completeness ({metrics.total} conditions)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completenessCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Evidence strength distribution */}
      <section>
        <h2 className="mb-3 text-lg font-medium">
          Evidence Strength Distribution
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(EVIDENCE_GRADE_CONFIG) as EvidenceStrength[]).map(
            (strength) => {
              const cfg = EVIDENCE_GRADE_CONFIG[strength];
              return (
                <StatCard
                  key={strength}
                  label={cfg.label}
                  count={metrics.strengthCounts[strength]}
                  total={metrics.total}
                  color={cfg.color}
                />
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
