"use client";

import type { ObstetricCondition } from "@/data/types";
import { CATEGORY_DISPLAY_NAMES } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { GAWindowBadge } from "./ga-window-badge";
import { EvidenceGradeBadge } from "./evidence-grade-badge";
import { formatCitations } from "@/lib/utils/citation-format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const routeLabels: Record<string, string> = {
  vaginal_preferred: "Vaginal preferred",
  cesarean_preferred: "Cesarean preferred",
  cesarean_required: "Cesarean required",
  either: "Vaginal or Cesarean",
  individualize: "Individualize",
};

const specialIcons: Record<string, string> = {
  anticoagulation_bridging: "💉",
  medication_adjustment: "💊",
  anesthesia_consideration: "🫁",
  monitoring_requirement: "📊",
  contraindication: "⛔",
  neonatal_consideration: "👶",
  postpartum_management: "🏥",
  surgical_planning: "🔪",
  imaging_surveillance: "📸",
  medication_continuation: "💊",
  delivery_site_requirement: "🏨",
  other: "ℹ️",
};

export function ConditionDetail({
  condition,
}: {
  condition: ObstetricCondition;
}) {
  const { teachingMode } = useTeachingMode();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>{CATEGORY_DISPLAY_NAMES[condition.category]}</span>
          {condition.parentConditionId && (
            <>
              <span>/</span>
              <span>Sub-variant</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {condition.name}
        </h1>
        {condition.stratificationAxis && (
          <p className="mt-1 text-sm text-muted-foreground">
            Stratified by: {condition.stratificationAxis}
          </p>
        )}
      </div>

      {/* Guideline Recommendations */}
      {condition.guidelineRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Delivery Timing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {condition.guidelineRecommendations.map((rec, i) => (
              <div
                key={i}
                className={`flex flex-col gap-2 ${
                  i > 0 ? "border-t pt-4" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <GAWindowBadge timing={rec.timing} />
                  <Badge variant="outline" className="text-xs">
                    {routeLabels[rec.route]}
                  </Badge>
                  <EvidenceGradeBadge grade={rec.grade} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCitations(rec.citations)}
                </p>
                {rec.notes && (
                  <p className="text-sm text-muted-foreground">{rec.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      {condition.clinicalNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{condition.clinicalNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Physiology (Teaching Mode) */}
      {teachingMode && condition.physiologyExplanation && (
        <Card className="border-[var(--evidence-moderate)]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-xs bg-[var(--evidence-moderate)] text-white px-1.5 py-0.5 rounded">
                TEACHING
              </span>
              Pathophysiology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {condition.physiologyExplanation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Special Considerations */}
      {condition.specialConsiderations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Special Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {condition.specialConsiderations.map((sc, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-sm">
                  {specialIcons[sc.type] ?? "ℹ️"}
                </span>
                <div>
                  <p className="text-sm">{sc.description}</p>
                  {sc.timing && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Timing: {sc.timing}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sub-variants */}
      {condition.subVariants && condition.subVariants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sub-variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {condition.subVariants.map((sv) => {
              const rec = sv.guidelineRecommendations[0];
              return (
                <div key={sv.id} className="border rounded-lg p-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{sv.name}</span>
                    {rec && <GAWindowBadge timing={rec.timing} />}
                    {rec && <EvidenceGradeBadge grade={rec.grade} />}
                  </div>
                  {rec?.notes && (
                    <p className="text-xs text-muted-foreground">
                      {rec.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Landmark Trials */}
      {condition.landmarkTrials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Landmark Trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {condition.landmarkTrials.map((trial) => (
              <div key={trial.id}>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">{trial.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {trial.journalCitation}
                  </span>
                </div>
                <p className="text-sm mt-1">{trial.summary}</p>
                <ul className="mt-2 space-y-1">
                  {trial.keyFindings.map((f, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex gap-1.5"
                    >
                      <span className="text-muted-foreground/50">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
