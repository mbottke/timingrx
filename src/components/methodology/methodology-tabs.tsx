"use client";

import { useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "explorer" | "pipeline" | "timeline";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "explorer", label: "Explorer" },
  { id: "pipeline", label: "Pipeline" },
  { id: "timeline", label: "Timeline" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface MethodologyTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MethodologyTabs({ activeTab, onTabChange }: MethodologyTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const tabs = tabRefs.current.filter((r): r is HTMLButtonElement => r !== null);
    if (tabs.length === 0) return;

    const focused = document.activeElement;
    const currentIdx = tabs.indexOf(focused as HTMLButtonElement);

    let nextIdx: number | null = null;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIdx = (currentIdx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = tabs.length - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentIdx >= 0) {
        onTabChange(TABS[currentIdx].id);
      }
      return;
    }

    if (nextIdx !== null) {
      tabs[nextIdx].focus();
      onTabChange(TABS[nextIdx].id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Methodology views"
      className="flex items-center gap-1 border-b border-border px-4"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[idx] = el; }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={[
              "relative px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "bg-primary text-primary-foreground rounded-t-md"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted rounded-t-md",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
