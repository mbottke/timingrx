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

function primaryBody(rec: GuidelineRecommendation): string {
  return rec.citations.map((c) => c.body).join(" / ");
}

function citationYear(rec: GuidelineRecommendation): string {
  const years = rec.citations.map((c) => c.year).filter(Boolean);
  return years.length > 0 ? String(years[0]) : "";
}

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

function gaToPercent(gaDays: number): number {
  const min = 34 * 7;
  const max = 42 * 7;
  return Math.max(0, Math.min(100, ((gaDays - min) / (max - min)) * 100));
}

const CONDITION_COLORS = [
  { bg: "bg-blue-500", ring: "ring-blue-500/30", text: "text-blue-700 dark:text-blue-300", light: "bg-blue-50 dark:bg-blue-950/40", bar: "#3b82f6" },
  { bg: "bg-emerald-500", ring: "ring-emerald-500/30", text: "text-emerald-700 dark:text-emerald-300", light: "bg-emerald-50 dark:bg-emerald-950/40", bar: "#10b981" },
  { bg: "bg-amber-500", ring: "ring-amber-500/30", text: "text-amber-700 dark:text-amber-300", light: "bg-amber-50 dark:bg-amber-950/40", bar: "#f59e0b" },
  { bg: "bg-rose-500", ring: "ring-rose-500/30", text: "text-rose-700 dark:text-rose-300", light: "bg-rose-50 dark:bg-rose-950/40", bar: "#f43f5e" },
  { bg: "bg-violet-500", ring: "ring-violet-500/30", text: "text-violet-700 dark:text-violet-300", light: "bg-violet-50 dark:bg-violet-950/40", bar: "#8b5cf6" },
  { bg: "bg-cyan-500", ring: "ring-cyan-500/30", text: "text-cyan-700 dark:text-cyan-300", light: "bg-cyan-50 dark:bg-cyan-950/40", bar: "#06b6d4" },
];

const STRENGTH_ORDER: Record<string, number> = {
  high: 0,
  moderate: 1,
  low: 2,
  very_low: 3,
  expert_consensus: 4,
};

// ── Quick-start Presets ──────────────────────────────────────────────────────

interface ComparePreset {
  label: string;
  description: string;
  ids: string[];
  category: string;
}

const PRESETS: ComparePreset[] = [
  // Hypertensive
  {
    label: "Chronic HTN Spectrum",
    description: "No meds vs controlled vs difficult to control",
    ids: ["chronic_htn_no_meds", "chronic_htn_controlled_meds", "chronic_htn_difficult_control"],
    category: "Hypertensive",
  },
  {
    label: "Preeclampsia Severity",
    description: "Without vs with severe features",
    ids: ["preeclampsia_without_severe", "preeclampsia_with_severe"],
    category: "Hypertensive",
  },
  {
    label: "HTN vs Preeclampsia",
    description: "Chronic HTN on meds vs preeclampsia without severe features",
    ids: ["chronic_htn_controlled_meds", "preeclampsia_without_severe"],
    category: "Hypertensive",
  },
  // Diabetes
  {
    label: "Diabetes Types",
    description: "GDM diet-controlled vs insulin vs pregestational",
    ids: ["gdm_diet_controlled", "gdm_medication_controlled", "pregestational_dm_well_controlled"],
    category: "Diabetes",
  },
  {
    label: "GDM Severity",
    description: "Diet vs medication vs poorly controlled",
    ids: ["gdm_diet_controlled", "gdm_medication_controlled", "gdm_poorly_controlled"],
    category: "Diabetes",
  },
  {
    label: "Pregestational DM",
    description: "Well-controlled vs vascular/poor control",
    ids: ["pregestational_dm_well_controlled", "pregestational_dm_vascular_poor_control"],
    category: "Diabetes",
  },
  // Fetal
  {
    label: "Fetal Growth Restriction",
    description: "3rd–10th percentile vs <3rd vs absent diastolic flow",
    ids: ["fgr_3rd_10th", "fgr_less_3rd", "fgr_aedv"],
    category: "Fetal",
  },
  {
    label: "Twin Types",
    description: "DCDA vs MCDA vs MCMA twins",
    ids: ["dcda_twins", "mcda_twins", "mcma_twins"],
    category: "Multiple Gestation",
  },
  // Cardiac
  {
    label: "Valvular Heart Disease",
    description: "Mitral stenosis mild vs severe vs aortic stenosis",
    ids: ["mitral_stenosis_mild", "mitral_stenosis_severe", "aortic_stenosis_asymptomatic"],
    category: "Cardiac",
  },
  {
    label: "Marfan by Aortic Root",
    description: "<40mm vs 40-45mm vs >45mm",
    ids: ["marfan_root_lt40", "marfan_root_40_45", "marfan_root_gt45"],
    category: "Cardiac",
  },
  // Renal
  {
    label: "CKD Stages",
    description: "Stages 1-3 vs 4-5 vs dialysis-dependent",
    ids: ["ckd_stages_1_3", "ckd_stages_4_5", "hemodialysis_dependent"],
    category: "Renal",
  },
  // Placental/Uterine
  {
    label: "Placental Abnormalities",
    description: "Previa vs accreta spectrum vs vasa previa",
    ids: ["placenta_previa_uncomplicated", "placenta_accreta_spectrum", "vasa_previa"],
    category: "Placental",
  },
  // Prior obstetric
  {
    label: "Prior Cesarean",
    description: "1x vs 2x vs 3+ prior cesarean deliveries",
    ids: ["prior_cs_x1_low_transverse", "prior_cs_x2_low_transverse", "prior_cs_x3_plus"],
    category: "Prior Obstetric",
  },
  {
    label: "Prior Stillbirth",
    description: "Unexplained vs explained cause",
    ids: ["prior_stillbirth_unexplained", "prior_stillbirth_explained"],
    category: "Prior Obstetric",
  },
  // Advanced maternal age
  {
    label: "Advanced Maternal Age",
    description: "35-39 vs 40+ vs 45+",
    ids: ["ama_35_39", "ama_40_plus", "ama_45_plus"],
    category: "Demographics",
  },
  // Obesity
  {
    label: "Obesity Classes",
    description: "Class I vs II vs III vs super morbid",
    ids: ["obesity_class_i", "obesity_class_ii", "obesity_class_iii", "obesity_super_morbid"],
    category: "Obesity",
  },
  // Multi-guideline (conditions with 2+ guidelines — best for org comparison)
  {
    label: "ACOG vs NICE: Chronic HTN",
    description: "How ACOG and NICE differ on controlled chronic HTN",
    ids: ["chronic_htn_controlled_meds"],
    category: "Cross-Guideline",
  },
  {
    label: "ACOG vs NICE: Twins",
    description: "Compare DCDA and MCDA twin guidelines across organizations",
    ids: ["dcda_twins", "mcda_twins"],
    category: "Cross-Guideline",
  },
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function ComparePage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const conditionsWithGuidelines = useMemo(
    () => allConditions.filter((c) => c.guidelineRecommendations.length > 0),
    []
  );

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

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => allConditions.find((c) => c.id === id))
        .filter(Boolean) as ObstetricCondition[],
    [selectedIds]
  );

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
    rows.sort(
      (a, b) =>
        (STRENGTH_ORDER[a.rec.grade.strength] ?? 99) -
        (STRENGTH_ORDER[b.rec.grade.strength] ?? 99)
    );
    return rows;
  }, [selected]);

  // Filter presets to only those where all IDs exist
  const validPresets = useMemo(
    () =>
      PRESETS.filter((p) =>
        p.ids.every((id) => allConditions.some((c) => c.id === id))
      ),
    []
  );

  // Group presets by category
  const presetsByCategory = useMemo(() => {
    const groups = new Map<string, ComparePreset[]>();
    for (const p of validPresets) {
      const existing = groups.get(p.category) ?? [];
      existing.push(p);
      groups.set(p.category, existing);
    }
    return groups;
  }, [validPresets]);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Cross-Guideline Comparison
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare delivery timing recommendations across conditions and
          guideline organizations side-by-side.
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
      </div>

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* ── Selected Conditions Banner ─────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Comparing {selected.length} Condition{selected.length !== 1 ? "s" : ""}
            </h2>
            {selected.length > 1 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((c, idx) => {
              const color = CONDITION_COLORS[idx % CONDITION_COLORS.length];
              const primaryRec = c.guidelineRecommendations[0];
              return (
                <div
                  key={c.id}
                  className={`relative rounded-lg border-2 p-4 ${color.light} ring-2 ${color.ring}`}
                  style={{ borderColor: color.bar }}
                >
                  <button
                    onClick={() => removeCondition(c.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-xs leading-none"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${color.bg}`}
                    />
                    <span className={`text-sm font-semibold ${color.text}`}>
                      {c.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {CATEGORY_DISPLAY_NAMES[c.category]}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryRec && <GAWindowBadge timing={primaryRec.timing} />}
                    {primaryRec && (
                      <EvidenceGradeBadge grade={primaryRec.grade} />
                    )}
                    <Badge variant="outline" className="text-[11px]">
                      {c.guidelineRecommendations.length} guideline
                      {c.guidelineRecommendations.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {c.guidelineRecommendations.length > 1 && (
                    <div className="mt-2 pt-2 border-t border-current/10">
                      <p className="text-[11px] text-muted-foreground">
                        {c.guidelineRecommendations
                          .map((r) => primaryBody(r))
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty State: Quick-start Presets ───────────────────────────────── */}
      {selected.length === 0 && (
        <div className="mt-2">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="text-lg font-medium">
              Select conditions to compare
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search above or choose a quick comparison below.
            </p>
          </div>

          <div className="space-y-6">
            {Array.from(presetsByCategory.entries()).map(
              ([category, presets]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {category}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setSelectedIds(preset.ids)}
                        className="group rounded-lg border bg-card p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
                      >
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {preset.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {preset.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5"
                          >
                            {preset.ids.length} condition
                            {preset.ids.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Comparison Content ─────────────────────────────────────────────── */}
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
                    <th className="pb-3 pr-4 font-medium">Condition</th>
                    <th className="pb-3 pr-4 font-medium">Guideline</th>
                    <th className="pb-3 pr-4 font-medium">Year</th>
                    <th className="pb-3 pr-4 font-medium">Timing</th>
                    <th className="pb-3 pr-4 font-medium">Route</th>
                    <th className="pb-3 pr-4 font-medium">Evidence</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecs.map(({ condition, rec, colorIdx }, i) => {
                    const color = CONDITION_COLORS[colorIdx];
                    return (
                      <tr
                        key={`${condition.id}-${i}`}
                        className="border-b last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${color.bg}`}
                            />
                            <span className={`text-xs font-semibold ${color.text}`}>
                              {condition.name}
                            </span>
                          </div>
                        </td>
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
                          {rec.timing.type === "range" &&
                            rec.timing.preferEarlierEnd && (
                              <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                                ← earlier
                              </span>
                            )}
                          {rec.timing.type === "range" &&
                            rec.timing.preferLaterEnd && (
                              <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                                later →
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
                    );
                  })}
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

          {/* Agreement Analysis — for single condition with multiple guidelines */}
          {selected.length === 1 &&
            selected[0].guidelineRecommendations.length > 1 && (
              <AgreementAnalysis condition={selected[0]} />
            )}

          {/* Cross-condition summary — for 2+ conditions */}
          {selected.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Cross-Condition Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selected.map((c, idx) => {
                  const color = CONDITION_COLORS[idx % CONDITION_COLORS.length];
                  const rangeRec = c.guidelineRecommendations.find(
                    (r) => r.timing.type === "range"
                  );
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className={`inline-block w-3 h-3 rounded-full shrink-0 ${color.bg}`}
                      />
                      <span className={`font-semibold min-w-[180px] ${color.text}`}>
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      {rangeRec && rangeRec.timing.type === "range" ? (
                        <span className="font-mono text-xs">
                          {gaRangeToDisplay(
                            rangeRec.timing.range.earliest,
                            rangeRec.timing.range.latest
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Individualize / Immediate
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {ROUTE_LABELS[c.guidelineRecommendations[0]?.route ?? "individualize"]}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ── GA Timeline Component ────────────────────────────────────────────────────

function GATimeline({ conditions }: { conditions: ObstetricCondition[] }) {
  const weekMarkers = [35, 36, 37, 38, 39, 40, 41, 42];

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
      <div className="relative h-6 ml-48">
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

      <div className="relative">
        <div className="absolute inset-0 ml-48">
          {weekMarkers.map((wk) => (
            <div
              key={wk}
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${gaToPercent(wk * 7)}%` }}
            />
          ))}
        </div>

        <div className="relative space-y-2 py-1">
          {bars.map((bar, i) => {
            const left = gaToPercent(bar.earliest);
            const right = gaToPercent(bar.latest);
            const width = Math.max(right - left, 1);
            const color = CONDITION_COLORS[bar.colorIdx];

            return (
              <div key={i} className="flex items-center gap-3 h-9">
                <div className="w-44 shrink-0 text-right pr-1">
                  <span className={`text-sm font-semibold truncate block ${color.text}`}>
                    {conditions.length > 1 ? bar.label : bar.body}
                  </span>
                  {conditions.length > 1 && (
                    <span className="text-xs text-muted-foreground block truncate">
                      {bar.body}
                    </span>
                  )}
                </div>
                <div className="relative flex-1 h-full">
                  <div
                    className={`absolute top-1 bottom-1 rounded-md ${color.bg} opacity-80`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono text-white font-medium px-1.5 whitespace-nowrap"
                    style={{ left: `${left}%` }}
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

  const routes = recs.map((r) => r.route);
  const routeAgreement = routes.every((r) => r === routes[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agreement Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
              routeAgreement ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <div>
            <p className="text-sm font-medium">
              Route:{" "}
              {routeAgreement
                ? "Full agreement"
                : "Mixed recommendations"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {routeAgreement
                ? `All guidelines recommend: ${ROUTE_LABELS[routes[0]]}.`
                : `Routes differ: ${[...new Set(routes)].map((r) => ROUTE_LABELS[r]).join(" vs ")}.`}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500" />
          <div>
            <p className="text-sm font-medium">Evidence quality</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {recs.map((rec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs"
                >
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
