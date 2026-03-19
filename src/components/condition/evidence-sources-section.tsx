"use client";

import { useState, useEffect } from "react";
import type { KeyEvidenceSource } from "@/data/types";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { EvidenceSourceTypeBadge } from "./evidence-source-type-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ViewMode = "card" | "list";

export function EvidenceSourcesSection({
  sources,
}: {
  sources: KeyEvidenceSource[];
}) {
  const { teachingMode } = useTeachingMode();
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  useEffect(() => {
    const stored = localStorage.getItem("timingrx-evidence-view");
    if (stored === "list") setViewMode("list");
  }, []);

  function changeView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("timingrx-evidence-view", mode);
  }

  if (sources.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight">
            Key Evidence Sources
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sources.length} source{sources.length !== 1 ? "s" : ""}
            </Badge>
            <div className="flex gap-1">
              <button
                onClick={() => changeView("card")}
                className={`text-xs px-1.5 py-0.5 rounded ${viewMode === "card" ? "bg-muted" : "text-muted-foreground hover:bg-muted/50"}`}
                title="Card view"
              >
                ▦
              </button>
              <button
                onClick={() => changeView("list")}
                className={`text-xs px-1.5 py-0.5 rounded ${viewMode === "list" ? "bg-muted" : "text-muted-foreground hover:bg-muted/50"}`}
                title="List view"
              >
                ≡
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="border rounded-lg p-3 bg-muted/20"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <EvidenceSourceTypeBadge type={src.type} />
                  <span className="font-semibold text-xs">{src.name}</span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline ml-auto"
                    >
                      ↗
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {src.yearStarted && `Est. ${src.yearStarted}`}
                  {src.yearStarted && src.region && " · "}
                  {src.region}
                </div>
                {teachingMode && src.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {src.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {sources.map((src) => (
              <div key={src.id}>
                <div className="flex items-center gap-2 flex-wrap">
                  <EvidenceSourceTypeBadge type={src.type} />
                  <span className="text-sm font-medium">{src.name}</span>
                  {src.yearStarted && (
                    <span className="text-xs text-muted-foreground">
                      · {src.yearStarted}
                    </span>
                  )}
                  {src.region && (
                    <span className="text-xs text-muted-foreground">
                      · {src.region}
                    </span>
                  )}
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      ↗
                    </a>
                  )}
                </div>
                {teachingMode && src.description && (
                  <div className="ml-6 mt-1 border rounded-md p-2 bg-muted/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {src.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
