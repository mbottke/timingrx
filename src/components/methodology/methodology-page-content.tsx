"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FactorToolbar } from "@/components/methodology/factor-toolbar";
import { SectionNav } from "@/components/methodology/section-nav";
import { MethodologyTabs, type TabId } from "@/components/methodology/methodology-tabs";
import { SectionBaseline } from "@/components/methodology/section-baseline";
import { SectionMultiplication } from "@/components/methodology/section-multiplication";
import { SectionCIPropagation } from "@/components/methodology/section-ci-propagation";
import { SectionConfidence } from "@/components/methodology/section-confidence";
import { SectionOrCorrection } from "@/components/methodology/section-or-correction";
import { SectionGradeMapping } from "@/components/methodology/section-grade-mapping";
import { PipelineView } from "./pipeline/pipeline-view";
import { TimelineView } from "./timeline/timeline-view";
import { KairosLogo } from "@/components/layout/kairos-logo";

// ── Inner component (uses useSearchParams) ────────────────────────────────────

function MethodologyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawView = searchParams.get("view");
  const activeTab: TabId =
    rawView === "pipeline" || rawView === "timeline" ? rawView : "explorer";

  function handleTabChange(tab: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "explorer") {
      params.delete("view");
    } else {
      params.set("view", tab);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <>
      <FactorToolbar />
      {activeTab === "explorer" && <SectionNav />}

      <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-12">
        <div className="py-10">
          <h1 className="text-2xl font-semibold tracking-tight flex items-baseline gap-1.5 kairos-heading">
            How <KairosLogo variant="heading" /> Works
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            An interactive exploration of the risk calculation methodology.
            Toggle risk factors in the toolbar to watch the math and
            visualizations update in real-time.
          </p>
        </div>

        <MethodologyTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "explorer" && (
          <div role="tabpanel" aria-label="Explorer view" className="animate-fade-in">
            <SectionBaseline />
            <SectionMultiplication />
            <SectionCIPropagation />
            <SectionConfidence />
            <SectionOrCorrection />
            <SectionGradeMapping />

            <div className="py-12 border-t mt-12">
              <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
                This methodology page explains the mathematical model underlying
                Kairos. The model uses published risk ratios applied
                multiplicatively to a meta-analytic baseline. The composite has
                not been prospectively validated. The confidence scorer is a
                novel feature designed to make model limitations transparent.
                Clinical judgment supersedes all calculator output.
              </p>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div role="tabpanel" aria-label="Pipeline view" className="animate-fade-in">
            <div className="py-8">
              <PipelineView />
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div role="tabpanel" aria-label="Timeline view" className="animate-fade-in">
            <div className="py-8">
              <TimelineView />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Exported component (wraps inner in Suspense) ──────────────────────────────

export function MethodologyPageContent() {
  return (
    <Suspense fallback={null}>
      <MethodologyPageInner />
    </Suspense>
  );
}
