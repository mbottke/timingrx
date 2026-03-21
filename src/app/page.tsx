import Link from "next/link";
import { conditionsByCategory, allConditions } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES, type ConditionCategory } from "@/data/types";
import { allTrials } from "@/data/trials";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KairosLogo } from "@/components/layout/kairos-logo";
import { HeroMotif } from "@/components/layout/hero-motif";
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
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      {/* Hero */}
      <section className="relative text-center mb-14 overflow-hidden">
        <HeroMotif className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <KairosLogo variant="hero" />
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Delivery timing for every maternal &amp; fetal condition
          </p>
          <p className="mt-3 text-sm text-muted-foreground/80 leading-relaxed">
            Risk calculator with confidence scoring, and interactive
            visualizations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/conditions"
              className="inline-flex h-11 items-center rounded-lg px-7 text-sm font-medium text-white shadow-md shadow-black/10 transition-all hover:shadow-lg hover:shadow-black/15"
              style={{ background: "var(--kairos-gradient)" }}
            >
              Browse Conditions
            </Link>
            <Link
              href="/calculator"
              className="inline-flex h-11 items-center rounded-lg border bg-card px-7 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              Risk Curve
            </Link>
          </div>
        </div>
      </section>

      <hr className="kairos-divider mb-14" />

      {/* Stats — hero numbers */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-14">
        <StatCard label="Conditions" value={String(allConditions.length)} />
        <StatCard label="Categories" value={String(categories.size)} />
        <StatCard label="Landmark Trials" value={String(allTrials.length)} />
        <StatCard label="Risk Factors" value="13" />
      </section>

      <hr className="kairos-divider mb-14" />

      {/* Category Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            Object.keys(CATEGORY_DISPLAY_NAMES) as ConditionCategory[]
          ).map((cat) => {
            const conditions = categories.get(cat);
            if (!conditions || conditions.length === 0) return null;
            const accent = categoryAccents[cat] ?? defaultAccent;
            return (
              <Link key={cat} href="/conditions">
                <Card
                  className={`glow-hover kairos-card-hover h-full border-l-4 ${accent.border} transition-all duration-200 hover:-translate-y-0.5`}
                  style={{ "--card-glow": accent.glow } as React.CSSProperties}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <CategoryIcon category={cat} className="size-5 shrink-0 text-muted-foreground" />
                      {CATEGORY_DISPLAY_NAMES[cat]}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      <span className="font-mono font-medium text-foreground/70">
                        {conditions.length}
                      </span>
                      {" "}condition{conditions.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 text-center">
        <CardTitle className="text-4xl font-bold font-mono tracking-tight kairos-gradient-text">
          {value}
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider font-medium mt-1">
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
