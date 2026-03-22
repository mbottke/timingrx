import Link from "next/link";
import { conditionsByCategory, allConditions } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES, type ConditionCategory } from "@/data/types";
import { allTrials } from "@/data/trials";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LiquidGlassCard } from "@/components/layout/liquid-glass-card";
import { CategoryIcon } from "@/components/icons/category-icons";

/** Brand-spectrum left-border accents per medical category */
const categoryAccents: Partial<Record<ConditionCategory, { border: string; glow: string }>> = {
  hypertensive: { border: "border-l-[var(--brand-pink)]", glow: "var(--brand-pink)" },
  diabetes: { border: "border-l-[var(--brand-purple)]", glow: "var(--brand-purple)" },
  cardiac_valvular: { border: "border-l-[var(--brand-pink)]/80", glow: "var(--brand-pink)" },
  cardiac_aortopathy: { border: "border-l-[var(--brand-pink)]/80", glow: "var(--brand-pink)" },
  cardiac_cardiomyopathy: { border: "border-l-[var(--brand-pink)]/80", glow: "var(--brand-pink)" },
  cardiac_complex: { border: "border-l-[var(--brand-pink)]/80", glow: "var(--brand-pink)" },
  renal: { border: "border-l-[var(--brand-blue)]", glow: "var(--brand-blue)" },
  hepatic: { border: "border-l-[var(--brand-blue)]/80", glow: "var(--brand-blue)" },
  hematologic: { border: "border-l-[var(--brand-purple)]/70", glow: "var(--brand-purple)" },
  fetal_cardiac: { border: "border-l-[var(--brand-blue)]/70", glow: "var(--brand-blue)" },
  fetal_growth_fluid: { border: "border-l-[var(--brand-blue)]/70", glow: "var(--brand-blue)" },
  fetal_structural: { border: "border-l-[var(--brand-blue)]/70", glow: "var(--brand-blue)" },
  infectious: { border: "border-l-[var(--brand-purple)]/60", glow: "var(--brand-purple)" },
  neurologic: { border: "border-l-[var(--brand-purple)]/80", glow: "var(--brand-purple)" },
  pulmonary: { border: "border-l-[var(--brand-blue)]/60", glow: "var(--brand-blue)" },
};

const defaultAccent = { border: "border-l-[var(--brand-purple)]/40", glow: "var(--brand-purple)" };

export default function Home() {
  const categories = conditionsByCategory();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 xl:px-12">
      {/* Hero — dramatic, minimal */}
      <section className="relative text-center mb-20 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Dominant wordmark — no curves, the background tells that story */}
          <h1 className="text-[72px] sm:text-[80px] font-extrabold tracking-[-0.04em] leading-[0.9] text-foreground">
            kairos<span className="text-[var(--brand-pink)]">.</span>
          </h1>
          <p className="mt-6 text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium">
            Obstetric Decision Intelligence
          </p>
          <p className="mt-5 text-base text-muted-foreground/70 leading-relaxed max-w-md mx-auto">
            Delivery timing for every maternal &amp; fetal condition.
            Risk calculator with confidence scoring and interactive visualizations.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link
              href="/conditions"
              className="kairos-cta-primary inline-flex h-12 items-center rounded-xl px-8 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300"
              style={{ background: "var(--kairos-gradient)" }}
            >
              Browse Conditions
            </Link>
            <Link
              href="/calculator"
              className="kairos-cta-glass inline-flex h-12 items-center rounded-xl px-8 text-sm font-semibold transition-all duration-300"
            >
              Risk Curve
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — single row of 4 */}
      <section className="mb-20">
        <div className="grid gap-4 sm:grid-cols-4 xl:gap-6">
          {/* Hero stat — same size, larger number */}
          <LiquidGlassCard transparent className="overflow-hidden">
            <CardHeader className="relative z-[2] p-5 text-center">
              <CardTitle className="text-5xl font-extrabold font-mono tracking-tight kairos-gradient-text kairos-gradient-text-slow">
                {String(allConditions.length)}
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
                Conditions
              </CardDescription>
            </CardHeader>
          </LiquidGlassCard>
          {/* Supporting stats */}
          <StatCard label="Categories" value={String(categories.size)} />
          <StatCard label="Landmark Trials" value={String(allTrials.length)} />
          <StatCard label="Risk Factors" value="13" />
        </div>
      </section>

      {/* Category Grid */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold mb-8">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
          {(
            Object.keys(CATEGORY_DISPLAY_NAMES) as ConditionCategory[]
          ).map((cat) => {
            const conditions = categories.get(cat);
            if (!conditions || conditions.length === 0) return null;
            const accent = categoryAccents[cat] ?? defaultAccent;
            return (
              <Link key={cat} href="/conditions">
                <LiquidGlassCard
                  className={`glow-hover kairos-card-hover h-full border-l-4 ${accent.border} hover:-translate-y-0.5`}
                  style={{ "--card-glow": accent.glow } as React.CSSProperties}
                >
                  <CardHeader className="relative z-[2] p-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <CategoryIcon category={cat} className="size-5 shrink-0 text-muted-foreground" />
                      {CATEGORY_DISPLAY_NAMES[cat]}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      <span className="text-sm font-mono font-bold kairos-gradient-text">
                        {conditions.length}
                      </span>
                      {" "}condition{conditions.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                </LiquidGlassCard>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <LiquidGlassCard transparent className={`overflow-hidden ${className}`}>
      <CardHeader className="relative z-[2] p-5 text-center">
        <CardTitle className="text-3xl font-bold font-mono tracking-tight kairos-gradient-text">
          {value}
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
          {label}
        </CardDescription>
      </CardHeader>
    </LiquidGlassCard>
  );
}
