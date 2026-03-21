"use client";

import { useMemo } from "react";
import { calculateRiskCurve } from "@/lib/calculator/risk-engine";

interface Props {
  factorId: string;
  currentFactorIds: string[];
}

export function FactorPreviewSparkline({ factorId, currentFactorIds }: Props) {
  const { currentPath, previewPath } = useMemo(() => {
    const current = calculateRiskCurve({
      activeFactorIds: currentFactorIds,
      applyInteractions: currentFactorIds.length >= 2,
    });
    const preview = calculateRiskCurve({
      activeFactorIds: [...currentFactorIds, factorId],
      applyInteractions: currentFactorIds.length + 1 >= 2,
    });

    const allValues = [
      ...current.map((p) => p.adjustedRiskPer1000),
      ...preview.map((p) => p.adjustedRiskPer1000),
    ];
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const range = max - min || 1;

    function toPath(data: typeof current): string {
      return data
        .map((p, i) => {
          const x = (i / (data.length - 1)) * 76 + 2;
          const y = 22 - ((p.adjustedRiskPer1000 - min) / range) * 20;
          return `${i === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");
    }

    return { currentPath: toPath(current), previewPath: toPath(preview) };
  }, [factorId, currentFactorIds]);

  return (
    <svg width={80} height={24} className="shrink-0">
      <path
        d={currentPath}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={1}
        opacity={0.4}
      />
      <path
        d={previewPath}
        fill="none"
        stroke="var(--brand-pink)"
        strokeWidth={1.5}
      />
    </svg>
  );
}
