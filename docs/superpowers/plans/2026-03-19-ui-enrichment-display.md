# UI Enrichment Display — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 5 new React components and 2 utilities to surface enriched clinical data (riskData, keyEvidenceSources, riskModifiers, interactions) on condition detail pages and condition cards, with dual-mode teaching rendering.

**Architecture:** Pure utility functions (`formatRiskStatistic`, `generateTeachingInterpretation`, severity color logic, evidence source color maps) are built and tested first, then consumed by new components (`RiskDataTable`, `RiskModifiersList`, `ConditionInteractions`, `EvidenceSourcesSection`, `EvidenceSourceTypeBadge`). Existing `useTeachingMode` hook gains a `teachingExpanded` sub-toggle. Finally, `ConditionDetail` is restructured to wire in all new sections, and `ConditionCard` gains a summary line.

**Tech Stack:** React 19, Next.js (app router, SSG), TypeScript strict, Tailwind CSS, shadcn/ui, Vitest + @testing-library/react, pnpm.

**Spec:** `docs/superpowers/specs/2026-03-19-ui-enrichment-display-design.md`

---

## Key Patterns in This Codebase

Implementers MUST follow these existing patterns:

1. **Imports use `@/` path alias** — e.g., `import { formatCitation } from "@/lib/utils/citation-format"`
2. **Tests live in `src/__tests__/`** mirroring the `src/` directory structure — e.g., `src/lib/utils/citation-format.ts` → `src/__tests__/lib/utils/citation-format.test.ts`
3. **Vitest** is the test runner (`pnpm test`). Tests import `{ describe, it, expect }` from `"vitest"`. Component tests additionally import `{ render, screen }` from `"@testing-library/react"`. The setup file at `src/__tests__/setup.ts` imports `@testing-library/jest-dom/vitest`.
4. **shadcn/ui components** are at `src/components/ui/` — available: `badge`, `button`, `card`, `separator`, `table`, `tabs`, `toggle`, `tooltip`, `switch`.
5. **CSS custom properties** use oklch format in `globals.css` under `:root` (light) and `.dark` (dark).
6. **Client components** that use hooks start with `"use client"` directive.
7. **Badge color pattern**: `className="bg-[var(--token-name)] text-white"` (see `evidence-grade-badge.tsx`).
8. **TypeScript types** are imported as `import type { ... }` from `"@/data/types"`.
9. **Build check**: `pnpm build` (Next.js SSG — compiles all 198+ condition pages).
10. **AGENTS.md warning**: Next.js APIs may differ from training data. Read `node_modules/next/dist/docs/` guides before using unfamiliar Next.js APIs.

---

## File Map

### New Files (7 source + 7 test)

| File | Responsibility |
|------|---------------|
| `src/lib/utils/risk-format.ts` | `formatRiskStatistic()`, `generateTeachingInterpretation()`, `getRiskSeverity()` |
| `src/lib/utils/evidence-source-colors.ts` | `EvidenceSourceType` → CSS class map, `getEvidenceSourceColor()` helper |
| `src/components/condition/evidence-source-type-badge.tsx` | Reusable colored type badge |
| `src/components/condition/risk-data-table.tsx` | Risk Data table with teaching hover/expanded |
| `src/components/condition/risk-modifiers-list.tsx` | Risk Modifiers bullet list |
| `src/components/condition/condition-interactions.tsx` | Interactions amber callout cards |
| `src/components/condition/evidence-sources-section.tsx` | Evidence Sources card/list with view toggle |
| `src/__tests__/lib/utils/risk-format.test.ts` | Tests for all 5 stat types, severity, interpretations |
| `src/__tests__/lib/utils/evidence-source-colors.test.ts` | Tests for color mapping |
| `src/__tests__/lib/hooks/use-teaching-mode.test.tsx` | Tests for teachingExpanded addition |
| `src/__tests__/components/condition/evidence-source-type-badge.test.tsx` | Badge render tests |
| `src/__tests__/components/condition/risk-data-table.test.tsx` | Table render + teaching mode |
| `src/__tests__/components/condition/risk-modifiers-list.test.tsx` | List render tests |
| `src/__tests__/components/condition/evidence-sources-section.test.tsx` | Evidence sources card/list render tests |
| `src/__tests__/components/condition/condition-interactions.test.tsx` | Interaction card render tests |

### Modified Files (4)

| File | Changes |
|------|---------|
| `src/app/globals.css` | Add 6 `--evidence-source-*` oklch tokens in `:root` + `.dark` |
| `src/lib/hooks/use-teaching-mode.tsx` | Add `teachingExpanded` boolean + `toggleTeachingExpanded()` + localStorage |
| `src/components/condition/condition-detail.tsx` | Import 4 new components, reorder sections (5→10, 6→11, 7→9), pass data |
| `src/components/condition/condition-card.tsx` | Add evidence summary underline text |

---

## Chunk 1: Foundation — CSS Tokens + Utility Functions

### Task 1: Add Evidence Source CSS Custom Properties

**Files:**
- Modify: `src/app/globals.css:84-100` (`:root` medical tokens) and `:151` (`.dark` block end)

- [ ] **Step 1: Add light-mode tokens to `:root`**

In `src/app/globals.css`, after the existing `--confidence-f` line (line 99) and before the closing `}` of `:root`, add:

```css
  /* Evidence source type colors (EBM pyramid) */
  --evidence-source-guideline: oklch(0.61 0 0);
  --evidence-source-case-series: oklch(0.65 0.12 55);
  --evidence-source-protocol: oklch(0.48 0.14 10);
  --evidence-source-cohort: oklch(0.57 0.12 165);
  --evidence-source-surveillance: oklch(0.52 0.14 255);
  --evidence-source-registry: oklch(0.42 0.18 290);
```

- [ ] **Step 2: Add dark-mode tokens to `.dark`**

In `.dark`, after the existing `--confidence-f` line (line 150) and before the closing `}`, add:

```css
  /* Evidence source type colors (dark) */
  --evidence-source-guideline: oklch(0.70 0 0);
  --evidence-source-case-series: oklch(0.72 0.12 55);
  --evidence-source-protocol: oklch(0.58 0.14 10);
  --evidence-source-cohort: oklch(0.65 0.12 165);
  --evidence-source-surveillance: oklch(0.62 0.14 255);
  --evidence-source-registry: oklch(0.55 0.18 290);
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds (CSS is valid).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add evidence source type color tokens (oklch, light + dark)"
```

---

### Task 2: Create `risk-format.ts` Utility

**Files:**
- Create: `src/lib/utils/risk-format.ts`
- Create: `src/__tests__/lib/utils/risk-format.test.ts`

- [ ] **Step 1: Write failing tests for `formatRiskStatistic()`**

Create `src/__tests__/lib/utils/risk-format.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  formatRiskStatistic,
  getRiskSeverity,
  generateTeachingInterpretation,
} from "@/lib/utils/risk-format";
import type { RiskStatistic } from "@/data/types";

describe("formatRiskStatistic", () => {
  it("formats relative_risk", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 2.5 };
    expect(formatRiskStatistic(stat)).toBe("RR 2.5");
  });

  it("formats odds_ratio", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 1.8 };
    expect(formatRiskStatistic(stat)).toBe("OR 1.8");
  });

  it("formats absolute_risk", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 15 };
    expect(formatRiskStatistic(stat)).toBe("15 per 1,000");
  });

  it("formats incidence", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5.2 };
    expect(formatRiskStatistic(stat)).toBe("5.2%");
  });

  it("formats mortality_rate", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 0.3 };
    expect(formatRiskStatistic(stat)).toBe("0.3% mortality");
  });
});

describe("getRiskSeverity", () => {
  it("returns 'high' for RR >= 2.0", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 2.5 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for RR 1.5-2.0", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.7 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for RR < 1.5", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.2 };
    expect(getRiskSeverity(stat)).toBe("default");
  });

  it("returns 'high' for OR >= 2.0", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 3.0 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for OR 1.5-2.0", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 1.6 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'high' for incidence >= 10%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 15 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for incidence 2-10%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for incidence < 2%", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 1 };
    expect(getRiskSeverity(stat)).toBe("default");
  });

  it("returns 'high' for mortality >= 10%", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 12 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'high' for absolute_risk >= 100 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 150 };
    expect(getRiskSeverity(stat)).toBe("high");
  });

  it("returns 'moderate' for absolute_risk 20-100 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 50 };
    expect(getRiskSeverity(stat)).toBe("moderate");
  });

  it("returns 'default' for absolute_risk < 20 per 1000", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 10 };
    expect(getRiskSeverity(stat)).toBe("default");
  });
});

describe("generateTeachingInterpretation", () => {
  it("interprets relative_risk with CI", () => {
    const stat: RiskStatistic = {
      type: "relative_risk",
      value: 2.5,
      ci95: [1.8, 3.4],
    };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("2.5");
    expect(result).toContain("more likely");
    expect(result).toContain("1.8");
    expect(result).toContain("3.4");
  });

  it("interprets relative_risk without CI", () => {
    const stat: RiskStatistic = { type: "relative_risk", value: 1.5 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("1.5");
    expect(result).toContain("more likely");
    expect(result).not.toContain("confidence interval");
  });

  it("interprets odds_ratio", () => {
    const stat: RiskStatistic = { type: "odds_ratio", value: 3.0 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("3");
    expect(result).toContain("odds");
  });

  it("interprets absolute_risk with 1-in-N", () => {
    const stat: RiskStatistic = { type: "absolute_risk", valuePer1000: 10 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("10 per 1,000");
    expect(result).toContain("1 in 100");
  });

  it("interprets incidence with 1-in-N", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("5%");
    expect(result).toContain("1 in 20");
  });

  it("interprets mortality_rate", () => {
    const stat: RiskStatistic = { type: "mortality_rate", valuePercent: 2 };
    const result = generateTeachingInterpretation(stat);
    expect(result).toContain("2%");
    expect(result).toContain("Mortality");
  });

  it("appends populationDescription when provided", () => {
    const stat: RiskStatistic = { type: "incidence", valuePercent: 5 };
    const result = generateTeachingInterpretation(stat, "women with GDM");
    expect(result).toContain("women with GDM");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/lib/utils/risk-format.test.ts`
Expected: FAIL — module `@/lib/utils/risk-format` does not exist.

- [ ] **Step 3: Implement `risk-format.ts`**

Create `src/lib/utils/risk-format.ts`:

```typescript
import type { RiskStatistic } from "@/data/types";

/**
 * Formats a RiskStatistic discriminated union into a display string.
 *
 * relative_risk  → "RR {value}"
 * odds_ratio     → "OR {value}"
 * absolute_risk  → "{valuePer1000} per 1,000"
 * incidence      → "{valuePercent}%"
 * mortality_rate → "{valuePercent}% mortality"
 */
export function formatRiskStatistic(stat: RiskStatistic): string {
  switch (stat.type) {
    case "relative_risk":
      return `RR ${stat.value}`;
    case "odds_ratio":
      return `OR ${stat.value}`;
    case "absolute_risk":
      return `${stat.valuePer1000} per 1,000`;
    case "incidence":
      return `${stat.valuePercent}%`;
    case "mortality_rate":
      return `${stat.valuePercent}% mortality`;
  }
}

/**
 * Returns severity level for color-coding risk statistics.
 *
 * Thresholds:
 * - high: incidence/mortality ≥10%, RR/OR ≥2.0, absolute ≥100/1000
 * - moderate: incidence/mortality 2-10%, RR/OR 1.5-2.0, absolute 20-100/1000
 * - default: below those thresholds
 */
export type RiskSeverity = "high" | "moderate" | "default";

export function getRiskSeverity(stat: RiskStatistic): RiskSeverity {
  switch (stat.type) {
    case "relative_risk":
    case "odds_ratio": {
      const v = stat.value;
      if (v >= 2.0) return "high";
      if (v >= 1.5) return "moderate";
      return "default";
    }
    case "incidence":
    case "mortality_rate": {
      const v = stat.valuePercent;
      if (v >= 10) return "high";
      if (v >= 2) return "moderate";
      return "default";
    }
    case "absolute_risk": {
      const v = stat.valuePer1000;
      if (v >= 100) return "high";
      if (v >= 20) return "moderate";
      return "default";
    }
  }
}

/** CSS class for severity color. Uses existing --risk-high / --risk-moderate tokens. */
export function severityColorClass(severity: RiskSeverity): string {
  switch (severity) {
    case "high":
      return "text-[var(--risk-high)] font-semibold";
    case "moderate":
      return "text-[var(--risk-moderate)] font-semibold";
    case "default":
      return "";
  }
}

/**
 * Formats ci95 tuple as display string. Returns "—" if absent.
 * Only relative_risk, odds_ratio, and absolute_risk can have ci95.
 */
export function formatCI95(stat: RiskStatistic): string {
  if ("ci95" in stat && stat.ci95) {
    return `${stat.ci95[0]}–${stat.ci95[1]}`;
  }
  return "—";
}

/**
 * Generates a plain-English teaching interpretation for a risk statistic.
 * Appends populationDescription when provided.
 */
export function generateTeachingInterpretation(
  stat: RiskStatistic,
  populationDescription?: string,
): string {
  let text: string;

  switch (stat.type) {
    case "relative_risk": {
      text = `A relative risk of ${stat.value} means this outcome is ${stat.value}× more likely than in the reference population.`;
      if (stat.ci95) {
        text += ` The 95% confidence interval (${stat.ci95[0]}–${stat.ci95[1]}) indicates the true risk ratio likely falls within this range.`;
      }
      break;
    }
    case "odds_ratio": {
      text = `An odds ratio of ${stat.value} means ${stat.value}× the odds compared to unexposed.`;
      if (stat.ci95) {
        text += ` 95% CI: ${stat.ci95[0]}–${stat.ci95[1]}.`;
      }
      break;
    }
    case "absolute_risk": {
      const oneInN = Math.round(1000 / stat.valuePer1000);
      text = `${stat.valuePer1000} per 1,000 pregnancies — approximately 1 in ${oneInN}.`;
      if (stat.ci95) {
        text += ` 95% CI: ${stat.ci95[0]}–${stat.ci95[1]} per 1,000.`;
      }
      break;
    }
    case "incidence": {
      const oneInN = Math.round(100 / stat.valuePercent);
      text = `${stat.valuePercent}% — approximately 1 in ${oneInN} pregnancies in this population.`;
      break;
    }
    case "mortality_rate": {
      text = `Mortality rate of ${stat.valuePercent}% in this population.`;
      break;
    }
  }

  if (populationDescription) {
    text += ` Population: ${populationDescription}.`;
  }

  return text;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/lib/utils/risk-format.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/risk-format.ts src/__tests__/lib/utils/risk-format.test.ts
git commit -m "feat: add formatRiskStatistic, getRiskSeverity, generateTeachingInterpretation utilities"
```

---

### Task 3: Create `evidence-source-colors.ts` Utility

**Files:**
- Create: `src/lib/utils/evidence-source-colors.ts`
- Create: `src/__tests__/lib/utils/evidence-source-colors.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/lib/utils/evidence-source-colors.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  evidenceSourceColorClass,
  evidenceSourceLabel,
  EVIDENCE_SOURCE_LABELS,
} from "@/lib/utils/evidence-source-colors";
import type { EvidenceSourceType } from "@/data/types";

describe("evidenceSourceColorClass", () => {
  it("returns guideline class", () => {
    expect(evidenceSourceColorClass("guideline_derived")).toBe(
      "bg-[var(--evidence-source-guideline)] text-white",
    );
  });

  it("returns case_series class", () => {
    expect(evidenceSourceColorClass("case_series")).toBe(
      "bg-[var(--evidence-source-case-series)] text-white",
    );
  });

  it("returns protocol class", () => {
    expect(evidenceSourceColorClass("protocol")).toBe(
      "bg-[var(--evidence-source-protocol)] text-white",
    );
  });

  it("returns cohort class", () => {
    expect(evidenceSourceColorClass("cohort")).toBe(
      "bg-[var(--evidence-source-cohort)] text-white",
    );
  });

  it("returns surveillance class", () => {
    expect(evidenceSourceColorClass("surveillance")).toBe(
      "bg-[var(--evidence-source-surveillance)] text-white",
    );
  });

  it("returns registry class", () => {
    expect(evidenceSourceColorClass("registry")).toBe(
      "bg-[var(--evidence-source-registry)] text-white",
    );
  });
});

describe("evidenceSourceLabel", () => {
  it("maps all 6 types to display labels", () => {
    expect(evidenceSourceLabel("guideline_derived")).toBe("Guideline");
    expect(evidenceSourceLabel("case_series")).toBe("Case Series");
    expect(evidenceSourceLabel("protocol")).toBe("Protocol");
    expect(evidenceSourceLabel("cohort")).toBe("Cohort");
    expect(evidenceSourceLabel("surveillance")).toBe("Surveillance");
    expect(evidenceSourceLabel("registry")).toBe("Registry");
  });
});

describe("EVIDENCE_SOURCE_LABELS", () => {
  it("contains all 6 entries", () => {
    expect(Object.keys(EVIDENCE_SOURCE_LABELS)).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/lib/utils/evidence-source-colors.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `evidence-source-colors.ts`**

Create `src/lib/utils/evidence-source-colors.ts`:

```typescript
import type { EvidenceSourceType } from "@/data/types";

/** Display labels for evidence source types. */
export const EVIDENCE_SOURCE_LABELS: Record<EvidenceSourceType, string> = {
  guideline_derived: "Guideline",
  case_series: "Case Series",
  protocol: "Protocol",
  cohort: "Cohort",
  surveillance: "Surveillance",
  registry: "Registry",
};

/** CSS custom property name for each evidence source type. */
const CSS_TOKEN: Record<EvidenceSourceType, string> = {
  guideline_derived: "--evidence-source-guideline",
  case_series: "--evidence-source-case-series",
  protocol: "--evidence-source-protocol",
  cohort: "--evidence-source-cohort",
  surveillance: "--evidence-source-surveillance",
  registry: "--evidence-source-registry",
};

/** Returns Tailwind class string for badge background + white text. */
export function evidenceSourceColorClass(type: EvidenceSourceType): string {
  return `bg-[var(${CSS_TOKEN[type]})] text-white`;
}

/** Returns the display label for an evidence source type. */
export function evidenceSourceLabel(type: EvidenceSourceType): string {
  return EVIDENCE_SOURCE_LABELS[type];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/lib/utils/evidence-source-colors.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/evidence-source-colors.ts src/__tests__/lib/utils/evidence-source-colors.test.ts
git commit -m "feat: add evidence source type color and label utilities"
```

---

## Chunk 2: Teaching Mode Hook + Small Components

### Task 4: Enhance `useTeachingMode` Hook

**Files:**
- Modify: `src/lib/hooks/use-teaching-mode.tsx`
- Create: `src/__tests__/lib/hooks/use-teaching-mode.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/lib/hooks/use-teaching-mode.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TeachingModeProvider, useTeachingMode } from "@/lib/hooks/use-teaching-mode";

function TestConsumer() {
  const { teachingMode, teachingExpanded, toggleTeachingMode, toggleTeachingExpanded } =
    useTeachingMode();
  return (
    <div>
      <span data-testid="mode">{String(teachingMode)}</span>
      <span data-testid="expanded">{String(teachingExpanded)}</span>
      <button data-testid="toggle-mode" onClick={toggleTeachingMode} />
      <button data-testid="toggle-expanded" onClick={toggleTeachingExpanded} />
    </div>
  );
}

describe("useTeachingMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults teachingExpanded to false", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    expect(screen.getByTestId("expanded").textContent).toBe("false");
  });

  it("toggles teachingExpanded", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    act(() => {
      screen.getByTestId("toggle-expanded").click();
    });
    expect(screen.getByTestId("expanded").textContent).toBe("true");
  });

  it("persists teachingExpanded to localStorage", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    act(() => {
      screen.getByTestId("toggle-expanded").click();
    });
    expect(localStorage.getItem("timingrx-teaching-expanded")).toBe("true");
  });

  it("reads teachingExpanded from localStorage on mount", () => {
    localStorage.setItem("timingrx-teaching-expanded", "true");
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    expect(screen.getByTestId("expanded").textContent).toBe("true");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/lib/hooks/use-teaching-mode.test.tsx`
Expected: FAIL — `teachingExpanded` and `toggleTeachingExpanded` do not exist on the context value.

- [ ] **Step 3: Implement the hook enhancement**

Replace the full content of `src/lib/hooks/use-teaching-mode.tsx` with:

```tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface TeachingModeContextValue {
  teachingMode: boolean;
  toggleTeachingMode: () => void;
  teachingExpanded: boolean;
  toggleTeachingExpanded: () => void;
}

const TeachingModeContext = createContext<TeachingModeContextValue>({
  teachingMode: false,
  toggleTeachingMode: () => {},
  teachingExpanded: false,
  toggleTeachingExpanded: () => {},
});

export function TeachingModeProvider({ children }: { children: ReactNode }) {
  const [teachingMode, setTeachingMode] = useState(false);
  const [teachingExpanded, setTeachingExpanded] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("timingrx-teaching-mode");
    if (storedMode === "true") setTeachingMode(true);

    const storedExpanded = localStorage.getItem("timingrx-teaching-expanded");
    if (storedExpanded === "true") setTeachingExpanded(true);
  }, []);

  const toggleTeachingMode = useCallback(() => {
    setTeachingMode((prev) => {
      const next = !prev;
      localStorage.setItem("timingrx-teaching-mode", String(next));
      return next;
    });
  }, []);

  const toggleTeachingExpanded = useCallback(() => {
    setTeachingExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("timingrx-teaching-expanded", String(next));
      return next;
    });
  }, []);

  return (
    <TeachingModeContext.Provider
      value={{ teachingMode, toggleTeachingMode, teachingExpanded, toggleTeachingExpanded }}
    >
      {children}
    </TeachingModeContext.Provider>
  );
}

export function useTeachingMode() {
  return useContext(TeachingModeContext);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/lib/hooks/use-teaching-mode.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Run full test suite**

Run: `pnpm test`
Expected: All existing tests still pass (no regressions — `teachingExpanded` is additive, existing code only destructures `teachingMode` and `toggleTeachingMode`).

- [ ] **Step 6: Commit**

```bash
git add src/lib/hooks/use-teaching-mode.tsx src/__tests__/lib/hooks/use-teaching-mode.test.tsx
git commit -m "feat: add teachingExpanded sub-toggle to useTeachingMode hook"
```

---

### Task 5: Create `EvidenceSourceTypeBadge` Component

**Files:**
- Create: `src/components/condition/evidence-source-type-badge.tsx`
- Create: `src/__tests__/components/condition/evidence-source-type-badge.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/components/condition/evidence-source-type-badge.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EvidenceSourceTypeBadge } from "@/components/condition/evidence-source-type-badge";

describe("EvidenceSourceTypeBadge", () => {
  it("renders the display label for cohort", () => {
    render(<EvidenceSourceTypeBadge type="cohort" />);
    expect(screen.getByText("Cohort")).toBeInTheDocument();
  });

  it("renders the display label for registry", () => {
    render(<EvidenceSourceTypeBadge type="registry" />);
    expect(screen.getByText("Registry")).toBeInTheDocument();
  });

  it("renders the display label for guideline_derived", () => {
    render(<EvidenceSourceTypeBadge type="guideline_derived" />);
    expect(screen.getByText("Guideline")).toBeInTheDocument();
  });

  it("renders uppercase text", () => {
    const { container } = render(<EvidenceSourceTypeBadge type="protocol" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("uppercase");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/components/condition/evidence-source-type-badge.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the component**

Create `src/components/condition/evidence-source-type-badge.tsx`:

```tsx
import type { EvidenceSourceType } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import {
  evidenceSourceColorClass,
  evidenceSourceLabel,
} from "@/lib/utils/evidence-source-colors";

export function EvidenceSourceTypeBadge({ type }: { type: EvidenceSourceType }) {
  return (
    <Badge
      className={`text-[9px] uppercase tracking-wider font-semibold ${evidenceSourceColorClass(type)}`}
    >
      {evidenceSourceLabel(type)}
    </Badge>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/components/condition/evidence-source-type-badge.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/evidence-source-type-badge.tsx src/__tests__/components/condition/evidence-source-type-badge.test.tsx
git commit -m "feat: add EvidenceSourceTypeBadge component"
```

---

### Task 6: Create `RiskModifiersList` Component

**Files:**
- Create: `src/components/condition/risk-modifiers-list.tsx`
- Create: `src/__tests__/components/condition/risk-modifiers-list.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/components/condition/risk-modifiers-list.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskModifiersList } from "@/components/condition/risk-modifiers-list";
import type { RiskModifier } from "@/data/types";

// Mock useTeachingMode — default to teaching OFF
vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const modifiers: RiskModifier[] = [
  {
    factor: "maternal_age",
    effect: "Risk increases significantly after age 35",
  },
  {
    factor: "bmi",
    effect: "BMI >30 associated with 2x risk of GDM",
    riskData: {
      outcome: "GDM",
      statistic: { type: "relative_risk", value: 2.0 },
    },
  },
];

describe("RiskModifiersList", () => {
  it("renders nothing when modifiers is empty", () => {
    const { container } = render(<RiskModifiersList modifiers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card with title 'Risk Modifiers'", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Risk Modifiers")).toBeInTheDocument();
  });

  it("renders factor badges with short labels", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("BMI")).toBeInTheDocument();
  });

  it("renders effect text", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText("Risk increases significantly after age 35")).toBeInTheDocument();
  });

  it("renders inline risk stat when riskData present", () => {
    render(<RiskModifiersList modifiers={modifiers} />);
    expect(screen.getByText(/RR 2/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/components/condition/risk-modifiers-list.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the component**

Create `src/components/condition/risk-modifiers-list.tsx`:

```tsx
"use client";

import type { RiskModifier, RiskModifierFactor } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { formatRiskStatistic, generateTeachingInterpretation } from "@/lib/utils/risk-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FACTOR_LABELS: Record<RiskModifierFactor, string> = {
  maternal_age: "Age",
  bmi: "BMI",
  parity: "Parity",
  prior_stillbirth: "Prior Stillbirth",
  prior_preterm_birth: "Prior Preterm",
  prior_cesarean_count: "Prior Cesarean",
  race_ethnicity: "Ethnicity",
  ivf_conception: "IVF",
  multiple_gestation: "Multiples",
  fetal_sex: "Fetal Sex",
  gestational_age_at_diagnosis: "GA at Dx",
  disease_severity: "Severity",
  medication_control_status: "Med Control",
  comorbidity_count: "Comorbidities",
  smoking: "Smoking",
  other: "Other",
};

export function RiskModifiersList({ modifiers }: { modifiers: RiskModifier[] }) {
  const { teachingMode, teachingExpanded } = useTeachingMode();

  if (modifiers.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Risk Modifiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {modifiers.map((mod, i) => (
            <li key={i}>
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-[10px] uppercase font-semibold bg-[#555] text-white px-1.5 py-0.5 rounded-[3px]">
                  {FACTOR_LABELS[mod.factor]}
                </span>
                <span className="text-sm">
                  {mod.effect}
                  {mod.riskData && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-mono">
                      ({formatRiskStatistic(mod.riskData.statistic)})
                    </span>
                  )}
                </span>
              </div>
              {teachingMode && teachingExpanded && (
                <div className="mt-1.5 ml-[calc(0.375rem+1.5rem)] border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
                  → Clinical mechanism: {mod.effect}
                  {mod.riskData &&
                    ` ${generateTeachingInterpretation(mod.riskData.statistic, mod.riskData.populationDescription)}`}
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/components/condition/risk-modifiers-list.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/risk-modifiers-list.tsx src/__tests__/components/condition/risk-modifiers-list.test.tsx
git commit -m "feat: add RiskModifiersList component with teaching mode support"
```

---

### Task 7: Create `ConditionInteractions` Component

**Files:**
- Create: `src/components/condition/condition-interactions.tsx`
- Create: `src/__tests__/components/condition/condition-interactions.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/components/condition/condition-interactions.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConditionInteractions } from "@/components/condition/condition-interactions";
import type { ConditionInteraction } from "@/data/types";

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const interactions: ConditionInteraction[] = [
  {
    interactingConditionId: "gest-diabetes",
    interactionType: "additive_risk",
    description: "Pre-existing diabetes combined with hypertension increases preeclampsia risk.",
  },
  {
    interactingConditionId: "chronic-htn",
    interactionType: "timing_shift",
    description: "Chronic HTN shifts delivery window earlier.",
    combinedTimingGuidance: {
      type: "range",
      range: { earliest: 259, latest: 266 },
    },
  },
];

describe("ConditionInteractions", () => {
  it("renders nothing when interactions is empty", () => {
    const { container } = render(<ConditionInteractions interactions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the Interactions card header", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(screen.getByText("Interactions")).toBeInTheDocument();
  });

  it("renders interaction type badges", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(screen.getByText("Additive Risk")).toBeInTheDocument();
    expect(screen.getByText("Timing Shift")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<ConditionInteractions interactions={interactions} />);
    expect(
      screen.getByText(/Pre-existing diabetes combined/),
    ).toBeInTheDocument();
  });

  it("renders links to interacting conditions", () => {
    render(<ConditionInteractions interactions={interactions} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/conditions/gest-diabetes");
    expect(links[1]).toHaveAttribute("href", "/conditions/chronic-htn");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/components/condition/condition-interactions.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the component**

Create `src/components/condition/condition-interactions.tsx`:

```tsx
"use client";

import Link from "next/link";
import type { ConditionInteraction } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { GAWindowBadge } from "./ga-window-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INTERACTION_LABELS: Record<ConditionInteraction["interactionType"], string> = {
  additive_risk: "Additive Risk",
  timing_shift: "Timing Shift",
  route_change: "Route Change",
  monitoring_change: "Monitoring Change",
};

export function ConditionInteractions({
  interactions,
}: {
  interactions: ConditionInteraction[];
}) {
  const { teachingMode, teachingExpanded } = useTeachingMode();

  if (interactions.length === 0) return null;

  return (
    <Card className="bg-[#fef9ee] border-[#f0e4c4]">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight text-[#92610a]">
          Interactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {interactions.map((ix, i) => (
          <div key={i} className="border border-[#f0e4c4] rounded-lg p-3 bg-white/60">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge className="text-[10px] uppercase bg-[#92610a]/20 text-[#92610a] border-[#f0e4c4]">
                {INTERACTION_LABELS[ix.interactionType]}
              </Badge>
              <Link
                href={`/conditions/${ix.interactingConditionId}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {ix.interactingConditionId}
              </Link>
            </div>
            <p className="text-sm">{ix.description}</p>
            {ix.combinedTimingGuidance && (
              <div className="mt-2">
                <GAWindowBadge timing={ix.combinedTimingGuidance} />
              </div>
            )}
            {teachingMode && teachingExpanded && (
              <div className="mt-2 border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
                → This interaction affects delivery planning. {ix.description}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/components/condition/condition-interactions.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/condition-interactions.tsx src/__tests__/components/condition/condition-interactions.test.tsx
git commit -m "feat: add ConditionInteractions component with amber card styling"
```

---

## Chunk 3: Complex Components + Integration

### Task 8: Create `RiskDataTable` Component

**Files:**
- Create: `src/components/condition/risk-data-table.tsx`
- Create: `src/__tests__/components/condition/risk-data-table.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/components/condition/risk-data-table.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskDataTable } from "@/components/condition/risk-data-table";
import type { RiskDataPoint } from "@/data/types";

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const riskData: RiskDataPoint[] = [
  {
    outcome: "Stillbirth",
    statistic: { type: "relative_risk", value: 2.5, ci95: [1.8, 3.4] },
    citation: { body: "ACOG", documentId: "CO 831", year: 2021 },
  },
  {
    outcome: "Neonatal mortality",
    statistic: { type: "incidence", valuePercent: 0.5 },
  },
  {
    outcome: "Preeclampsia",
    statistic: { type: "absolute_risk", valuePer1000: 50, ci95: [30, 70] },
    populationDescription: "nulliparous women",
  },
];

describe("RiskDataTable", () => {
  it("renders nothing when riskData is empty", () => {
    const { container } = render(<RiskDataTable riskData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card title with count", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("Risk Data")).toBeInTheDocument();
    expect(screen.getByText("3 outcomes")).toBeInTheDocument();
  });

  it("renders outcome names", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("Stillbirth")).toBeInTheDocument();
    expect(screen.getByText("Neonatal mortality")).toBeInTheDocument();
    expect(screen.getByText("Preeclampsia")).toBeInTheDocument();
  });

  it("renders formatted statistics", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("RR 2.5")).toBeInTheDocument();
    expect(screen.getByText("0.5%")).toBeInTheDocument();
    expect(screen.getByText("50 per 1,000")).toBeInTheDocument();
  });

  it("renders CI when present, dash when absent", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("1.8–3.4")).toBeInTheDocument();
    expect(screen.getByText("30–70")).toBeInTheDocument();
    // Neonatal mortality has no ci95
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders formatted citation when present", () => {
    render(<RiskDataTable riskData={riskData} />);
    expect(screen.getByText("ACOG CO 831 (2021)")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/components/condition/risk-data-table.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the component**

Create `src/components/condition/risk-data-table.tsx`:

```tsx
"use client";

import { useState } from "react";
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
                  <>
                    <tr
                      key={i}
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
                      <tr key={`${i}-interp`}>
                        <td colSpan={4} className="pb-2">
                          <div className="border-l-[3px] border-[#93b4f4] pl-3 text-sm italic text-[#1e40af]">
                            → {generateTeachingInterpretation(dp.statistic, dp.populationDescription)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/components/condition/risk-data-table.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/risk-data-table.tsx src/__tests__/components/condition/risk-data-table.test.tsx
git commit -m "feat: add RiskDataTable component with severity colors and teaching interpretations"
```

---

### Task 9: Create `EvidenceSourcesSection` Component

**Files:**
- Create: `src/components/condition/evidence-sources-section.tsx`

- [ ] **Step 1: Write failing test**

Create `src/__tests__/components/condition/evidence-sources-section.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EvidenceSourcesSection } from "@/components/condition/evidence-sources-section";
import type { KeyEvidenceSource } from "@/data/types";

vi.mock("@/lib/hooks/use-teaching-mode", () => ({
  useTeachingMode: () => ({
    teachingMode: false,
    teachingExpanded: false,
    toggleTeachingMode: () => {},
    toggleTeachingExpanded: () => {},
  }),
}));

const sources: KeyEvidenceSource[] = [
  {
    id: "carpreg-ii",
    name: "CARPREG II",
    type: "cohort",
    description: "Canadian cardiac pregnancy risk score.",
    yearStarted: 1994,
    region: "Canada",
    url: "https://example.com",
  },
  {
    id: "ropac",
    name: "ROPAC",
    type: "registry",
    description: "Registry of pregnancy and cardiac disease.",
    yearStarted: 2007,
    region: "Global (60+ countries)",
  },
];

describe("EvidenceSourcesSection", () => {
  it("renders nothing when sources is empty", () => {
    const { container } = render(<EvidenceSourcesSection sources={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders card title", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("Key Evidence Sources")).toBeInTheDocument();
  });

  it("renders source names", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("CARPREG II")).toBeInTheDocument();
    expect(screen.getByText("ROPAC")).toBeInTheDocument();
  });

  it("renders type badges", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText("Cohort")).toBeInTheDocument();
    expect(screen.getByText("Registry")).toBeInTheDocument();
  });

  it("renders metadata", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    expect(screen.getByText(/1994/)).toBeInTheDocument();
    expect(screen.getByText(/Canada/)).toBeInTheDocument();
  });

  it("renders external link when url present", () => {
    render(<EvidenceSourcesSection sources={sources} />);
    const links = screen.getAllByText("↗");
    expect(links).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/__tests__/components/condition/evidence-sources-section.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the component**

Create `src/components/condition/evidence-sources-section.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import type { KeyEvidenceSource } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { EvidenceSourceTypeBadge } from "./evidence-source-type-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ViewMode = "card" | "list";

export function EvidenceSourcesSection({
  sources,
}: {
  sources: KeyEvidenceSource[];
}) {
  const { teachingMode } = useTeachingMode();
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  useEffect(() => {
    const stored = localStorage.getItem("timingrx-evidence-view");
    if (stored === "list") setViewMode("list");
  }, []);

  function changeView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("timingrx-evidence-view", mode);
  }

  if (sources.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight">
            Key Evidence Sources
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sources.length} source{sources.length !== 1 ? "s" : ""}
            </Badge>
            <div className="flex gap-1">
              <button
                onClick={() => changeView("card")}
                className={`text-xs px-1.5 py-0.5 rounded ${viewMode === "card" ? "bg-muted" : "text-muted-foreground hover:bg-muted/50"}`}
                title="Card view"
              >
                ▦
              </button>
              <button
                onClick={() => changeView("list")}
                className={`text-xs px-1.5 py-0.5 rounded ${viewMode === "list" ? "bg-muted" : "text-muted-foreground hover:bg-muted/50"}`}
                title="List view"
              >
                ≡
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="border rounded-lg p-3 bg-muted/20"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <EvidenceSourceTypeBadge type={src.type} />
                  <span className="font-semibold text-xs">{src.name}</span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline ml-auto"
                    >
                      ↗
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {src.yearStarted && `Est. ${src.yearStarted}`}
                  {src.yearStarted && src.region && " · "}
                  {src.region}
                </div>
                {teachingMode && src.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {src.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {sources.map((src) => (
              <div key={src.id}>
                <div className="flex items-center gap-2 flex-wrap">
                  <EvidenceSourceTypeBadge type={src.type} />
                  <span className="text-sm font-medium">{src.name}</span>
                  {src.yearStarted && (
                    <span className="text-xs text-muted-foreground">
                      · {src.yearStarted}
                    </span>
                  )}
                  {src.region && (
                    <span className="text-xs text-muted-foreground">
                      · {src.region}
                    </span>
                  )}
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      ↗
                    </a>
                  )}
                </div>
                {teachingMode && src.description && (
                  <div className="ml-6 mt-1 border rounded-md p-2 bg-muted/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {src.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/__tests__/components/condition/evidence-sources-section.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/evidence-sources-section.tsx src/__tests__/components/condition/evidence-sources-section.test.tsx
git commit -m "feat: add EvidenceSourcesSection with card/list view toggle and teaching mode"
```

---

### Task 10: Enhance Landmark Trials in `ConditionDetail`

This task modifies the existing Landmark Trials rendering in `condition-detail.tsx`. It does NOT touch the section ordering yet (Task 12 does that).

**Files:**
- Modify: `src/components/condition/condition-detail.tsx:188-219`

- [ ] **Step 1: Add imports at top of `condition-detail.tsx`**

Add these imports after the existing import block (after line 11):

```typescript
import {
  formatRiskStatistic,
  getRiskSeverity,
  severityColorClass,
  formatCI95,
  generateTeachingInterpretation,
} from "@/lib/utils/risk-format";
```

- [ ] **Step 2: Enhance the Landmark Trials section**

Replace the Landmark Trials block (the `{/* Landmark Trials */}` section, lines 188-219) with:

```tsx
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
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/condition/condition-detail.tsx
git commit -m "feat: enhance Landmark Trials with sample size badge and teaching risk data table"
```

---

### Task 11: Enhance `ConditionCard` with Evidence Summary

**Files:**
- Modify: `src/components/condition/condition-card.tsx:41-53`

- [ ] **Step 1: Add summary line inside CardHeader**

In `src/components/condition/condition-card.tsx`, after the badge row `<div>` (after the closing `</div>` that ends the `flex flex-wrap items-center gap-1.5` div, around line 53), and before the closing `</CardHeader>`, add:

```tsx
          {(condition.riskData.length > 0 ||
            condition.landmarkTrials.length > 0 ||
            condition.keyEvidenceSources.length > 0) && (
            <p className="text-[11px] text-muted-foreground/70 pt-1">
              {[
                condition.riskData.length > 0 &&
                  `${condition.riskData.length} risk outcome${condition.riskData.length !== 1 ? "s" : ""}`,
                condition.landmarkTrials.length > 0 &&
                  `${condition.landmarkTrials.length} trial${condition.landmarkTrials.length !== 1 ? "s" : ""}`,
                condition.keyEvidenceSources.length > 0 &&
                  `${condition.keyEvidenceSources.length} evidence source${condition.keyEvidenceSources.length !== 1 ? "s" : ""}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/condition/condition-card.tsx
git commit -m "feat: add evidence summary underline to ConditionCard"
```

---

### Task 12: Integrate All New Sections into `ConditionDetail`

**Files:**
- Modify: `src/components/condition/condition-detail.tsx`

This is the final wiring task. The component currently renders sections in this order: Header, Guideline Recs, Clinical Notes, Physiology, Special Considerations, Sub-variants, Landmark Trials. The new order per spec is: Header, Guideline Recs, Clinical Notes, Physiology, **Risk Data, Risk Modifiers, Interactions, Key Evidence Sources**, Landmark Trials, Special Considerations, Sub-variants.

- [ ] **Step 1: Add remaining imports**

Add these imports at the top of `condition-detail.tsx` (in addition to the risk-format imports already added in Task 10):

```typescript
import { RiskDataTable } from "./risk-data-table";
import { RiskModifiersList } from "./risk-modifiers-list";
import { ConditionInteractions } from "./condition-interactions";
import { EvidenceSourcesSection } from "./evidence-sources-section";
```

- [ ] **Step 2: Reorder sections**

In the JSX return of `ConditionDetail`, rearrange the sections so they appear in this order:

1. `{/* Header */}` — keep as-is
2. `{/* Guideline Recommendations */}` — keep as-is
3. `{/* Clinical Notes */}` — keep as-is
4. `{/* Physiology (Teaching Mode) */}` — keep as-is
5. NEW: `{/* Risk Data */}` — add:
```tsx
      {/* Risk Data */}
      <RiskDataTable riskData={condition.riskData} />
```
6. NEW: `{/* Risk Modifiers */}` — add:
```tsx
      {/* Risk Modifiers */}
      <RiskModifiersList modifiers={condition.riskModifiers} />
```
7. NEW: `{/* Interactions */}` — add:
```tsx
      {/* Interactions */}
      <ConditionInteractions interactions={condition.interactions} />
```
8. NEW: `{/* Key Evidence Sources */}` — add:
```tsx
      {/* Key Evidence Sources */}
      <EvidenceSourcesSection sources={condition.keyEvidenceSources} />
```
9. `{/* Landmark Trials */}` — already enhanced in Task 10
10. `{/* Special Considerations */}` — MOVE here (was position 5)
11. `{/* Sub-variants */}` — MOVE here (was position 6)

- [ ] **Step 3: Run full test suite**

Run: `pnpm test`
Expected: All tests PASS.

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build succeeds — all 198+ condition pages render with the new sections.

- [ ] **Step 5: Commit**

```bash
git add src/components/condition/condition-detail.tsx
git commit -m "feat: integrate Risk Data, Risk Modifiers, Interactions, Evidence Sources into ConditionDetail"
```

---

### Task 13: Final Verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: All tests PASS.

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds with no errors or warnings.

- [ ] **Step 3: Manual spot-check** (if dev server available)

Run: `pnpm dev` and navigate to a condition with rich data (e.g., a cardiac condition). Verify:
- Risk Data table renders with color-coded severity
- Risk Modifiers list shows factor badges
- Evidence Sources shows colored type badges in card grid
- Landmark Trials show sample size badges
- Condition cards on the listing page show evidence summary text
- Teaching mode toggle shows/hides interpretation rows
- Teaching expanded toggle switches between hover and expanded
- View mode toggle (card/list) works on Evidence Sources

---

## Summary

| Task | What | New Files | Modified Files |
|------|------|-----------|---------------|
| 1 | CSS tokens | — | `globals.css` |
| 2 | Risk format utilities | `risk-format.ts` + test | — |
| 3 | Evidence source colors | `evidence-source-colors.ts` + test | — |
| 4 | Teaching mode hook | test | `use-teaching-mode.tsx` |
| 5 | Type badge component | `evidence-source-type-badge.tsx` + test | — |
| 6 | Risk modifiers | `risk-modifiers-list.tsx` + test | — |
| 7 | Interactions | `condition-interactions.tsx` + test | — |
| 8 | Risk data table | `risk-data-table.tsx` + test | — |
| 9 | Evidence sources | `evidence-sources-section.tsx` + test | — |
| 10 | Landmark trials | — | `condition-detail.tsx` |
| 11 | Card enhancement | — | `condition-card.tsx` |
| 12 | Integration | — | `condition-detail.tsx` |
| 13 | Verification | — | — |

**Total: 7 new source files, 7 new test files, 4 modified files, 13 commits.**
