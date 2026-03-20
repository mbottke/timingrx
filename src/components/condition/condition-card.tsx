import Link from "next/link";
import type { ObstetricCondition } from "@/data/types";
import { CATEGORY_DISPLAY_NAMES } from "@/data/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GAWindowBadge } from "./ga-window-badge";
import { EvidenceGradeBadge } from "./evidence-grade-badge";

const pastFortyLabels: Record<string, { text: string; className: string }> = {
  yes: { text: "Can go past 40w", className: "bg-[var(--ga-safe)] text-white" },
  no: { text: "No past 40w", className: "bg-[var(--ga-danger)] text-white" },
  borderline: { text: "Borderline", className: "bg-[var(--ga-caution)] text-black" },
  case_by_case: { text: "Case-by-case", className: "bg-muted text-muted-foreground" },
};

export function ConditionCard({
  condition,
}: {
  condition: ObstetricCondition;
}) {
  const primaryRec = condition.guidelineRecommendations[0];
  const p40 = pastFortyLabels[condition.pastFortyWeeks];

  return (
    <Link href={`/conditions/${condition.id}`}>
      <Card className="white-glow h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">
              {condition.name}
            </CardTitle>
            {primaryRec && (
              <div className="shrink-0">
                <GAWindowBadge timing={primaryRec.timing} />
              </div>
            )}
          </div>
          <CardDescription className="text-xs line-clamp-2">
            {condition.clinicalNotes ?? CATEGORY_DISPLAY_NAMES[condition.category]}
          </CardDescription>
          <div className="flex flex-wrap items-center gap-1.5">
            {primaryRec && (
              <EvidenceGradeBadge grade={primaryRec.grade} />
            )}
            <Badge className={`text-[11px] ${p40.className}`}>
              {p40.text}
            </Badge>
            {condition.guidelineRecommendations.length > 1 && (
              <Badge variant="outline" className="text-[11px]">
                {condition.guidelineRecommendations.length} guidelines
              </Badge>
            )}
          </div>
          {(condition.riskData.length > 0 ||
            condition.landmarkTrials.length > 0 ||
            condition.keyEvidenceSources.length > 0) && (
            <p className="text-[11px] text-muted-foreground/70 pt-1">
              {[
                condition.riskData.length > 0 &&
                  `${condition.riskData.length} risk outcome${condition.riskData.length !== 1 ? "s" : ""}`,
                condition.landmarkTrials.length > 0 &&
                  `${condition.landmarkTrials.length} trial${condition.landmarkTrials.length !== 1 ? "s" : ""}`,
                condition.keyEvidenceSources.length > 0 &&
                  `${condition.keyEvidenceSources.length} evidence source${condition.keyEvidenceSources.length !== 1 ? "s" : ""}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
