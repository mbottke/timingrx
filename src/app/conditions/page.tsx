"use client";

import { useState, useMemo } from "react";
import {
  conditionsByCategory,
  conditionGroups,
  allConditions,
} from "@/data/conditions";
import {
  CATEGORY_DISPLAY_NAMES,
  type ConditionCategory,
  type ObstetricCondition,
} from "@/data/types";
import { ConditionCard } from "@/components/condition/condition-card";
import { KairosLogo } from "@/components/layout/kairos-logo";

type SortOption = "category" | "alphabetical" | "ga-earliest" | "ga-latest" | "grade";

const SORT_LABELS: Record<SortOption, string> = {
  category: "By Category",
  alphabetical: "A → Z",
  "ga-earliest": "Earliest GA First",
  "ga-latest": "Latest GA First",
  grade: "Strongest Evidence",
};

const EVIDENCE_ORDER: Record<string, number> = {
  high: 0,
  moderate: 1,
  low: 2,
  very_low: 3,
  expert_consensus: 4,
};

/** Extract the earliest GA in days from a condition's primary recommendation */
function getEarliestGA(c: ObstetricCondition): number {
  const rec = c.guidelineRecommendations[0];
  if (!rec) return 999;
  if (rec.timing.type === "range") return rec.timing.range.earliest;
  if (rec.timing.type === "immediate") return 0;
  return 999;
}

/** Extract the latest GA in days */
function getLatestGA(c: ObstetricCondition): number {
  const rec = c.guidelineRecommendations[0];
  if (!rec) return 999;
  if (rec.timing.type === "range") return rec.timing.range.latest;
  if (rec.timing.type === "immediate") return 0;
  return 999;
}

/** Get evidence strength rank (lower = stronger) */
function getEvidenceRank(c: ObstetricCondition): number {
  const rec = c.guidelineRecommendations[0];
  if (!rec) return 99;
  return EVIDENCE_ORDER[rec.grade.strength] ?? 99;
}

export default function ConditionsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("category");
  const [categoryFilter, setCategoryFilter] = useState<ConditionCategory | "all">("all");
  const [pastFortyFilter, setPastFortyFilter] = useState<string>("all");

  const categories = conditionsByCategory();
  const categoryOrder: ConditionCategory[] = Object.keys(
    CATEGORY_DISPLAY_NAMES
  ) as ConditionCategory[];

  // Filter conditions
  const filtered = useMemo(() => {
    let list = conditionGroups;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          CATEGORY_DISPLAY_NAMES[c.category].toLowerCase().includes(q) ||
          c.clinicalNotes?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((c) => c.category === categoryFilter);
    }

    // Past 40 weeks filter
    if (pastFortyFilter !== "all") {
      list = list.filter((c) => c.pastFortyWeeks === pastFortyFilter);
    }

    return list;
  }, [search, categoryFilter, pastFortyFilter]);

  // Sort conditions
  const sorted = useMemo(() => {
    if (sort === "category") return null; // Use category grouping
    const copy = [...filtered];
    switch (sort) {
      case "alphabetical":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "ga-earliest":
        copy.sort((a, b) => getEarliestGA(a) - getEarliestGA(b));
        break;
      case "ga-latest":
        copy.sort((a, b) => getLatestGA(b) - getLatestGA(a));
        break;
      case "grade":
        copy.sort((a, b) => getEvidenceRank(a) - getEvidenceRank(b));
        break;
    }
    return copy;
  }, [filtered, sort]);

  // Group filtered conditions by category for "category" sort mode
  const filteredByCategory = useMemo(() => {
    if (sort !== "category") return null;
    const groups = new Map<ConditionCategory, ObstetricCondition[]>();
    for (const c of filtered) {
      const existing = groups.get(c.category) ?? [];
      existing.push(c);
      groups.set(c.category, existing);
    }
    return groups;
  }, [filtered, sort]);

  const totalShowing = sort === "category"
    ? Array.from(filteredByCategory?.values() ?? []).reduce((s, a) => s + a.length, 0)
    : sorted?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      {/* Centered hero logo */}
      <div className="mb-6 flex justify-center">
        <KairosLogo variant="hero" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Delivery Timing by Condition
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {conditionGroups.length} conditions across{" "}
          {categories.size} categories. Each with guideline-specific GA
          recommendations and evidence grades.
        </p>
      </div>

      {/* Search + Filter Controls */}
      <div className="mb-6 space-y-3">
        {/* Search bar */}
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
            placeholder="Search conditions, tags, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background px-4 py-2.5 pl-10 text-sm outline-none ring-ring focus:ring-2 placeholder:text-muted-foreground/60"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border bg-background px-3 py-1.5 text-xs outline-none ring-ring focus:ring-2"
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ConditionCategory | "all")}
            className="rounded-md border bg-background px-3 py-1.5 text-xs outline-none ring-ring focus:ring-2"
          >
            <option value="all">All Categories</option>
            {categoryOrder.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_DISPLAY_NAMES[cat]}
              </option>
            ))}
          </select>

          {/* Past 40w filter */}
          <select
            value={pastFortyFilter}
            onChange={(e) => setPastFortyFilter(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-xs outline-none ring-ring focus:ring-2"
          >
            <option value="all">Past 40w: Any</option>
            <option value="yes">Can go past 40w</option>
            <option value="no">No past 40w</option>
            <option value="borderline">Borderline</option>
            <option value="case_by_case">Case-by-case</option>
          </select>

          {/* Result count */}
          <span className="ml-auto text-xs text-muted-foreground">
            {totalShowing} of {conditionGroups.length} conditions
          </span>
        </div>
      </div>

      {/* Results */}
      {sort === "category" && filteredByCategory ? (
        <div className="space-y-10">
          {categoryOrder.map((cat) => {
            const conditions = filteredByCategory.get(cat);
            if (!conditions || conditions.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="mb-4 text-lg font-semibold">
                  {CATEGORY_DISPLAY_NAMES[cat]}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({conditions.length})
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {conditions.map((condition) => (
                    <ConditionCard
                      key={condition.id}
                      condition={condition}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : sorted ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((condition) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
            />
          ))}
        </div>
      ) : null}

      {totalShowing === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          {/* Faded diverging-curves motif */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 60"
            fill="none"
            className="mx-auto mb-4 w-24 opacity-20"
          >
            <path
              d="M10 50 C30 48, 60 40, 80 30 S100 18, 110 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10 48 C30 42, 50 28, 70 15 S95 2, 110 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="30" cy="45" r="2.5" fill="currentColor" />
          </svg>
          <p className="text-lg font-medium">No conditions found</p>
          <p className="mt-1 text-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
