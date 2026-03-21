import { ConvergenceChart } from "@/components/charts/convergence-chart";

export const metadata = {
  title: "Physiology — Kairos",
  description: "Week-by-week physiologic changes driving delivery timing decisions from 37-42 weeks.",
};

export default function PhysiologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
        Physiologic Risk Convergence
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Four physiologic streams — declining amniotic fluid, rising meconium staining,
        increasing macrosomia, and accelerating stillbirth risk — converge toward adverse
        outcomes from 39 weeks onward.
      </p>

      <ConvergenceChart />

      {/* Week-by-week physiology detail — Task 3.2 */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight kairos-heading">
          Week-by-Week Physiology
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed physiologic changes at each gestational week — coming soon.
        </p>
      </section>
    </div>
  );
}
