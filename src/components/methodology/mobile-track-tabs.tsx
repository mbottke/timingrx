"use client";
import { useState, type ReactNode } from "react";

interface MobileTrackTabsProps {
  visual: ReactNode;
  math: ReactNode;
}

export function MobileTrackTabs({ visual, math }: MobileTrackTabsProps) {
  const [tab, setTab] = useState<"visual" | "math">("visual");
  return (
    <>
      <div className="flex gap-1 mb-3 lg:hidden">
        <button onClick={() => setTab("visual")} className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${tab === "visual" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Visual</button>
        <button onClick={() => setTab("math")} className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${tab === "math" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Math</button>
      </div>
      <div className="hidden lg:contents">{visual}{math}</div>
      <div className="lg:hidden">{tab === "visual" ? visual : math}</div>
    </>
  );
}
