"use client";

import type { ObstetricCondition } from "@/data/types";
import { CATEGORY_DISPLAY_NAMES } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { GAWindowBadge } from "./ga-window-badge";
import { EvidenceGradeBadge } from "./evidence-grade-badge";
import { formatCitations } from "@/lib/utils/citation-format";
import {
  formatRiskStatistic,
  getRiskSeverity,
  severityColorClass,
  formatCI95,
  generateTeachingInterpretation,
} from "@/lib/utils/risk-format";
import { RiskDataTable } from "./risk-data-table";
import { RiskModifiersList } from "./risk-modifiers-list";
import { ConditionInteractions } from "./condition-interactions";
import { EvidenceSourcesSection } from "./evidence-sources-section";
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
            <CardTitle className="text-base font-semibold tracking-tight">
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
            <CardTitle className="text-base font-semibold tracking-tight">Clinical Notes</CardTitle>
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

      {/* Risk Data */}
      <RiskDataTable riskData={condition.riskData} />

      {/* Risk Modifiers */}
      <RiskModifiersList modifiers={condition.riskModifiers} />

      {/* Interactions */}
      <ConditionInteractions interactions={condition.interactions} />

      {/* Key Evidence Sources */}
      <EvidenceSourcesSection sources={condition.keyEvidenceSources} />

      {/* Landmark Trials */}
      {condition.landmarkTrials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">Landmark Trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {condition.landmarkTrials.map((trial) => (
              <div key={trial.id}>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">{trial.name}</span>
                  {trial.sampleSize !== undefined && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      n = {trial.sampleSize.toLocaleString()}
                    </span>
                  )}
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
                {teachingMode && trial.relevantRiskData && trial.relevantRiskData.length > 0 && (
                  <div className="mt-3 bg-[#f0f7ff] border border-[#dbeafe] rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#1e40af] mb-2">Trial Risk Data</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b">
                          <th className="pb-1 pr-3 font-medium">Outcome</th>
                          <th className="pb-1 pr-3 text-right font-medium">Measure</th>
                          <th className="pb-1 text-right font-medium">CI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trial.relevantRiskData.map((rd, j) => (
                          <tr key={j} className="border-b last:border-0">
                            <td className="py-1 pr-3">{rd.outcome}</td>
                            <td className={`py-1 pr-3 text-right tabular-nums font-bold ${severityColorClass(getRiskSeverity(rd.statistic))}`}>
                              {formatRiskStatistic(rd.statistic)}
                            </td>
                            <td className="py-1 text-right text-muted-foreground tabular-nums">
                              {formatCI95(rd.statistic)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-2 border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
                      {trial.relevantRiskData.map((rd, j) => (
                        <p key={j} className="mb-1 last:mb-0">
                          → {generateTeachingInterpretation(rd.statistic, rd.populationDescription)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Special Considerations */}
      {condition.specialConsiderations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">
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
            <CardTitle className="text-base font-semibold tracking-tight">Sub-variants</CardTitle>
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
    </div>
  );
}
