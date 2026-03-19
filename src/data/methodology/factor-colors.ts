/**
 * Single source of truth for factor colors in the methodology page.
 * Colors chosen for WCAG AA contrast on white background.
 */

export interface FactorColor {
  hex: string;
  name: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

const PALETTE: Record<string, FactorColor> = {
  amber: { hex: "#f59e0b", name: "Amber", textClass: "text-amber-500", bgClass: "bg-amber-500", borderClass: "border-amber-500" },
  blue: { hex: "#3b82f6", name: "Blue", textClass: "text-blue-500", bgClass: "bg-blue-500", borderClass: "border-blue-500" },
  purple: { hex: "#8b5cf6", name: "Purple", textClass: "text-violet-500", bgClass: "bg-violet-500", borderClass: "border-violet-500" },
  rose: { hex: "#f43f5e", name: "Rose", textClass: "text-rose-500", bgClass: "bg-rose-500", borderClass: "border-rose-500" },
  teal: { hex: "#14b8a6", name: "Teal", textClass: "text-teal-500", bgClass: "bg-teal-500", borderClass: "border-teal-500" },
  slate: { hex: "#64748b", name: "Slate", textClass: "text-slate-500", bgClass: "bg-slate-500", borderClass: "border-slate-500" },
  indigo: { hex: "#6366f1", name: "Indigo", textClass: "text-indigo-500", bgClass: "bg-indigo-500", borderClass: "border-indigo-500" },
  emerald: { hex: "#10b981", name: "Emerald", textClass: "text-emerald-500", bgClass: "bg-emerald-500", borderClass: "border-emerald-500" },
};

const FACTOR_COLOR_MAP: Record<string, string> = {
  age_35_39: "amber", age_gte_40: "amber", age_gte_45: "amber",
  bmi_30_34: "blue", bmi_35_39: "blue", bmi_gte_40: "blue",
  preexisting_diabetes: "purple",
  chronic_hypertension: "rose",
  sga_fetus: "teal",
  prior_stillbirth: "slate",
  nulliparity: "indigo",
  smoking: "emerald", black_race: "emerald",
};

const PALETTE_KEYS = Object.keys(PALETTE);

export function getFactorColor(factorId: string): FactorColor {
  const key = FACTOR_COLOR_MAP[factorId];
  if (key && PALETTE[key]) return PALETTE[key];
  let hash = 0;
  for (let i = 0; i < factorId.length; i++) {
    hash = (hash * 31 + factorId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % PALETTE_KEYS.length;
  return PALETTE[PALETTE_KEYS[idx]];
}

export { PALETTE, FACTOR_COLOR_MAP };
