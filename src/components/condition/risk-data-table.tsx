"use client";

import { useState, Fragment } from "react";
import type { RiskDataPoint } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import {
  formatRiskStatisticStructured,
  getRiskSeverity,
  severityColorClass,
  formatCI95,
  generateTeachingInterpretation,
  capitalizeFirst,
} from "@/lib/utils/risk-format";
import { formatCitation } from "@/lib/utils/citation-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RiskDataTable({ riskData }: { riskData: RiskDataPoint[] }) {
  const { teachingMode, teachingExpanded, toggleTeachingExpanded } =
    useTeachingMode();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (riskData.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-[var(--brand-coral)]">
      <CardHeader
        className={
          teachingMode ? "bg-primary/5" : undefined
        }
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
            Risk Data
            {teachingMode && (
              <span className="text-xs bg-[var(--ga-caution)] text-black px-1.5 py-0.5 rounded font-semibold">
                TEACHING
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {riskData.length} outcome{riskData.length !== 1 ? "s" : ""}
            </Badge>
            {teachingMode && (
              <button
                onClick={toggleTeachingExpanded}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title={teachingExpanded ? "Hover mode" : "Expand all"}
              >
                {teachingExpanded ? "▼" : "▶"}
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Outcome</th>
                <th className="pb-2 pr-4 text-right font-medium">Measure</th>
                <th className="pb-2 pr-4 text-right font-medium">95% CI</th>
                <th className="pb-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {riskData.map((dp, i) => {
                const severity = getRiskSeverity(dp.statistic);
                const measure = formatRiskStatisticStructured(dp.statistic);
                const showInterpretation =
                  teachingMode &&
                  (teachingExpanded || hoveredRow === i);

                return (
                  <Fragment key={i}>
                    <tr
                      className="border-b last:border-0"
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="py-2.5 pr-4 text-sm">
                        {capitalizeFirst(dp.outcome)}
                        {teachingMode && (
                          <span className="ml-1 text-xs text-muted-foreground">ⓘ</span>
                        )}
                      </td>
                      <td
                        className="py-2.5 pr-4 text-right whitespace-nowrap"
                      >
                        <span className="inline-flex items-baseline justify-end gap-1">
                          {measure.label && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {measure.label}
                            </span>
                          )}
                          <span className={`font-mono tabular-nums text-sm font-bold ${severityColorClass(severity)}`}>
                            {measure.value}
                          </span>
                          {measure.unit && (
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {measure.unit}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right text-muted-foreground font-mono tabular-nums text-xs whitespace-nowrap">
                        {formatCI95(dp.statistic)}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {dp.citation ? formatCitation(dp.citation) : "—"}
                      </td>
                    </tr>
                    {showInterpretation && (
                      <tr>
                        <td colSpan={4} className="pb-2">
                          <div className="border-l-[3px] border-primary/30 pl-3 text-sm italic text-primary">
                            → {generateTeachingInterpretation(dp.statistic, dp.populationDescription)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {teachingMode && !teachingExpanded && (
          <p className="mt-2 text-xs text-muted-foreground italic">
            Hover any row for clinical interpretation
          </p>
        )}
      </CardContent>
    </Card>
  );
}
