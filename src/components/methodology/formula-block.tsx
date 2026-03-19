"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Re-export AnimatePresence for consumer convenience
export { AnimatePresence };

// ── FormulaLine ───────────────────────────────────────────────────────────────

export interface FormulaLineProps {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export function FormulaLine({
  children,
  highlight = false,
  className,
}: FormulaLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "font-mono text-sm leading-relaxed",
        highlight && "rounded bg-primary/10 px-1 font-semibold text-primary",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ── FormulaBlock ──────────────────────────────────────────────────────────────

export interface FormulaBlockProps {
  title?: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormulaBlock({
  title,
  accentColor = "border-primary",
  children,
  className,
}: FormulaBlockProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/40 p-4",
        "border-l-4",
        accentColor,
        className
      )}
    >
      {title && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
