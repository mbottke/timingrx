import type { ConditionCategory } from "@/data/types";

interface IconProps {
  className?: string;
}

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ── Blood pressure wave ─────────────────────────────────────────────── */
function HypertensiveIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <polyline points="2,14 6,14 8,6 10,18 12,10 14,14 16,14" />
      <circle cx="19" cy="12" r="3" />
    </svg>
  );
}

/* ── Blood drop ──────────────────────────────────────────────────────── */
function DiabetesIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
    </svg>
  );
}

/* ── Heart with structure lines ──────────────────────────────────────── */
function CardiacValvularIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  );
}

/* ── Heart with upward arrow (aorta) ─────────────────────────────────── */
function CardiacAortopathyIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      <line x1="12" y1="14" x2="12" y2="8" />
      <polyline points="9.5,10.5 12,8 14.5,10.5" />
    </svg>
  );
}

/* ── Heart with wave (cardiomyopathy / weakened) ─────────────────────── */
function CardiacCardiomyopathyIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      <polyline points="8,12 10,10 12,14 14,10 16,12" />
    </svg>
  );
}

/* ── Heart with cross (complex lesion) ───────────────────────────────── */
function CardiacComplexIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      <line x1="10" y1="10" x2="14" y2="14" />
      <line x1="14" y1="10" x2="10" y2="14" />
    </svg>
  );
}

/* ── Kidney bean ─────────────────────────────────────────────────────── */
function RenalIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M8 3C4 3 2 7 2 12s2 9 6 9c2 0 3-2 4-2s2 2 4 2c4 0 6-4 6-9S20 3 16 3c-2 0-3 2-4 2S10 3 8 3z" />
    </svg>
  );
}

/* ── Liver outline ───────────────────────────────────────────────────── */
function HepaticIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 12c0-4 2-8 8-8 4 0 6 2 8 5 1 2 1 4 0 6-2 3-5 5-10 5C6 20 4 16 4 12z" />
      <path d="M12 4v8" />
    </svg>
  );
}

/* ── Blood cells (three overlapping circles) ─────────────────────────── */
function HematologicIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="9" cy="9" r="4" />
      <circle cx="15" cy="9" r="4" />
      <circle cx="12" cy="15" r="4" />
    </svg>
  );
}

/* ── Antibody Y-shape ────────────────────────────────────────────────── */
function AutoimmuneIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 22v-8" />
      <path d="M12 14L6 6" />
      <path d="M12 14l6-8" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
    </svg>
  );
}

/* ── Butterfly / thyroid shape ───────────────────────────────────────── */
function EndocrineIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 8c-3-4-9-3-9 2s6 6 9 3" />
      <path d="M12 8c3-4 9-3 9 2s-6 6-9 3" />
      <line x1="12" y1="8" x2="12" y2="18" />
    </svg>
  );
}

/* ── Brain outline ───────────────────────────────────────────────────── */
function NeurologicIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 2C8 2 5 5 5 8c0 1.5.5 3 1.5 4C5.5 13 5 14 5 15.5 5 18.5 7.5 21 10.5 21H12" />
      <path d="M12 2c4 0 7 3 7 6 0 1.5-.5 3-1.5 4 1 1 1.5 2 1.5 3.5 0 3-2.5 5.5-5.5 5.5H12" />
      <path d="M12 2v19" />
    </svg>
  );
}

/* ── Lung outline ────────────────────────────────────────────────────── */
function PulmonaryIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M8 4c-3 0-5 4-5 9s2 7 5 7c2 0 4-2 4-4V4" />
      <path d="M16 4c3 0 5 4 5 9s-2 7-5 7c-2 0-4-2-4-4V4" />
    </svg>
  );
}

/* ── Virus circle with bumps ─────────────────────────────────────────── */
function InfectiousIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="12" cy="20" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="20" cy="12" r="1.5" />
    </svg>
  );
}

/* ── Caution triangle with exclamation ───────────────────────────────── */
function SubstanceUseIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Scale / weight ──────────────────────────────────────────────────── */
function ObesityIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="12" x2="16" y2="9" />
      <line x1="8" y1="16" x2="16" y2="16" />
    </svg>
  );
}

/* ── Fetal heart ─────────────────────────────────────────────────────── */
function FetalCardiacIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M19.5 5.5a4 4 0 0 0-5.66 0L12 7.34 10.16 5.5a4 4 0 1 0-5.66 5.66L12 18.5l7.5-7.34a4 4 0 0 0 0-5.66z" />
      <polyline points="9,11 11,9 13,13 15,11" />
    </svg>
  );
}

/* ── Abdominal wall (torso outline) ──────────────────────────────────── */
function FetalAbdominalWallIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <ellipse cx="12" cy="13" rx="5" ry="7" />
      <line x1="12" y1="6" x2="12" y2="20" />
      <line x1="7.5" y1="13" x2="16.5" y2="13" />
    </svg>
  );
}

/* ── Growth curve (arrow up) ─────────────────────────────────────────── */
function FetalGrowthFluidIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="14" r="7" />
      <polyline points="9,14 12,8 15,14" />
      <line x1="12" y1="8" x2="12" y2="19" />
    </svg>
  );
}

/* ── Fetus silhouette (curled shape) ─────────────────────────────────── */
function FetalStructuralIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="7" r="3" />
      <path d="M9.5 9.5C7 12 6 15 7 18c1 2 3 3 5 3s4-1 5-3" />
    </svg>
  );
}

/* ── Uterus outline ──────────────────────────────────────────────────── */
function PlacentalUterineIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M7 3c-2 0-3 2-3 5 0 4 3 9 8 13 5-4 8-9 8-13 0-3-1-5-3-5" />
      <path d="M7 3c1 2 3 3 5 3s4-1 5-3" />
    </svg>
  );
}

/* ── Two overlapping circles ─────────────────────────────────────────── */
function MultipleGestationIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </svg>
  );
}

/* ── Clock with backward arrow ───────────────────────────────────────── */
function PriorObstetricIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="13" r="8" />
      <polyline points="12,9 12,13 15,15" />
      <path d="M4 4l1.5 4.5L10 7" />
    </svg>
  );
}

/* ── Hourglass ───────────────────────────────────────────────────────── */
function AgeDemographicsIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M6 2h12" />
      <path d="M6 22h12" />
      <path d="M7 2c0 5 5 6 5 10S7 18 7 22" />
      <path d="M17 2c0 5-5 6-5 10s5 6 5 10" />
    </svg>
  );
}

/* ── Scalpel ─────────────────────────────────────────────────────────── */
function SurgicalIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M18 2L8 12" />
      <path d="M8 12c-2 2-5 4-5 6 0 1 1 2 2 2 2 0 4-3 6-5" />
      <line x1="15" y1="5" x2="19" y2="9" />
    </svg>
  );
}

/* ── Medical cross (default) ─────────────────────────────────────────── */
function MiscellaneousIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const icons: Record<ConditionCategory, React.FC<IconProps>> = {
  hypertensive: HypertensiveIcon,
  diabetes: DiabetesIcon,
  cardiac_valvular: CardiacValvularIcon,
  cardiac_aortopathy: CardiacAortopathyIcon,
  cardiac_cardiomyopathy: CardiacCardiomyopathyIcon,
  cardiac_complex: CardiacComplexIcon,
  renal: RenalIcon,
  hepatic: HepaticIcon,
  hematologic: HematologicIcon,
  autoimmune_rheumatologic: AutoimmuneIcon,
  endocrine: EndocrineIcon,
  neurologic: NeurologicIcon,
  pulmonary: PulmonaryIcon,
  infectious: InfectiousIcon,
  substance_use_psychiatric: SubstanceUseIcon,
  obesity: ObesityIcon,
  fetal_cardiac: FetalCardiacIcon,
  fetal_abdominal_wall: FetalAbdominalWallIcon,
  fetal_growth_fluid: FetalGrowthFluidIcon,
  fetal_structural: FetalStructuralIcon,
  placental_uterine: PlacentalUterineIcon,
  multiple_gestation: MultipleGestationIcon,
  prior_obstetric_history: PriorObstetricIcon,
  age_demographics: AgeDemographicsIcon,
  surgical: SurgicalIcon,
  miscellaneous_obstetric: MiscellaneousIcon,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: ConditionCategory;
  className?: string;
}) {
  const Icon = icons[category] ?? MiscellaneousIcon;
  return <Icon className={className} />;
}
