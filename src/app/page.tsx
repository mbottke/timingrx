import Link from "next/link";
import { conditionsByCategory, allConditions } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES, type ConditionCategory } from "@/data/types";
import { allTrials } from "@/data/trials";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const categories = conditionsByCategory();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          TimingRx
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Evidence-based delivery timing for every maternal and fetal condition.
          {" "}
          <span className="font-medium text-foreground">
            {allConditions.length} conditions
          </span>
          , risk calculator with confidence scoring, and interactive
          visualizations.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/conditions"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Browse Conditions
          </Link>
          <Link
            href="/calculator"
            className="inline-flex h-10 items-center rounded-md border bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            Risk Calculator
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
        <StatCard label="Conditions" value={String(allConditions.length)} />
        <StatCard label="Categories" value={String(categories.size)} />
        <StatCard label="Landmark Trials" value={String(allTrials.length)} />
        <StatCard label="Risk Factors" value="13" />
      </section>

      {/* Category Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            Object.keys(CATEGORY_DISPLAY_NAMES) as ConditionCategory[]
          ).map((cat) => {
            const conditions = categories.get(cat);
            if (!conditions || conditions.length === 0) return null;
            return (
              <Link key={cat} href="/conditions">
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">
                      {CATEGORY_DISPLAY_NAMES[cat]}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {conditions.length} condition
                      {conditions.length !== 1 ? "s" : ""}
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
    <Card>
      <CardHeader className="p-4 text-center">
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
        <CardDescription className="text-xs">{label}</CardDescription>
      </CardHeader>
    </Card>
  );
}
