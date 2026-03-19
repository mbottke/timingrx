import { MethodologyProvider } from "@/components/methodology/methodology-provider";
import { FactorToolbar } from "@/components/methodology/factor-toolbar";
import { SectionNav } from "@/components/methodology/section-nav";
import { SectionBaseline } from "@/components/methodology/section-baseline";
import { SectionMultiplication } from "@/components/methodology/section-multiplication";
import { SectionCIPropagation } from "@/components/methodology/section-ci-propagation";
import { SectionConfidence } from "@/components/methodology/section-confidence";
import { SectionOrCorrection } from "@/components/methodology/section-or-correction";
import { SectionGradeMapping } from "@/components/methodology/section-grade-mapping";

export const metadata = {
  title: "Methodology — TimingRx",
  description:
    "Interactive visualization of how TimingRx calculates stillbirth risk, " +
    "propagates uncertainty, and scores confidence.",
};

export default function MethodologyPage() {
  return (
    <MethodologyProvider>
      <FactorToolbar />
      <SectionNav />
      <div className="mx-auto max-w-6xl px-4 lg:px-6 xl:pl-16">
        <div className="py-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            How TimingRx Works
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            An interactive exploration of the risk calculation methodology.
            Toggle risk factors in the toolbar to watch the math and
            visualizations update in real-time.
          </p>
        </div>

        <SectionBaseline />
        <SectionMultiplication />
        <SectionCIPropagation />
        <SectionConfidence />
        <SectionOrCorrection />
        <SectionGradeMapping />

        <div className="py-12 border-t mt-12">
          <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
            This methodology page explains the mathematical model underlying
            TimingRx. The model uses published risk ratios applied multiplicatively
            to a meta-analytic baseline. The composite has not been prospectively
            validated. The confidence scorer is a novel feature designed to make
            model limitations transparent. Clinical judgment supersedes all
            calculator output.
          </p>
        </div>
      </div>
    </MethodologyProvider>
  );
}
