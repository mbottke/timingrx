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
    <Card className="bg-[#fef9ee] border-[#f0e4c4]">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight text-[#92610a]">
          Interactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {interactions.map((ix, i) => (
          <div key={i} className="border border-[#f0e4c4] rounded-lg p-3 bg-white/60">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge className="text-[10px] uppercase bg-[#92610a]/20 text-[#92610a] border-[#f0e4c4]">
                {INTERACTION_LABELS[ix.interactionType]}
              </Badge>
              <Link
                href={`/conditions/${ix.interactingConditionId}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {ix.interactingConditionId}
              </Link>
            </div>
            <p className="text-sm">{ix.description}</p>
            {ix.combinedTimingGuidance && (
              <div className="mt-2">
                <GAWindowBadge timing={ix.combinedTimingGuidance} />
              </div>
            )}
            {teachingMode && teachingExpanded && (
              <div className="mt-2 border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
                → This interaction affects delivery planning. {ix.description}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
