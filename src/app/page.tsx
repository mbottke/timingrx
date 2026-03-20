import Link from "next/link";
import { conditionsByCategory, allConditions } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES, type ConditionCategory } from "@/data/types";
import { allTrials } from "@/data/trials";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TimingRxLogo } from "@/components/layout/timing-rx-logo";

/** Subtle color tints per medical category for visual identity */
const categoryAccents: Partial<Record<ConditionCategory, string>> = {
  hypertensive: "border-l-[var(--brand-coral)]",
  diabetes: "border-l-[var(--ga-caution)]",
  cardiac_valvular: "border-l-[var(--risk-high)]",
  cardiac_aortopathy: "border-l-[var(--risk-high)]",
  cardiac_cardiomyopathy: "border-l-[var(--risk-high)]",
  cardiac_complex: "border-l-[var(--risk-high)]",
  renal: "border-l-[var(--brand-teal)]",
  hepatic: "border-l-[var(--brand-teal)]",
  hematologic: "border-l-[var(--evidence-moderate)]",
  fetal_cardiac: "border-l-[var(--evidence-source-surveillance)]",
  fetal_growth_fluid: "border-l-[var(--evidence-source-surveillance)]",
  fetal_structural: "border-l-[var(--evidence-source-surveillance)]",
  infectious: "border-l-[var(--evidence-source-protocol)]",
  neurologic: "border-l-[var(--evidence-high)]",
  pulmonary: "border-l-[var(--evidence-high)]",
};

export default function Home() {
  const categories = conditionsByCategory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      {/* Hero */}
      <section className="text-center mb-14">
        <div className="mx-auto max-w-2xl">
          <TimingRxLogo variant="hero" />
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Evidence-based delivery timing for every maternal and fetal condition.
            Risk calculator with confidence scoring, and interactive
            visualizations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/conditions"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
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

      {/* Stats — hero numbers */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-14">
        <StatCard label="Conditions" value={String(allConditions.length)} accent="text-primary" />
        <StatCard label="Categories" value={String(categories.size)} accent="text-[var(--brand-teal)]" />
        <StatCard label="Landmark Trials" value={String(allTrials.length)} accent="text-[var(--evidence-moderate)]" />
        <StatCard label="Risk Factors" value="13" accent="text-[var(--brand-coral)]" />
      </section>

      {/* Category Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            Object.keys(CATEGORY_DISPLAY_NAMES) as ConditionCategory[]
          ).map((cat) => {
            const conditions = categories.get(cat);
            if (!conditions || conditions.length === 0) return null;
            const accent = categoryAccents[cat] ?? "border-l-border";
            return (
              <Link key={cat} href="/conditions">
                <Card className={`h-full border-l-4 ${accent} transition-all duration-200 hover:bg-accent/50 hover:shadow-md hover:-translate-y-0.5`}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-semibold">
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

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 text-center">
        <CardTitle className={`text-4xl font-bold font-mono tracking-tight ${accent}`}>
          {value}
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider font-medium mt-1">
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
