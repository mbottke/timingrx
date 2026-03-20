"use client";

import Link from "next/link";
import type { ConditionInteraction } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { GAWindowBadge } from "./ga-window-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INTERACTION_LABELS: Record<ConditionInteraction["interactionType"], string> = {
  additive_risk: "Additive Risk",
  timing_shift: "Timing Shift",
  route_change: "Route Change",
  monitoring_change: "Monitoring Change",
};

export function ConditionInteractions({
  interactions,
}: {
  interactions: ConditionInteraction[];
}) {
  const { teachingMode, teachingExpanded } = useTeachingMode();

  if (interactions.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-[var(--ga-caution)]">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Interactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {interactions.map((ix, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge className="text-[11px] uppercase bg-[var(--ga-caution)]/20 text-foreground border-border">
                {INTERACTION_LABELS[ix.interactionType]}
              </Badge>
              <Link
                href={`/conditions/${ix.interactingConditionId}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {ix.interactingConditionId}
              </Link>
            </div>
            <p className="text-sm leading-relaxed">{ix.description}</p>
            {ix.combinedTimingGuidance && (
              <div className="mt-2">
                <GAWindowBadge timing={ix.combinedTimingGuidance} />
              </div>
            )}
            {teachingMode && teachingExpanded && (
              <div className="mt-2 border-l-[3px] border-primary/30 pl-3 text-sm italic text-primary">
                → This interaction affects delivery planning. {ix.description}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
