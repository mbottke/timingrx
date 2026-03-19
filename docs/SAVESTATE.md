# TimingRx — Complete Project Savestate

**Date:** 2026-03-19
**Author:** Michael Bottke (Family Medicine Resident)
**Status:** Active development — Phases A & B complete, Phase C pending, deployment pending

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [What Has Been Built (Completed Work)](#4-what-has-been-built)
5. [Phase B — Interactive Explorer (COMPLETE)](#5-phase-b--interactive-explorer)
6. [Phase A — Animated Pipeline (COMPLETE)](#6-phase-a--animated-pipeline)
7. [Phase C — Timeline View (PLANNED, NOT STARTED)](#7-phase-c--timeline-view)
8. [Condition Database](#8-condition-database)
9. [Risk Engine & Confidence Scorer](#9-risk-engine--confidence-scorer)
10. [Test Suite](#10-test-suite)
11. [Design Specs & Plans (Document Inventory)](#11-design-specs--plans)
12. [Known Issues & Bugs Fixed](#12-known-issues--bugs-fixed)
13. [GitHub & Vercel Deployment (NOT STARTED)](#13-github--vercel-deployment)
14. [Remaining Work & Roadmap](#14-remaining-work--roadmap)
15. [File Inventory](#15-file-inventory)
16. [Key Design Decisions](#16-key-design-decisions)
17. [Risk Model Mathematics](#17-risk-model-mathematics)
18. [Commit History](#18-commit-history)

---

## 1. Project Overview

**TimingRx** is a comprehensive, evidence-based clinical decision support web application for obstetric delivery timing. It is the most complete open-source tool of its kind, covering:

- **201 obstetric conditions** across 24 categories with GA-specific delivery timing recommendations
- **Interactive risk calculator** using published epidemiologic data (Muglu 2019, n=15.4M) with multiplicative relative risk modeling
- **Novel confidence scorer** — no existing clinical risk calculator provides individual-level confidence scoring (5-component multiplicative formula calibrated against 10 clinical scenarios)
- **Glass-box transparency** — every calculation step is visible and explained
- **3-phase methodology visualization** (Explorer, Pipeline, Timeline) making abstract math viscerally tangible
- **Teaching mode** with physiology explanations grounded in research data

**Target audience:** Residents, attendings, and OB providers in clinical decision-making and education.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.0 |
| Language | TypeScript (strict) | ^5 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | ^4 |
| Component Library | shadcn/ui | ^4.0.8 |
| Charts | Recharts | ^3.8.0 |
| Search | FlexSearch | ^0.8.212 |
| Command Palette | cmdk | ^1.1.1 |
| Animations | framer-motion | ^12.38.0 |
| Icons | lucide-react | ^0.577.0 |
| Testing | Vitest + @testing-library/react | ^4.1.0 / ^16.3.2 |
| Rendering | SSG (207 pages pre-rendered at build time) | — |
| Data Layer | Static TypeScript files (no database) | — |

**No backend.** All data is compiled into the JavaScript bundle at build time.

---

## 3. Architecture Overview

```
src/
  app/                          # Next.js App Router pages
    page.tsx                    # Home page
    calculator/page.tsx         # Risk calculator
    conditions/page.tsx         # Condition browser
    conditions/[slug]/page.tsx  # 197+ condition detail pages (SSG)
    methodology/page.tsx        # Server component shell → MethodologyPageContent
    compare/page.tsx            # Multi-condition comparison
    evidence/page.tsx           # Evidence library
    about/page.tsx              # About page

  components/
    calculator/                 # Calculator UI (form, GA entry, glass-box, charts)
    charts/                     # Recharts wrappers (stillbirth risk curve)
    condition/                  # Condition cards, detail views, evidence badges
    layout/                     # Header, footer
    methodology/                # Phase B (6 sections) + Phase A (pipeline/)
      pipeline/                 # 10 files: SVG stages, Canvas particles, layout hook
    ui/                         # shadcn/ui components (18 files)

  data/
    conditions/                 # 24 category files + index.ts = 201 conditions
    risk-models/                # Muglu baseline, factor multipliers, interactions
    methodology/                # Factor color palette, pre-built scenarios
    guidelines/                 # Foundational principles
    physiologic/                # Physiologic risk data
    trials/                     # Landmark trial data
    types.ts                    # Core TypeScript interfaces

  lib/
    calculator/                 # Risk engine, confidence scorer, GA resolver, NNT, mortality index
    hooks/                      # useCalculator, useTeachingMode
    utils/                      # Citation formatting, GA math/formatting
```

### Server/Client Component Boundary

- **Server Components:** `page.tsx` files export `metadata` for SEO, render shells
- **Client Components:** Interactive content (`"use client"`) — calculator form, methodology visualizations, search
- **SSG:** All 207 pages pre-rendered at build time via `generateStaticParams()`

### Shared State Architecture

The methodology page uses a single `MethodologyProvider` context shared across ALL three tabs:

```
MethodologyProvider (shared state: ga, activeFactorIds, applyInteractions)
  └── MethodologyPageContent (client, manages tab state via URL params)
       ├── FactorToolbar (sticky, shared across tabs)
       ├── Tab: Explorer (Phase B) — 6 sections with SectionNav
       ├── Tab: Pipeline (Phase A) — SVG+Canvas animated visualization
       └── Tab: Timeline (Phase C) — placeholder "Coming Soon"
```

Toggling a factor in the toolbar updates whichever tab is active simultaneously.

---

## 4. What Has Been Built

### Completed Features

| Feature | Status | Commits |
|---------|--------|---------|
| Condition database (201 conditions, 24 categories) | COMPLETE | `24f8b9a` |
| Risk calculator engine (Muglu baseline × factor multipliers) | COMPLETE | `36cc07d` |
| Confidence scorer (5-component, calibrated against 10 scenarios) | COMPLETE | `36cc07d` |
| GA window resolver, NNT calculator, mortality index | COMPLETE | `33604cd` |
| UI foundation: all pages, condition browse/detail, search | COMPLETE | `2180771` |
| Calculator UI with interactive charts and glass-box display | COMPLETE | `f7ba868` |
| Phase B methodology spec | COMPLETE | `1f03675` |
| Phase B methodology plan (25 tasks) | COMPLETE | `9de6fe2` |
| Phase B implementation (all 25 tasks) | COMPLETE | `2b44419` |
| Phase A pipeline spec | COMPLETE | `ac7bcac` |
| Phase A pipeline plan (13 tasks) | COMPLETE | `26c6d08` |
| Phase A implementation (all 13 tasks) | COMPLETE | `b00687b` |
| Tabbed methodology page (Explorer/Pipeline/Timeline) | COMPLETE | `8c492c9` |
| 133 tests passing | COMPLETE | current |
| Production build (207 pages, SSG) | COMPLETE | current |

### Not Yet Started

| Feature | Status | Notes |
|---------|--------|-------|
| Phase C — Timeline visualization | NOT STARTED | Placeholder tab exists, spec needed |
| GitHub repository | NOT STARTED | No remote configured, all work is local |
| Vercel deployment | NOT STARTED | Depends on GitHub |
| Condition database formal accuracy review | NOT STARTED | 201 conditions entered, not formally verified |

---

## 5. Phase B — Interactive Explorer (COMPLETE)

### Spec
`docs/superpowers/specs/2026-03-19-methodology-page-design.md`

### Plan
`docs/superpowers/plans/2026-03-19-methodology-page.md` (25 tasks across 5 chunks)

### What It Is
A dual-track educational page explaining how TimingRx's risk calculation works:
- **Left column (55%):** Animated visualizations (charts, gauges, diagrams)
- **Right column (45%):** Live formula breakdowns with color-coded numbers
- **Sticky factor toolbar** at top drives both tracks simultaneously

### 6 Sections

| # | Section | Visual Track | Math Track |
|---|---------|-------------|------------|
| 1 | Muglu Baseline Curve | Animated Recharts curve with CI band, risk zones | Prospective stillbirth risk formula, data table, Muglu source |
| 2 | Factor Multiplication | Layered risk curves with ghost/solidify animations | Step-by-step cascading multiplication with animated numbers |
| 3 | CI Propagation | CI band expansion with per-factor variance stripes | Log-scale quadrature formula (GUM standard), variance bars |
| 4 | Confidence Scorer | 5 vertical animated gauges (EQ, MV, IP, MP, RP) | 5 formula boxes with live values, multiplication chain |
| 5 | OR→RR Correction | Zhang & Yu divergence visualization, threshold meter | Correction formula, divergence table |
| 6 | Grade Mapping | Horizontal grade bar with animated pointer | Grade definitions table, scenario showcase strip |

### Shared Components Built
- `animated-number.tsx` — framer-motion spring counting
- `formula-block.tsx` — styled formula display with FormulaLine
- `teaching-callout.tsx` — expandable educational callouts (insight/warning/note)
- `confidence-gauges.tsx` — 5 vertical animated bars
- `scenario-strip.tsx` — 6 pre-built scenarios (baseline → maximum complexity)
- `mobile-track-tabs.tsx` — Visual/Math tab switcher for <1024px
- `section-nav.tsx` — scroll-spy dot navigation
- `factor-toolbar.tsx` — sticky GA selector + factor toggle pills + interactions toggle

### Responsive Design
- ≥1024px: Full dual-track, side-by-side
- 768-1023px: Tabbed (Visual / Math), factor toolbar as scroll strip
- <768px: Tabbed, simplified factor toolbar (icon-only), vertical section nav hidden

---

## 6. Phase A — Animated Pipeline (COMPLETE)

### Spec
`docs/superpowers/specs/2026-03-19-methodology-phase-a-pipeline-design.md`

### Plan
`docs/superpowers/plans/2026-03-19-methodology-phase-a-pipeline.md` (13 tasks across 4 chunks)

### What It Is
An animated SVG pipeline showing the risk calculation as a top-to-bottom data flow. Particles carry risk values through stages, making abstract math viscerally tangible.

### Pipeline Stages (top to bottom)

```
┌──────────────┐
│  MUGLU INPUT │  ← Muglu 2019 baseline risk at selected GA
│   0.40/1,000 │
└──────┬───────┘
       │
┌──────┴───────┐
│  × Age ≥40   │  ← Multiplier gates (1 per active factor)
└──────┬───────┘
       │
┌──────┴───────┐
│ CI EXPANSION │  ← Uncertainty chamber (CI width visualization)
└──────┬───────┘
       │
  ┌───┬───┬──┴──┬───┬───┐
  │EQ │MV │ IP  │MP │RP │  ← 5 parallel confidence filters
  └───┴───┴──┬──┴───┴───┘
       │
┌──────┴───────┐
│  GRADE: B    │  ← Final output with OR correction badge
│  1.58/1,000  │
└──────────────┘
```

### 10 Component Files

| File | Responsibility |
|------|---------------|
| `pipeline-types.ts` | StageType, StageLayout, Particle, PipeSegment interfaces |
| `pipeline-utils.ts` | hexToRgb (hex+rgb), lerpColor, gradeToColor, FILTER_CONFIG |
| `use-pipeline-layout.ts` | Pure `computePipelineLayout()` + React hook wrapper |
| `pipeline-view.tsx` | Main container: SVG + Canvas layers, error guard, responsive |
| `pipeline-stage.tsx` | MugluNode, GateNode, CINode, OutputNode SVG components |
| `pipeline-filters.tsx` | 5 animated columns with fill levels + warning pulse |
| `pipeline-pipes.tsx` | SVG animated dash flow paths between stages |
| `particle-system.tsx` | Canvas RAF loop, 30 max particles, trails+glow, reduced-motion dots |
| `pipeline-hover-card.tsx` | Stage-specific popovers on hover/focus |
| `pipeline-mobile.tsx` | Card-based fallback for <768px |

### Particle System Properties

| Property | Baseline (0 factors) | High risk (5+ factors) |
|----------|---------------------|----------------------|
| Speed | 60 px/s | 200 px/s (capped 250) |
| Spawn rate | 1 per 800ms | 1 per 200ms |
| Size | 6px | 8px |
| Color | slate-400 (#94a3b8) | Warms through pipeline to grade color |
| Trail length | 15px | 30px |
| Glow radius | 2px | 4px |

### Key Technical Details
- **Particle color blending:** RGB linear interpolation, 30% blend per gate, `hexToRgb` handles both `#hex` and `rgb(r,g,b)` formats
- **Canvas + SVG layering:** Both absolutely positioned in a relative container, sharing coordinates via `usePipelineLayout`
- **Performance:** `requestAnimationFrame` loop capped at 60fps, max 30 particles, pauses when tab hidden
- **Reduced motion:** Static dots at stage centers, no particle animation, all values still update reactively
- **Error handling:** Invalid context values → renders Muglu + output only with error message
- **Click-through:** Clicking any stage switches to Explorer tab and scrolls to the corresponding section

---

## 7. Phase C — Timeline View (PLANNED, NOT STARTED)

### Current State
- A placeholder tab exists in the methodology page ("Timeline" tab)
- Renders: "Coming Soon — The Timeline view will provide an anatomical visualization of delivery timing."
- **No spec has been written yet**
- **No plan has been written yet**

### Intended Concept (from brainstorming session)
Phase C was discussed as an **anatomical/conceptual timeline visualization** that would:
- Show delivery timing as a gestational age timeline (37w → 42w)
- Use **metaphorical/anatomical** imagery rather than pure mathematics
- Include a clear **disclaimer** distinguishing it from the mathematical rigor of Phases A & B
- Render BELOW the Phase A pipeline content (third tab)
- Share the same `MethodologyContext` state so factor toolbar updates it too

### What Needs to Happen Before Phase C
1. **Brainstorming session** — full spec design through the superpowers:brainstorming skill
2. **Spec document** — `docs/superpowers/specs/YYYY-MM-DD-methodology-phase-c-timeline-design.md`
3. **Spec review loop** — automated reviewer + user approval
4. **Plan document** — `docs/superpowers/plans/YYYY-MM-DD-methodology-phase-c-timeline.md`
5. **Plan review loop** — automated reviewer
6. **Implementation** — via subagent-driven-development

### Design Constraints Known So Far
- Must integrate with existing `MethodologyProvider` context
- Must respect the tabbed architecture (`methodology-page-content.tsx` already handles 3 tabs)
- URL param: `?view=timeline`
- Should include a disclaimer that this visualization is conceptual, not mathematically precise like Phases A & B

---

## 8. Condition Database

### Scale
- **201 conditions** across **24 category files**
- **8,764 total lines** of TypeScript condition data
- Each condition includes: id, name, category, tags, GA windows, guideline recommendations, citations, evidence grades, physiology explanations, pastFortyWeeks status

### Categories (24 files)

| File | Count | Examples |
|------|-------|---------|
| age-demographics.ts | 7 | AMA ≥35, AMA ≥40, AMA ≥45 |
| autoimmune.ts | 8 | SLE, APS, RA, scleroderma |
| cardiac-aortopathy.ts | 6 | Marfan, Loeys-Dietz, bicuspid aortic valve |
| cardiac-complex.ts | 6 | Fontan, Eisenmenger, mechanical valves |
| cardiac-valvular.ts | 6 | Mitral stenosis, aortic stenosis |
| diabetes.ts | 7 | GDM (diet/insulin), pregestational DM1/DM2 |
| endocrine.ts | 7 | Thyroid disorders, Cushing's, pheochromocytoma |
| fetal-cardiac.ts | 3 | Fetal heart block, SVT, structural cardiac |
| fetal-growth-fluid.ts | 16 | FGR, macrosomia, oligohydramnios, polyhydramnios |
| fetal-structural.ts | 10 | Neural tube defects, CDH, gastroschisis |
| hematologic.ts | 10 | Sickle cell, thrombocytopenia, VTE |
| hepatic.ts | 11 | ICP, HELLP, acute fatty liver |
| hypertensive.ts | 11 | Chronic HTN, preeclampsia (all subtypes) |
| infectious.ts | 14 | HIV, HBV, HCV, HSV, CMV, Zika |
| miscellaneous.ts | 7 | Peripartum cardiomyopathy, bariatric surgery |
| multiple-gestation.ts | 11 | DCDA, MCDA, MCMA twins; triplets |
| neurologic.ts | 10 | Epilepsy, MS, myasthenia gravis, stroke |
| obesity.ts | 6 | BMI 30-34.9 through BMI ≥50 |
| placental-uterine.ts | 12 | Placenta previa, accreta, vasa previa, uterine anomalies |
| prior-obstetric.ts | 12 | Prior cesarean (1-3+), prior stillbirth, prior preterm |
| pulmonary.ts | 5 | Asthma, CF, pulmonary HTN |
| renal.ts | 6 | CKD stages, dialysis, renal transplant |
| substance-psychiatric.ts | 6 | OUD/MAT, severe psychiatric illness |
| surgical.ts | 4 | Prior myomectomy, cervical cerclage |

### Data Source Citations
Primary guideline sources referenced across conditions:
- ACOG (Practice Bulletins, Committee Opinions, CO 700, CO 764, CO 828)
- SMFM (Consults, Statements)
- NICE guidelines
- WHO recommendations
- ESC (cardiovascular)
- KDIGO (renal)
- Cochrane systematic reviews
- Landmark trials (ARRIVE, Hannah, SWEPIS, INDEX, Alkmark IPD MA)

---

## 9. Risk Engine & Confidence Scorer

### Risk Engine (`src/lib/calculator/risk-engine.ts` — 218 lines)

**Baseline:** Muglu et al. 2019 meta-analysis (PLOS Medicine, n=15,458,874)
- Prospective stillbirth risk per 1,000 ongoing pregnancies
- Data points: 37w=0.11, 38w=0.21, 39w=0.40, 40w=0.69, 41w=1.30, 42w=3.18

**Multiplicative Model:**
```
Adjusted Risk = Baseline × aOR₁ × aOR₂ × ... × aORₙ × interaction_adjustments
```

**13 Risk Factor Multipliers** (`src/data/risk-models/risk-factor-multipliers.ts` — 201 lines):

| Factor | aOR | Source |
|--------|-----|--------|
| age_35_39 | 1.32 | Published aOR |
| age_gte_40 | 1.88 | Published aOR |
| age_gte_45 | 2.75 | Published aOR |
| bmi_30_34 | 1.6 | Published aOR |
| bmi_35_39 | 2.1 | Published aOR |
| bmi_gte_40 | 3.0 | Published aOR |
| preexisting_diabetes | 2.9 | Published aOR |
| chronic_hypertension | 2.4 | Published aOR |
| sga_fetus | 3.5 | Published aOR |
| prior_stillbirth | 3.0 | Published aOR |
| nulliparity | 1.3 | Published aOR |
| smoking | 1.6 | Published aOR |
| black_race | 2.2 | Published aOR |

**5 Hypothesized Interactions** (`src/data/risk-models/hypothesized-interactions.ts` — 58 lines):
- DM + BMI≥40: ×0.85 (sub-multiplicative)
- DM + BMI 35-39: ×0.88
- HTN + DM: ×0.90
- Age≥40 + prior stillbirth: ×1.10 (supra-multiplicative)
- SGA + HTN: ×0.80

**CI Propagation:** Log-scale quadrature (GUM international standard, JCGM 100:2008)
```
Var(ln(RR_combined)) = Σ Var(ln(RR_i))
where Var(ln(RR_i)) = [(ln(U_i) - ln(L_i)) / (2 × 1.96)]²
```

**Zhang & Yu (1998) Correction:** Applied when combined adjusted risk ≥1% AND combinedMultiplier > 1
```
RR_corrected = OR / [(1 - P₀) + (P₀ × OR)]
```

### Confidence Scorer (`src/lib/calculator/confidence-scorer.ts` — 191 lines)

**Novel 5-component multiplicative formula:**
```
Score = 100 × EQ × MV × IP × MP × RP
```

| Component | Formula | What It Measures |
|-----------|---------|-----------------|
| **EQ** (Evidence Quality) | `(R_baseline + ΣR_i) / (1+n)`, R_baseline=0.95 | Average data reliability across all included factors |
| **MV** (Model Validity) | `max(0.40, 1.0 - 0.03n - 0.005n²)` | Independence assumption validity as factors accumulate |
| **IP** (Interaction Penalty) | `max(0.75, 1.0 - 0.05H - 0.02P)` | Penalty for hypothesized (H) and published (P) interactions |
| **MP** (Magnitude Plausibility) | Stepwise by combined multiplier | Whether the combined risk magnitude is clinically plausible |
| **RP** (Rare-Disease Validity) | Stepwise by adjusted risk proportion | OR→RR divergence when risk is no longer "rare" |

**Grade Mapping:**
| Grade | Score Range | Label |
|-------|-----------|-------|
| A | ≥85 | High confidence |
| B | 70-84 | Moderate confidence |
| C | 55-69 | Limited confidence |
| D | 40-54 | Low confidence |
| F | <40 | Very low confidence |

**Calibration:** Calibrated against 10 realistic clinical scenarios to ensure grades align with clinical intuition (detailed in spec).

---

## 10. Test Suite

### Current State: 133 tests passing across 11 test files

| Test File | Tests | What It Covers |
|-----------|-------|---------------|
| `risk-engine.test.ts` | ~30 | Baseline interpolation, CI propagation, Zhang & Yu correction, risk curve calculation |
| `confidence-scorer.test.ts` | ~25 | 5-component scoring, grade mapping, edge cases, 10-scenario calibration |
| `conditions-integrity.test.ts` | 9 | All 201 conditions have required fields, valid GA ranges, valid citations |
| `risk-data-valid.test.ts` | ~10 | Factor multipliers valid, baseline data valid, interaction data valid |
| `methodology-provider.test.tsx` | ~15 | Context state, derived computations, scenario loading, interaction toggling |
| `animated-number.test.tsx` | 5 | Renders target value, className, suffix, decimal formatting, zero |
| `pipeline-utils.test.ts` | ~10 | hexToRgb (hex+rgb), lerpColor, gradeToColor |
| `use-pipeline-layout.test.ts` | ~10 | computePipelineLayout coordinates, stage counts, responsive widths |
| `ga-format.test.ts` | ~5 | GA day formatting (e.g., 273 → "39w0d") |
| `ga-math.test.ts` | ~5 | GA arithmetic utilities |
| `citation-format.test.ts` | 5 | Citation string formatting |

### Test Framework
- Vitest ^4.1.0 with jsdom environment
- @testing-library/react ^16.3.2 for component tests
- Run: `pnpm vitest run` (completes in ~1.8s)

---

## 11. Design Specs & Plans (Document Inventory)

All documents live under `docs/superpowers/`:

### Specs (Approved Designs)

| File | Phase | Status |
|------|-------|--------|
| `specs/2026-03-19-methodology-page-design.md` | Phase B | APPROVED, IMPLEMENTED |
| `specs/2026-03-19-methodology-phase-a-pipeline-design.md` | Phase A | APPROVED, IMPLEMENTED |

### Plans (Implementation Guides)

| File | Phase | Tasks | Status |
|------|-------|-------|--------|
| `plans/2026-03-19-methodology-page.md` | Phase B | 25 tasks, 5 chunks | ALL COMPLETE |
| `plans/2026-03-19-methodology-phase-a-pipeline.md` | Phase A | 13 tasks, 4 chunks | ALL COMPLETE |

### Documents NOT Yet Created
- Phase C timeline spec — needs brainstorming session first
- Phase C timeline plan — depends on spec
- Deployment documentation — not started

---

## 12. Known Issues & Bugs Fixed

### Fixed Issues (Historical)

| Issue | Cause | Fix | Commit |
|-------|-------|-----|--------|
| Console error: `<script>` tag in SliderThumb | @base-ui/react Slider injected a script tag during hydration | Replaced with custom native `<input type="range">` + visual overlay | Part of calculator chunk |
| Chart labels cut off | "ACOG: offer induction" and "Never beyond 42w" clipping at edges | Increased margins, repositioned labels | Part of calculator chunk |
| Slow page loads in dev mode | Each route compiled on-demand | Run production build (`pnpm build`) for SSG | Ongoing |
| TypeScript case mismatch | `SectionOrCorrection` vs `SectionORCorrection` import | Matched actual export name | Part of Phase B assembly |
| Stale `.next/types` files | `routes.d 2.ts` causing TS2300 duplicate identifier | Deleted stale files | Part of Phase B |
| `lerpColor` crash with rgb() strings | `hexToRgb` only parsed hex, but lerpColor output `rgb(r,g,b)` | Made `hexToRgb` parse both `#hex` and `rgb(r,g,b)` via regex | Part of Phase A |
| Production server exits | Background `pnpm start` killed | Use `nohup pnpm start > /dev/null 2>&1 &` | Runtime fix |
| Internal server error | Stale build didn't include Phase A components | Fresh `pnpm build` + server restart | `b00687b` → rebuild |

### Current Known Issues
- **Recharts width warning:** "The width(-1) and height(-1) of chart should be greater than 0" — appears during SSG build. Non-fatal, cosmetic warning only. Charts render correctly in browser.
- **No remote repository:** All work is local on `main` branch. Risk of data loss if not backed up.

---

## 13. GitHub & Vercel Deployment (NOT STARTED)

### Current State
- **Git:** Local repository on `main` branch, no remote configured
- **GitHub:** No repository created
- **Vercel:** No project created

### What Needs to Happen

#### Step 1: GitHub Repository
```bash
# Create repo (public or private TBD by user)
gh repo create timingrx --private --source=. --push
# OR
gh repo create timingrx --public --source=. --push
```

#### Step 2: Vercel Project
```bash
# Install Vercel CLI if not already
npm i -g vercel

# Link project
vercel link

# Deploy
vercel --prod
```

#### Step 3: Configuration
- **Build command:** `pnpm build` (already produces static output)
- **Output:** `.next/` directory (Next.js default)
- **Node version:** 20+ (for Next.js 16 compatibility)
- **Environment variables:** None required (all data is static)
- **Domain:** Custom domain TBD

#### Step 4: CI/CD (Optional)
- GitHub Actions for automated testing on PR
- Vercel auto-deploys on push to main

### Considerations
- The app is **fully static** (SSG) — no server-side runtime needed
- All 207 pages pre-render at build time in ~3.5 seconds
- No API routes, no database, no secrets
- Total source size: ~1.1MB (excluding node_modules)
- The app could also be deployed as a static export (`next export`) if Vercel is not desired

---

## 14. Remaining Work & Roadmap

### High Priority
1. **GitHub + Vercel deployment** — eliminate single-point-of-failure (local only)
2. **Phase C Timeline visualization** — complete the 3-phase methodology trifecta
3. **Condition database accuracy review** — systematic verification of all 201 conditions against source guidelines

### Medium Priority
4. **Visual polish pass** — responsive edge cases, animation refinements
5. **Accessibility audit** — screen reader testing, keyboard navigation verification
6. **Performance profiling** — ensure all pages load in <500ms interactive
7. **SEO optimization** — meta tags, Open Graph, structured data for medical content

### Lower Priority
8. **Teaching mode toggle** — global toggle that shows/hides physiology explanations
9. **Multi-condition comparison enhancement** — overlay multiple condition GA windows
10. **PDF export** — printable summary of calculator results for clinical use
11. **PWA support** — offline access for clinical environments with poor connectivity
12. **Analytics** — usage tracking for most-searched conditions

### Phase C Sequence (When Ready)
1. Invoke `superpowers:brainstorming` with Phase C concept
2. Design through Q&A → spec document
3. Spec review loop → user approval
4. Invoke `superpowers:writing-plans` → implementation plan
5. Plan review loop
6. Invoke `superpowers:subagent-driven-development` → execute
7. Final review → merge

---

## 15. File Inventory

### Source Files
- **125 TypeScript/TSX files** total
- **11 test files** with 133 tests
- **24 condition data files** (8,764 lines)
- **27 methodology component files** (Phase B: 17, Phase A pipeline: 10)
- **18 shadcn/ui component files**
- **5 core engine files** (696 lines: risk engine, confidence scorer, multipliers, baseline, interactions)

### Documentation
- **4 spec/plan documents** in `docs/superpowers/`
- **3 memory files** in `.claude/projects/.../memory/`

### Key File Sizes
| File | Lines | Purpose |
|------|-------|---------|
| `risk-engine.ts` | 218 | Core risk calculation engine |
| `confidence-scorer.ts` | 191 | 5-component confidence scoring |
| `risk-factor-multipliers.ts` | 201 | 13 factor definitions with sources |
| `hypothesized-interactions.ts` | 58 | 5 interaction adjustments |
| `baseline-stillbirth.ts` | 28 | Muglu 2019 baseline curve |
| `types.ts` | ~150 | Core TypeScript interfaces |

---

## 16. Key Design Decisions

These decisions were made during the initial brainstorming session and are documented in memory:

1. **Glass Box transparency** — show every calculation step, not just the output
2. **Comprehensive + Bayesian** — include hypothesized interactions clearly labeled, with user control
3. **Multiplicative OR model** — standard approach used by Framingham and FMF preeclampsia screener
4. **Novel confidence scorer** — no existing clinical calculator does this
5. **Static data, no database** — all data compiled into JS bundle for maximum performance
6. **SSG for all pages** — instant navigation, works offline
7. **3-phase methodology** — Explorer (educational), Pipeline (visceral), Timeline (conceptual)
8. **All 201 conditions before launch** — completeness is a core value proposition
9. **Teaching mode** — toggleable physiology explanations for education
10. **framer-motion for animations** — GPU-accelerated, respects reduced-motion preference
11. **Recharts for charts** — already in the ecosystem, good React integration
12. **shadcn/ui component library** — accessible, customizable, well-maintained

---

## 17. Risk Model Mathematics

### Core Formula
```
Adjusted Risk(GA) = Baseline(GA) × Π(aOR_i) × Π(interaction_j)
```

### CI Propagation (GUM Standard)
```
Var(ln(RR_combined)) = Var(ln(RR_baseline)) + Σ Var(ln(aOR_i))

where Var(ln(RR_i)) = [(ln(U_i) - ln(L_i)) / (2 × 1.96)]²

95% CI = exp[ln(adjusted_risk) ± 1.96 × √(Var_combined)]
```

### Zhang & Yu OR→RR Correction
Applied when combined risk ≥1% and combined multiplier >1:
```
RR = OR / [(1 - P₀) + (P₀ × OR)]
where P₀ = baseline risk as proportion
```

### Confidence Score
```
Score = 100 × EQ × MV × IP × MP × RP

EQ = (R_baseline + ΣR_i) / (1 + n)     [R_baseline = 0.95]
MV = max(0.40, 1.0 - 0.03n - 0.005n²)
IP = max(0.75, 1.0 - 0.05H - 0.02P)
MP = stepwise(combined_multiplier)       [thresholds: 5, 10, 20, 50]
RP = stepwise(adjusted_risk_proportion)  [thresholds: 1%, 5%, 10%, 20%]
```

---

## 18. Commit History

Full chronological history (oldest → newest):

```
24f8b9a feat: complete all condition data files — 201 conditions across 24 categories
36cc07d feat: add risk calculator engine and confidence scorer with full TDD
33604cd feat: complete Chunk 3 — GA window resolver, NNT calculator, mortality index
2180771 feat: complete Chunk 4 — UI foundation, all pages, condition browse/detail
f7ba868 feat: complete Chunk 5 — calculator UI with interactive charts and glass-box display
1f03675 Add methodology visualization page design spec
9de6fe2 Update methodology implementation plan — address all review issues
2f0b63b chore: add framer-motion for methodology page animations
a89ed31 feat(methodology): add factor color palette data
eb5b160 feat(methodology): add pre-built scenario definitions
c5b632c feat(methodology): add MethodologyContext provider with tests
eec5412 feat(methodology): add AnimatedNumber component with tests
ba63ba9 feat(methodology): add FormulaBlock and TeachingCallout components
317c20b feat(nav): add Methodology link to header navigation
4458d46 feat(methodology): implement Task 10 — SectionBaseline component
a7551c9 feat(methodology): add FactorToolbar sticky toolbar (Task 8)
7a81a72 feat(methodology): add SectionNav dot navigation with scroll spy (Task 9)
404e3fe feat(methodology): implement Task 11 — SectionMultiplication component
c6d49a2 feat(methodology): implement Task 12 — SectionCIPropagation component
17f878a feat(methodology): Task 13 — ConfidenceGauges component
6ffffb2 feat(methodology): Task 14 — SectionConfidence (Section 4)
9246a78 feat(methodology): Task 15 — SectionOrCorrection (Section 5)
71f6936 feat(methodology): Task 16 — ScenarioStrip + SectionGradeMapping (Section 6)
ddcb57b feat(methodology): assemble full methodology page with all 6 sections
2b44419 fix(methodology): mobile tabs, reduced motion, a11y, CI band, grade alignment
ac7bcac Add Phase A pipeline view design spec
26c6d08 Add Phase A pipeline implementation plan
26afa19 feat(pipeline): Task 1 — pipeline types, utilities, and tests
dd3d90a feat(methodology): Task 2 — MethodologyTabs component
8c492c9 feat(methodology): Task 3 — MethodologyPageContent client shell + page.tsx refactor
14394d2 feat(pipeline): Task 4 — usePipelineLayout hook + pure computePipelineLayout with tests
f6980d4 feat(pipeline): Task 5 — PipelineStage SVG component
2e1a56d feat(pipeline): Task 6 — PipelineFilters component
6365072 feat(pipeline): Task 7 — PipelinePipes component
22e6e6c feat(pipeline): Task 8 — canvas particle system
93282db feat(pipeline): Task 9 — pipeline hover card
4af7e93 feat(pipeline): Task 10 — mobile card fallback
ede6ed4 feat(pipeline): Task 11 — pipeline view container
f13ea7e feat(pipeline): Task 12 — wire PipelineView into page content
b00687b fix(pipeline): add annotations, error states, CI details, responsive polish
```

**Total: 37 commits on `main` branch**

---

## Quick Resume Instructions

To resume development in a new session:

1. **Read this file** — `docs/SAVESTATE.md`
2. **Check current state:**
   ```bash
   cd "/Users/michaelbottke/Desktop/Family Medicine Residency/Lectures/Post-Dates Risks and Management/timingrx"
   pnpm vitest run          # Should show 133 passing
   pnpm build               # Should produce 207 pages
   pnpm start               # Starts production server on :3000
   ```
3. **For Phase C:** Start with `superpowers:brainstorming` skill
4. **For deployment:** See Section 13 above
5. **For any new feature:** Follow the superpowers workflow: brainstorm → spec → plan → execute

---

*This savestate was generated on 2026-03-19. The production server was last verified running with all routes returning 200 OK.*
