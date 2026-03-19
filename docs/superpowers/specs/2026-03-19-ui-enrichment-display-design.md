# UI Enrichment Display — Design Spec

**Goal:** Surface the enriched data layer (riskData, keyEvidenceSources, riskModifiers, interactions) across the condition detail page and condition cards, with dual-mode rendering controlled by the existing teaching mode toggle.

**Architecture:** New React components follow existing patterns (shadcn/ui primitives, CSS custom property tokens, `useTeachingMode` hook). A new `formatRiskStatistic()` utility handles the discriminated union formatting. Evidence source type colors are added as CSS custom properties matching the EBM evidence pyramid.

**Tech Stack:** React 19, Next.js (app router, SSG), TypeScript strict, Tailwind CSS, shadcn/ui, existing `useTeachingMode` context.

---

## 1. Condition Detail Page — Section Order

The `ConditionDetail` component renders sections in this order:

1. **Header** — name, category breadcrumb, stratification axis (existing)
2. **Delivery Timing Recommendations** — GA window badge, route, grade, citations (existing)
3. **Clinical Notes** — text card (existing)
4. **Physiology** — teaching mode only, blue-bordered card (existing)
5. **Risk Data** — NEW evidence table (Section 2 below)
6. **Risk Modifiers** — NEW bullet list (Section 3 below)
7. **Interactions** — NEW conditional callout (Section 4 below)
8. **Key Evidence Sources** — NEW card/list with color coding (Section 5 below)
9. **Landmark Trials** — enhanced with sample size + teaching risk data (Section 6 below)
10. **Special Considerations** — icon + description list (existing)
11. **Sub-variants** — bordered cards with first recommendation (existing)

Each NEW section only renders when its data array is non-empty.

## 2. Risk Data Table

### Component
`RiskDataTable` — renders `condition.riskData: RiskDataPoint[]`.

### Clinician Mode (teaching off)
A 4-column table inside a Card:

| Column | Alignment | Content |
|--------|-----------|---------|
| Outcome | left | `riskData[].outcome` |
| Measure | right, tabular-nums, bold | Formatted via `formatRiskStatistic()` |
| 95% CI | right, muted | `ci95` array formatted as "low–high", or "—" if absent. Note: `ci95` only exists on `relative_risk`, `odds_ratio`, and `absolute_risk` variants; `incidence` and `mortality_rate` always render "—". |
| Source | left, small muted | `citation` formatted via singular `formatCitation()` from `citation-format.ts` (not `formatCitations`). Renders "—" when `citation` is undefined. |

Header: card title "Risk Data" with count badge (e.g., "3 outcomes").

Measure values are color-coded by severity:
- `incidence`/`mortality_rate` ≥10% or `relative_risk`/`odds_ratio` value ≥2.0 or `absolute_risk` ≥100 per 1,000 → `--risk-high` (red)
- `incidence`/`mortality_rate` 2–10% or `relative_risk`/`odds_ratio` 1.5–2.0 or `absolute_risk` 20–100 per 1,000 → `--risk-moderate` (amber)
- Below those thresholds → default text color

### Teaching Mode — Hover (default sub-mode)
Same table with additions:
- Small `ⓘ` icon appended to each outcome name.
- Card header gets blue background (`#eff6ff`), TEACHING badge.
- Footer text: "Hover any row for clinical interpretation".
- On hover: an interpretation row slides in below the hovered stat row. The interpretation row spans all 4 columns, has a `3px` left border in `#93b4f4`, italic text in `#1e40af`, prefixed with `→`.

### Teaching Mode — Expanded (sub-toggle)
All interpretation rows visible simultaneously. Toggle icon in card header switches between hover and expanded. Preference persisted in localStorage alongside teaching mode.

### `formatRiskStatistic()` Utility
Handles the 5 discriminated union cases:

```
relative_risk  → "RR {value}"
odds_ratio     → "OR {value}"
absolute_risk  → "{valuePer1000} per 1,000"
incidence      → "{valuePercent}%"
mortality_rate → "{valuePercent}% mortality"
```

### `generateTeachingInterpretation()` Utility
Produces plain-English annotations per stat type:
- `relative_risk` → "A relative risk of {value} means this outcome is {value}× more likely than in the reference population. {CI interpretation if present}."
- `odds_ratio` → "An odds ratio of {value} means {value}× the odds compared to unexposed. {CI note}."
- `absolute_risk` → "{valuePer1000} per 1,000 pregnancies — approximately 1 in {Math.round(1000/valuePer1000)}."
- `incidence` → "{valuePercent}% — approximately 1 in {Math.round(100/valuePercent)} pregnancies in this population."
- `mortality_rate` → "Mortality rate of {valuePercent}% in this population."

Population description (`populationDescription`) is appended when present.

## 3. Risk Modifiers

### Component
`RiskModifiersList` — renders `condition.riskModifiers: RiskModifier[]`.

### Clinician Mode
Bullet list inside a Card. Each item:
- Factor badge: uppercase, gray background (`#555`), white text, `border-radius: 3px`. Complete factor-to-label mapping:

| Factor | Label |
|--------|-------|
| `maternal_age` | Age |
| `bmi` | BMI |
| `parity` | Parity |
| `prior_stillbirth` | Prior Stillbirth |
| `prior_preterm_birth` | Prior Preterm |
| `prior_cesarean_count` | Prior Cesarean |
| `race_ethnicity` | Ethnicity |
| `ivf_conception` | IVF |
| `multiple_gestation` | Multiples |
| `fetal_sex` | Fetal Sex |
| `gestational_age_at_diagnosis` | GA at Dx |
| `disease_severity` | Severity |
| `medication_control_status` | Med Control |
| `comorbidity_count` | Comorbidities |
| `smoking` | Smoking |
| `other` | Other |
- Effect text beside the badge.

### Teaching Mode
Same list with interpretation row below each item:
- Blue left-border (`3px solid #93b4f4`), italic `#1e40af` text.
- Interpretation explains the mechanism and quantifies the modifier's impact where data exists.
- If `riskData` is present on the modifier, render it inline as a mini stat.

## 4. Condition Interactions

### Component
`ConditionInteractions` — renders `condition.interactions: ConditionInteraction[]`.

Only rendered when `interactions.length > 0`.

### Display
Amber-toned card (`background: #fef9ee`, border `#f0e4c4`, header text `#92610a`).

Each interaction renders as a bordered card inside:
- **Interaction type badge**: uppercase, amber-toned. Maps `additive_risk` → "Additive Risk", `timing_shift` → "Timing Shift", `route_change` → "Route Change", `monitoring_change` → "Monitoring Change".
- **Linked condition name**: `interactingConditionId` rendered as a Next.js Link to `/conditions/{id}`. Blue text.
- **Description text**.
- **Combined timing** (if `combinedTimingGuidance` present): rendered via existing `GAWindowBadge` or as monospace text.

### Teaching Mode
Adds interpretation row explaining the clinical rationale for the interaction and how combined risk is calculated.

## 5. Key Evidence Sources

### Component
`EvidenceSourcesSection` — renders `condition.keyEvidenceSources: KeyEvidenceSource[]`.

### Card View (default)
Cards in a flex-wrap grid (2 columns on desktop, 1 on mobile). Each card:
- **Type badge**: colored per EBM pyramid color system (Section 5.1).
- **Source name**: bold, 12px.
- **Metadata line**: "Est. {yearStarted} · {region}".
- **External link** (`↗`): if `url` present, opens in new tab.

### Compact List Toggle
Header contains two small icon buttons (▦ card / ≡ list). List view renders inline: type badge + name + year, separated by `·`, wrapped in a flex row.

View preference persisted in localStorage.

### Teaching Mode
Both views expand to show the full `description` text below each source's metadata. Card view adds the description as a paragraph. List view expands each item into a mini card.

### 5.1 Evidence Source Type Color System

Colors map to the EBM evidence pyramid, weakest→strongest. White text on all badges.

| # | Type | Base Color | Light (weaker) | Dark (stronger) | Pyramid Band |
|---|------|-----------|-----------------|-----------------|--------------|
| 1 | `guideline_derived` | `#8b8b8b` | `#ababab` | `#6b6b6b` | Background/Expert Opinion |
| 2 | `case_series` | `#d4834a` | `#e8a472` | `#b86830` | Case Series/Studies |
| 3 | `protocol` | `#b5445a` | `#cf6a7e` | `#8e2e42` | Non-Randomized Controlled |
| 4 | `cohort` | `#2a8a6e` | `#4aad8e` | `#1a6b52` | Cohort Studies |
| 5 | `surveillance` | `#2e6bbf` | `#5a8fd4` | `#1e4f96` | Systematic Monitoring |
| 6 | `registry` | `#5b3db5` | `#7b5ecf` | `#42298e` | Population Registries |

Intensity (light/base/dark) within each type is determined by the source's relative strength — currently all sources use base color. Intensity variation is a future enhancement when a `strength` field is added to `KeyEvidenceSource`.

Colors are defined as CSS custom properties in `globals.css` using oklch format (matching existing design system convention):

```css
/* :root (light mode) */
--evidence-source-guideline: oklch(0.61 0 0);           /* #8b8b8b */
--evidence-source-case-series: oklch(0.65 0.12 55);     /* #d4834a */
--evidence-source-protocol: oklch(0.48 0.14 10);        /* #b5445a */
--evidence-source-cohort: oklch(0.57 0.12 165);         /* #2a8a6e */
--evidence-source-surveillance: oklch(0.52 0.14 255);   /* #2e6bbf */
--evidence-source-registry: oklch(0.42 0.18 290);       /* #5b3db5 */

/* .dark (dark mode — slightly lighter for contrast on dark backgrounds) */
--evidence-source-guideline: oklch(0.70 0 0);
--evidence-source-case-series: oklch(0.72 0.12 55);
--evidence-source-protocol: oklch(0.58 0.14 10);
--evidence-source-cohort: oklch(0.65 0.12 165);
--evidence-source-surveillance: oklch(0.62 0.14 255);
--evidence-source-registry: oklch(0.55 0.18 290);
```

## 6. Landmark Trials Enhancement

### Changes to Existing Component
The existing landmark trials rendering in `ConditionDetail` is enhanced:

**Clinician mode additions:**
- Sample size badge after trial name: `n = {sampleSize.toLocaleString()}` in a small gray badge. Only rendered when `sampleSize` is defined.

**Teaching mode additions:**
- If `relevantRiskData` exists on the trial, render a "Trial Risk Data" mini-table below the key findings. Blue-tinted background (`#f0f7ff`), border `#dbeafe`. 3-column layout: Outcome, Measure, CI.
- Interpretation annotation below the mini-table explaining clinical significance.

## 7. Condition Card Enhancement

### Changes to `ConditionCard`
Add a muted text line as the last child inside `CardHeader` (below the badge row), since the card does not use `CardContent`:

```
3 risk outcomes · 1 trial · 2 evidence sources
```

- Font size: 11px, color: muted (`#aaa`).
- Only items with count > 0 are included. If all counts are 0, the line is omitted.
- Counts derived from: `condition.riskData.length`, `condition.landmarkTrials.length`, `condition.keyEvidenceSources.length`.

## 8. Teaching Mode Sub-Toggle

### New State
Add a `teachingExpanded` boolean to the `TeachingModeContext`:
- `false` (default) = hover-to-reveal interpretation rows.
- `true` = all interpretation rows expanded.
- Persisted in localStorage as `timingrx-teaching-expanded`.
- `teachingExpanded` is only meaningful when `teachingMode` is true. Its persisted value is preserved across teaching mode toggles (i.e., turning teaching mode off and on again restores the previous expanded preference).

### UI
A small toggle icon in the header of any teaching-mode-enhanced card (Risk Data, Risk Modifiers, Landmark Trials). Clicking toggles between hover and expanded for ALL sections simultaneously (single global setting, not per-section).

## 9. New Files

| File | Purpose |
|------|---------|
| `src/lib/utils/risk-format.ts` | `formatRiskStatistic()`, `generateTeachingInterpretation()`, severity color logic |
| `src/lib/utils/evidence-source-colors.ts` | Type→color map, CSS class helper |
| `src/components/condition/risk-data-table.tsx` | Risk Data table component |
| `src/components/condition/risk-modifiers-list.tsx` | Risk Modifiers bullet list |
| `src/components/condition/condition-interactions.tsx` | Interactions callout cards |
| `src/components/condition/evidence-sources-section.tsx` | Evidence Sources card/list |
| `src/components/condition/evidence-source-type-badge.tsx` | Reusable colored type badge |

## 10. Modified Files

| File | Changes |
|------|---------|
| `src/components/condition/condition-detail.tsx` | Import new components, reorder sections (Special Considerations moves from current position 5→10, Sub-variants 6→11, Landmark Trials 7→9), pass enriched data props |
| `src/components/condition/condition-card.tsx` | Add evidence summary underline text |
| `src/lib/hooks/use-teaching-mode.tsx` | Add `teachingExpanded` state + `toggleTeachingExpanded()` |
| `src/app/globals.css` | Add `--evidence-source-*` CSS custom properties |

## 11. Non-Goals

- **Risk calculator integration**: The risk data display is read-only. The interactive calculator is a separate feature.
- **Evidence source intensity variation**: All sources use base color for now. Intensity (light/dark within type) is deferred until a `strength` field exists on `KeyEvidenceSource`.
- **Sub-variant detail expansion**: Sub-variants continue to show only name + first recommendation. Full detail for sub-variants is a separate feature.
- **Mobile-specific layouts**: Components use responsive flex-wrap but no mobile-specific breakpoint designs in this iteration.
