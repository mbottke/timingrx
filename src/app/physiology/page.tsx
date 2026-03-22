import { ConvergenceChart } from "@/components/charts/convergence-chart";
import { PhysiologyTimeline } from "@/components/physiology/physiology-timeline";

export const metadata = {
  title: "Physiology — Kairos",
  description: "Week-by-week physiologic changes driving delivery timing decisions from 37-42 weeks.",
};

export default function PhysiologyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 xl:px-12">
      <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
        Physiologic Risk Convergence
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Four physiologic streams — declining amniotic fluid, rising meconium staining,
        increasing macrosomia, and accelerating stillbirth risk — converge toward adverse
        outcomes from 39 weeks onward.
      </p>

      <ConvergenceChart />

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight kairos-heading">
          Week-by-Week Changes
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Step through each gestational week to see how placental, fluid, meconium,
          growth, and hormonal physiology evolve.
        </p>
        <PhysiologyTimeline />
      </section>
    </div>
  );
}
