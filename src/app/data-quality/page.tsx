import { CompletenessDashboard } from "@/components/data-quality/completeness-dashboard";

export const metadata = {
  title: "Data Quality — Kairos",
  description: "Transparency report on condition data completeness and evidence quality.",
};

export default function DataQualityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 xl:px-12">
      <h1 className="text-2xl font-semibold tracking-tight kairos-heading">Data Quality</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Transparency report on condition data completeness and evidence quality.
      </p>
      <CompletenessDashboard />
    </div>
  );
}
