"use client";

import Link from "next/link";
import type { ObstetricCondition } from "@/data/types";
import { CATEGORY_DISPLAY_NAMES } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { hasCalculatorMapping, getFactorsForCondition } from "@/lib/utils/condition-factor-mapping";
import { GAWindowBadge } from "./ga-window-badge";
import { EvidenceGradeBadge } from "./evidence-grade-badge";
import { DivergenceIndicator } from "./divergence-indicator";
import { detectDivergence } from "@/lib/utils/guideline-divergence";
import { formatCitations } from "@/lib/utils/citation-format";
import {
  formatRiskStatisticStructured,
  getRiskSeverity,
  severityColorClass,
  formatCI95,
  generateTeachingInterpretation,
  capitalizeFirst,
} from "@/lib/utils/risk-format";
import { RiskDataTable } from "./risk-data-table";
import { RiskModifiersList } from "./risk-modifiers-list";
import { ConditionInteractions } from "./condition-interactions";
import { EvidenceSourcesSection } from "./evidence-sources-section";
import { RecentLiterature } from "./recent-literature";
import { ActiveTrials } from "./active-trials";
import { RelatedConditions } from "./related-conditions";
import { getIcdCodes } from "@/lib/utils/icd-codes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const routeLabels: Record<string, string> = {
  vaginal_preferred: "Vaginal preferred",
  cesarean_preferred: "Cesarean preferred",
  cesarean_required: "Cesarean required",
  either: "Vaginal or Cesarean",
  individualize: "Individualize",
};

const specialIcons: Record<string, string> = {
  anticoagulation_bridging: "\u{1F489}",
  medication_adjustment: "\u{1F48A}",
  anesthesia_consideration: "\u{1FAC1}",
  monitoring_requirement: "\u{1F4CA}",
  contraindication: "\u26D4",
  neonatal_consideration: "\u{1F476}",
  postpartum_management: "\u{1F3E5}",
  surgical_planning: "\u{1F52A}",
  imaging_surveillance: "\u{1F4F8}",
  medication_continuation: "\u{1F48A}",
  delivery_site_requirement: "\u{1F3E8}",
  other: "\u2139\uFE0F",
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
      <div className="rounded-xl border bg-card p-5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] kairos-divider" />
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
            {CATEGORY_DISPLAY_NAMES[condition.category]}
          </span>
          {condition.parentConditionId && (
            <>
              <span className="text-border">/</span>
              <span>Sub-variant</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {condition.name}
        </h1>
        {getIcdCodes(condition.id).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {getIcdCodes(condition.id).map((code) => (
              <span key={code} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                {code}
              </span>
            ))}
          </div>
        )}
        {condition.stratificationAxis && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Stratified by:{" "}
            <span className="font-medium text-foreground/80">{condition.stratificationAxis}</span>
          </p>
        )}
        {hasCalculatorMapping(condition.id) && (
          <Link
            href={`/calculator?factors=${getFactorsForCondition(condition.id).join(",")}`}
            className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md mt-3"
            style={{ background: "var(--kairos-gradient)" }}
          >
            Open in Risk Calculator
          </Link>
        )}
      </div>

      {/* Guideline Recommendations */}
      {condition.guidelineRecommendations.length > 0 && (
        <Card className="border-l-4 border-l-[var(--brand-blue)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">
              Delivery Timing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {condition.guidelineRecommendations.length >= 2 && (() => {
              const divergence = detectDivergence(condition.guidelineRecommendations);
              return divergence.hasDivergence ? (
                <DivergenceIndicator result={divergence} />
              ) : null;
            })()}
            {condition.guidelineRecommendations.map((rec, i) => (
              <div
                key={i}
                className={`flex flex-col gap-2.5 ${
                  i > 0 ? "border-t pt-4" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <GAWindowBadge timing={rec.timing} />
                  <Badge variant="outline" className="text-xs font-medium">
                    {routeLabels[rec.route]}
                  </Badge>
                  <EvidenceGradeBadge grade={rec.grade} />
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatCitations(rec.citations)}
                </p>
                {rec.notes && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      {condition.clinicalNotes && (
        <Card className="border-l-4 border-l-[var(--brand-purple)]">
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
        <Card className="border-l-4 border-l-[var(--brand-pink)] bg-[var(--brand-pink)]/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-xs bg-[var(--ga-caution)] text-black px-1.5 py-0.5 rounded font-semibold">
                TEACHING
              </span>
              <span className="font-semibold tracking-tight">Pathophysiology</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {condition.physiologyExplanation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Data — coral/red accent (severity) */}
      <RiskDataTable riskData={condition.riskData} />

      {/* Risk Modifiers */}
      <RiskModifiersList modifiers={condition.riskModifiers} />

      {/* Interactions */}
      <ConditionInteractions interactions={condition.interactions} />

      {/* Key Evidence Sources */}
      <EvidenceSourcesSection sources={condition.keyEvidenceSources} />

      {/* Recent Literature (PubMed) */}
      <RecentLiterature conditionName={condition.name} />

      {/* Active Clinical Trials */}
      <ActiveTrials conditionName={condition.name} />

      {/* Landmark Trials */}
      {condition.landmarkTrials.length > 0 && (
        <Card className="border-l-4 border-l-[var(--brand-blue)]/70">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">Landmark Trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {condition.landmarkTrials.map((trial, idx) => (
              <div key={trial.id} className={idx > 0 ? "border-t pt-4" : ""}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{trial.name}</span>
                  {trial.sampleSize !== undefined && (
                    <span className="text-[11px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                      n = {trial.sampleSize.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {trial.journalCitation}
                  </span>
                </div>
                <p className="text-sm mt-1.5 leading-relaxed">{trial.summary}</p>
                <ul className="mt-2 space-y-1">
                  {trial.keyFindings.map((f, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex gap-1.5"
                    >
                      <span className="text-primary/40">&bull;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {teachingMode && trial.relevantRiskData && trial.relevantRiskData.length > 0 && (
                  <div className="mt-3 bg-[var(--brand-pink)]/5 border border-[var(--brand-pink)]/15 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[var(--brand-pink)] mb-2">Trial Risk Data</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b">
                          <th className="pb-1 pr-3 font-medium">Outcome</th>
                          <th className="pb-1 pr-3 text-right font-medium">Measure</th>
                          <th className="pb-1 text-right font-medium">CI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trial.relevantRiskData.map((rd, j) => {
                          const m = formatRiskStatisticStructured(rd.statistic);
                          return (
                            <tr key={j} className="border-b last:border-0">
                              <td className="py-1 pr-3">{capitalizeFirst(rd.outcome)}</td>
                              <td className="py-1 pr-3 text-right whitespace-nowrap">
                                <span className="inline-flex items-baseline justify-end gap-0.5">
                                  {m.label && (
                                    <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                                      {m.label}
                                    </span>
                                  )}
                                  <span className={`font-mono tabular-nums font-bold ${severityColorClass(getRiskSeverity(rd.statistic))}`}>
                                    {m.value}
                                  </span>
                                  {m.unit && (
                                    <span className="text-[9px] text-muted-foreground">
                                      {m.unit}
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="py-1 text-right text-muted-foreground font-mono tabular-nums">
                                {formatCI95(rd.statistic)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mt-2 border-l-[3px] border-[var(--brand-pink)]/30 pl-3 text-sm italic text-[var(--brand-pink)]">
                      {trial.relevantRiskData.map((rd, j) => (
                        <p key={j} className="mb-1 last:mb-0">
                          &rarr; {generateTeachingInterpretation(rd.statistic, rd.populationDescription)}
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
        <Card className="border-l-4 border-l-[var(--brand-pink)]/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">
              Special Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {condition.specialConsiderations.map((sc, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-muted/20 p-3">
                <span className="text-base shrink-0 mt-0.5">
                  {specialIcons[sc.type] ?? "\u2139\uFE0F"}
                </span>
                <div>
                  <p className="text-sm leading-relaxed">{sc.description}</p>
                  {sc.timing && (
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
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
        <Card className="border-l-4 border-l-[var(--brand-blue)]/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">Sub-variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {condition.subVariants.map((sv) => {
              const rec = sv.guidelineRecommendations[0];
              return (
                <Link
                  key={sv.id}
                  href={`/conditions/${sv.id}`}
                  className="block rounded-lg border bg-muted/30 p-3.5 transition-colors hover:bg-muted/50 hover:border-[var(--brand-pink)]/40"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold">{sv.name}</span>
                    {rec && <GAWindowBadge timing={rec.timing} />}
                    {rec && <EvidenceGradeBadge grade={rec.grade} />}
                  </div>
                  {rec?.notes && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rec.notes}
                    </p>
                  )}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Related Conditions */}
      <RelatedConditions conditionId={condition.id} />
    </div>
  );
}
