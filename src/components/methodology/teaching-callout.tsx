"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Variant configuration ─────────────────────────────────────────────────────

type CalloutVariant = "insight" | "warning" | "note";

const VARIANT_STYLES: Record<
  CalloutVariant,
  { container: string; icon: string; label: string }
> = {
  insight: {
    container:
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    label: "Insight",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    label: "Warning",
  },
  note: {
    container:
      "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30",
    icon: "text-slate-600 dark:text-slate-400",
    label: "Note",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export interface TeachingCalloutProps {
  summary: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  alwaysExpanded?: boolean;
  className?: string;
}

export function TeachingCallout({
  summary,
  children,
  variant = "insight",
  alwaysExpanded = false,
  className,
}: TeachingCalloutProps) {
  const [expanded, setExpanded] = useState(alwaysExpanded);
  const styles = VARIANT_STYLES[variant];

  const isExpandable = !alwaysExpanded;

  return (
    <div
      className={cn("rounded-lg border p-4", styles.container, className)}
      data-variant={variant}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-start gap-2 text-left",
          isExpandable ? "cursor-pointer" : "cursor-default"
        )}
        onClick={isExpandable ? () => setExpanded((v) => !v) : undefined}
        onKeyDown={
          isExpandable
            ? (e) => {
                if (e.key === "Escape" && expanded) {
                  e.preventDefault();
                  setExpanded(false);
                }
              }
            : undefined
        }
        aria-expanded={expanded}
        disabled={!isExpandable}
      >
        <span className={cn("mt-0.5 text-xs font-semibold uppercase tracking-wider", styles.icon)}>
          {styles.label}
        </span>
        <span className="flex-1 text-sm font-medium leading-snug">
          {summary}
        </span>
        {isExpandable && (
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn("mt-0.5 shrink-0", styles.icon)}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="callout-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 text-sm text-muted-foreground">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
