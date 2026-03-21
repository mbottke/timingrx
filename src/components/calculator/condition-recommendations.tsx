"use client";

import Link from "next/link";
import { getConditionsForFactors } from "@/lib/utils/condition-factor-mapping";
import { GAWindowBadge } from "@/components/condition/ga-window-badge";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConditionRecommendationsProps {
  activeFactorIds: string[];
}

export function ConditionRecommendations({
  activeFactorIds,
}: ConditionRecommendationsProps) {
  const conditions = getConditionsForFactors(activeFactorIds);

  if (conditions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Relevant Condition Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditions.map((condition) => {
          const primaryRec = condition.guidelineRecommendations[0];
          return (
            <div
              key={condition.id}
              className="rounded-lg border p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/conditions/${condition.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {condition.name}
                </Link>
                <div className="flex items-center gap-1.5">
                  {primaryRec && (
                    <>
                      <GAWindowBadge timing={primaryRec.timing} />
                      <EvidenceGradeBadge grade={primaryRec.grade} />
                    </>
                  )}
                </div>
              </div>
              {condition.clinicalNotes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {condition.clinicalNotes}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
