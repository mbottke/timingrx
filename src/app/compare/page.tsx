"use client";

import { useState, useMemo } from "react";
import {
  allConditions,
  conditionGroups,
} from "@/data/conditions";
import {
  CATEGORY_DISPLAY_NAMES,
  type ConditionCategory,
  type ObstetricCondition,
  type GuidelineRecommendation,
  type GuidelineBody,
  type DeliveryTiming,
  type DeliveryRoute,
} from "@/data/types";
import { gaToDisplay, gaRangeToDisplay } from "@/lib/utils/ga-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceGradeBadge } from "@/components/condition/evidence-grade-badge";
import { GAWindowBadge } from "@/components/condition/ga-window-badge";

// ── Helpers ──────────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<DeliveryRoute, string> = {
  vaginal_preferred: "Vaginal preferred",
  cesarean_preferred: "Cesarean preferred",
  cesarean_required: "Cesarean required",
  either: "Either route",
  individualize: "Individualize",
};

function timingToLabel(timing: DeliveryTiming): string {
  if (timing.type === "range") {
    return gaRangeToDisplay(timing.range.earliest, timing.range.latest);
  }
  if (timing.type === "immediate") return "Immediate";
  return "Individualize";
}

/** Get the primary guideline body name from a recommendation */
function primaryBody(rec: GuidelineRecommendation): string {
  return rec.citations.map((c) => c.body).join(" / ");
}

/** Get year from citation */
function citationYear(rec: GuidelineRecommendation): string {
  const years = rec.citations.map((c) => c.year).filter(Boolean);
  return years.length > 0 ? String(years[0]) : "";
}

/** Get all unique guideline bodies across selected conditions */
function getAllBodies(conditions: ObstetricCondition[]): GuidelineBody[] {
  const bodies = new Set<GuidelineBody>();
  for (const c of conditions) {
    for (const rec of c.guidelineRecommendations) {
      for (const cit of rec.citations) {
        bodies.add(cit.body);
      }
    }
  }
  return Array.from(bodies).sort();
}

/** Convert GA days to a percentage position on a 34w–42w timeline */
function gaToPercent(gaDays: number): number {
  const min = 34 * 7; // 238
  const max = 42 * 7; // 294
  return Math.max(0, Math.min(100, ((gaDays - min) / (max - min)) * 100));
}

// Colors for multiple conditions on the timeline
const CONDITION_COLORS = [
  { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bar: "#3b82f6" },
  { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bar: "#10b981" },
  { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bar: "#f59e0b" },
  { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", bar: "#f43f5e" },
  { bg: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", bar: "#8b5cf6" },
  { bg: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400", bar: "#06b6d4" },
];

// ── Evidence strength sort order ─────────────────────────────────────────────

const STRENGTH_ORDER: Record<string, number> = {
  high: 0,
  moderate: 1,
  low: 2,
  very_low: 3,
  expert_consensus: 4,
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function ComparePage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter conditions that have multiple guideline recommendations or any at all
  const conditionsWithGuidelines = useMemo(
    () => allConditions.filter((c) => c.guidelineRecommendations.length > 0),
    []
  );

  // Search-filtered dropdown list
  const dropdownResults = useMemo(() => {
    if (!search.trim()) return conditionsWithGuidelines.slice(0, 20);
    const q = search.toLowerCase();
    return conditionsWithGuidelines
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          CATEGORY_DISPLAY_NAMES[c.category].toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [search, conditionsWithGuidelines]);

  // Selected conditions
  const selected = useMemo(
    () => selectedIds.map((id) => allConditions.find((c) => c.id === id)).filter(Boolean) as ObstetricCondition[],
    [selectedIds]
  );

  // All guideline bodies across selected conditions
  const allBodies = useMemo(() => getAllBodies(selected), [selected]);

  function addCondition(id: string) {
    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
    setSearch("");
    setShowDropdown(false);
  }

  function removeCondition(id: string) {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  }

  // Flatten all recommendations for the comparison table
  const allRecs = useMemo(() => {
    const rows: {
      condition: ObstetricCondition;
      rec: GuidelineRecommendation;
      colorIdx: number;
    }[] = [];
    selected.forEach((c, idx) => {
      for (const rec of c.guidelineRecommendations) {
        rows.push({ condition: c, rec, colorIdx: idx % CONDITION_COLORS.length });
      }
    });
    // Sort by evidence strength (strongest first)
    rows.sort(
      (a, b) =>
        (STRENGTH_ORDER[a.rec.grade.strength] ?? 99) -
        (STRENGTH_ORDER[b.rec.grade.strength] ?? 99)
    );
    return rows;
  }, [selected]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Cross-Guideline Comparison
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select conditions to compare guideline recommendations side-by-side.
          See where ACOG, NICE, WHO, ESC, and other organizations agree or
          diverge on delivery timing.
        </p>
      </div>

      {/* Condition selector */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">
          Add conditions to compare
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conditions to add..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full rounded-lg border bg-background px-4 py-2.5 pl-10 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground/60"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setShowDropdown(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}

          {/* Dropdown results */}
          {showDropdown && (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border bg-card shadow-lg">
              {dropdownResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No conditions with guideline data found.
                </div>
              ) : (
                dropdownResults.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => addCondition(c.id)}
                      disabled={isSelected}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/50 flex items-center justify-between gap-2 ${
                        isSelected ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      <div>
                        <span className="font-medium">{c.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {CATEGORY_DISPLAY_NAMES[c.category]}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {c.guidelineRecommendations.length} guideline
                        {c.guidelineRecommendations.length !== 1 ? "s" : ""}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Selected condition chips */}
        {selected.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((c, idx) => (
              <span
                key={c.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${CONDITION_COLORS[idx % CONDITION_COLORS.length].bg} text-white`}
              >
                {c.name}
                <button
                  onClick={() => removeCondition(c.id)}
                  className="ml-0.5 hover:opacity-70"
                >
                  ✕
                </button>
              </span>
            ))}
            {selected.length > 1 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-lg font-medium">Select conditions to compare</p>
          <p className="mt-1 text-sm">
            Search above to add conditions and see their guideline
            recommendations side-by-side.
          </p>
          {/* Quick-start suggestions */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground/70 mb-3">
              Popular comparisons:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                {
                  label: "Chronic HTN variants",
                  ids: [
                    "chronic_htn_no_meds",
                    "chronic_htn_controlled_meds",
                    "chronic_htn_difficult_control",
                  ],
                },
                {
                  label: "Preeclampsia spectrum",
                  ids: [
                    "preeclampsia_without_severe",
                    "preeclampsia_with_severe",
                  ],
                },
                {
                  label: "Diabetes types",
                  ids: [
                    "gdm_diet_controlled",
                    "gdm_a2_insulin",
                    "pregestational_dm_well_controlled",
                  ],
                },
              ].map((preset) => {
                // Only show preset if all conditions exist in data
                const allExist = preset.ids.every((id) =>
                  allConditions.some((c) => c.id === id)
                );
                if (!allExist) return null;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setSelectedIds(preset.ids)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comparison content */}
      {selected.length > 0 && (
        <div className="space-y-8">
          {/* GA Timeline Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Delivery Timing Windows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GATimeline conditions={selected} />
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Guideline Recommendations
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({allRecs.length} total)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    {selected.length > 1 && (
                      <th className="pb-3 pr-4 font-medium">Condition</th>
                    )}
                    <th className="pb-3 pr-4 font-medium">Guideline</th>
                    <th className="pb-3 pr-4 font-medium">Year</th>
                    <th className="pb-3 pr-4 font-medium">Timing</th>
                    <th className="pb-3 pr-4 font-medium">Route</th>
                    <th className="pb-3 pr-4 font-medium">Evidence</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecs.map(({ condition, rec, colorIdx }, i) => (
                    <tr
                      key={`${condition.id}-${i}`}
                      className="border-b last:border-0"
                    >
                      {selected.length > 1 && (
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${CONDITION_COLORS[colorIdx].bg} mr-2`}
                          />
                          <span className="text-xs font-medium">
                            {condition.name}
                          </span>
                        </td>
                      )}
                      <td className="py-3 pr-4 font-medium whitespace-nowrap">
                        {primaryBody(rec)}
                        {rec.citations[0]?.title && (
                          <div className="text-[11px] text-muted-foreground font-normal mt-0.5">
                            {rec.citations[0].title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground tabular-nums">
                        {citationYear(rec)}
                      </td>
                      <td className="py-3 pr-4">
                        <GAWindowBadge timing={rec.timing} />
                        {rec.timing.type === "range" && rec.timing.preferEarlierEnd && (
                          <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                            ← prefer earlier
                          </span>
                        )}
                        {rec.timing.type === "range" && rec.timing.preferLaterEnd && (
                          <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                            prefer later →
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-xs whitespace-nowrap">
                        {ROUTE_LABELS[rec.route]}
                      </td>
                      <td className="py-3 pr-4">
                        <EvidenceGradeBadge grade={rec.grade} />
                      </td>
                      <td className="py-3 text-xs text-muted-foreground max-w-xs">
                        {rec.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allRecs.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No guideline recommendations to compare for the selected
                  condition(s).
                </p>
              )}
            </CardContent>
          </Card>

          {/* Agreement Analysis */}
          {selected.length === 1 && selected[0].guidelineRecommendations.length > 1 && (
            <AgreementAnalysis condition={selected[0]} />
          )}
        </div>
      )}
    </div>
  );
}

// ── GA Timeline Component ────────────────────────────────────────────────────

function GATimeline({ conditions }: { conditions: ObstetricCondition[] }) {
  const weekMarkers = [34, 35, 36, 37, 38, 39, 40, 41, 42];

  // Collect all range-type recs with their condition color
  const bars: {
    label: string;
    body: string;
    earliest: number;
    latest: number;
    colorIdx: number;
  }[] = [];

  conditions.forEach((c, cIdx) => {
    c.guidelineRecommendations.forEach((rec) => {
      if (rec.timing.type === "range") {
        bars.push({
          label: conditions.length > 1 ? c.name : primaryBody(rec),
          body: primaryBody(rec),
          earliest: rec.timing.range.earliest,
          latest: rec.timing.range.latest,
          colorIdx: cIdx % CONDITION_COLORS.length,
        });
      }
    });
  });

  if (bars.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No range-based timing recommendations to visualize.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Week labels */}
      <div className="relative h-6">
        {weekMarkers.map((wk) => (
          <span
            key={wk}
            className="absolute text-[11px] text-muted-foreground tabular-nums -translate-x-1/2"
            style={{ left: `${gaToPercent(wk * 7)}%` }}
          >
            {wk}w
          </span>
        ))}
      </div>

      {/* Grid lines + bars */}
      <div className="relative">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {weekMarkers.map((wk) => (
            <div
              key={wk}
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${gaToPercent(wk * 7)}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative space-y-2 py-1">
          {bars.map((bar, i) => {
            const left = gaToPercent(bar.earliest);
            const right = gaToPercent(bar.latest);
            const width = Math.max(right - left, 1); // min 1% width for single-day

            return (
              <div key={i} className="flex items-center gap-3 h-7">
                <div className="w-32 shrink-0 text-right">
                  <span className="text-[11px] font-medium truncate block">
                    {conditions.length > 1 ? bar.label : bar.body}
                  </span>
                </div>
                <div className="relative flex-1 h-full">
                  <div
                    className={`absolute top-1 bottom-1 rounded-md ${CONDITION_COLORS[bar.colorIdx].bg} opacity-80`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono text-white font-medium px-1.5 whitespace-nowrap"
                    style={{
                      left: `${left}%`,
                    }}
                  >
                    {gaRangeToDisplay(bar.earliest, bar.latest)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Agreement Analysis Component ─────────────────────────────────────────────

function AgreementAnalysis({ condition }: { condition: ObstetricCondition }) {
  const recs = condition.guidelineRecommendations;
  if (recs.length < 2) return null;

  // Check timing agreement
  const rangeRecs = recs.filter((r) => r.timing.type === "range");
  let timingAgreement: "full" | "partial" | "divergent" = "full";
  let overlapStart = 0;
  let overlapEnd = Infinity;

  if (rangeRecs.length >= 2) {
    const earliests = rangeRecs.map((r) =>
      r.timing.type === "range" ? r.timing.range.earliest : 0
    );
    const latests = rangeRecs.map((r) =>
      r.timing.type === "range" ? r.timing.range.latest : 999
    );

    overlapStart = Math.max(...earliests);
    overlapEnd = Math.min(...latests);

    const allSameEarliest = earliests.every((e) => e === earliests[0]);
    const allSameLatest = latests.every((l) => l === latests[0]);

    if (allSameEarliest && allSameLatest) {
      timingAgreement = "full";
    } else if (overlapStart <= overlapEnd) {
      timingAgreement = "partial";
    } else {
      timingAgreement = "divergent";
    }
  }

  // Check route agreement
  const routes = recs.map((r) => r.route);
  const routeAgreement = routes.every((r) => r === routes[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agreement Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timing */}
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
              timingAgreement === "full"
                ? "bg-emerald-500"
                : timingAgreement === "partial"
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
          />
          <div>
            <p className="text-sm font-medium">
              Timing:{" "}
              {timingAgreement === "full"
                ? "Full agreement"
                : timingAgreement === "partial"
                  ? "Partial overlap"
                  : "Divergent recommendations"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {timingAgreement === "full"
                ? "All guidelines recommend the same delivery window."
                : timingAgreement === "partial"
                  ? `Guidelines overlap at ${gaRangeToDisplay(overlapStart, overlapEnd)}. This consensus window is the safest to follow when guidelines partially agree.`
                  : "Guidelines do not overlap in their recommended windows. Discuss with MFM."}
            </p>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
              routeAgreement ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <div>
            <p className="text-sm font-medium">
              Route: {routeAgreement ? "Full agreement" : "Mixed recommendations"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {routeAgreement
                ? `All guidelines recommend: ${ROUTE_LABELS[routes[0]]}.`
                : `Routes differ: ${[...new Set(routes)].map((r) => ROUTE_LABELS[r]).join(" vs ")}.`}
            </p>
          </div>
        </div>

        {/* Evidence strength summary */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500" />
          <div>
            <p className="text-sm font-medium">Evidence quality</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {recs.map((rec, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">
                    {primaryBody(rec)}:
                  </span>
                  <EvidenceGradeBadge grade={rec.grade} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
