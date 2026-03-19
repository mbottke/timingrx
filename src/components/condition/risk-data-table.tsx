"use client";

import { useState, Fragment } from "react";
import type { RiskDataPoint } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import {
  formatRiskStatistic,
  getRiskSeverity,
  severityColorClass,
  formatCI95,
  generateTeachingInterpretation,
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
    <Card>
      <CardHeader
        className={
          teachingMode ? "bg-[#eff6ff]" : undefined
        }
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
            Risk Data
            {teachingMode && (
              <span className="text-xs bg-[var(--evidence-moderate)] text-white px-1.5 py-0.5 rounded">
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
                      <td className="py-2 pr-4">
                        {dp.outcome}
                        {teachingMode && (
                          <span className="ml-1 text-xs text-muted-foreground">ⓘ</span>
                        )}
                      </td>
                      <td
                        className={`py-2 pr-4 text-right tabular-nums font-bold whitespace-nowrap ${severityColorClass(severity)}`}
                      >
                        {formatRiskStatistic(dp.statistic)}
                      </td>
                      <td className="py-2 pr-4 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                        {formatCI95(dp.statistic)}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                        {dp.citation ? formatCitation(dp.citation) : "—"}
                      </td>
                    </tr>
                    {showInterpretation && (
                      <tr>
                        <td colSpan={4} className="pb-2">
                          <div className="border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
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
