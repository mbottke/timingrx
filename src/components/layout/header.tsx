"use client";

import Link from "next/link";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { Switch } from "@/components/ui/switch";

export function Header() {
  const { teachingMode, toggleTeachingMode } = useTeachingMode();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg tracking-tight">TimingRx</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/conditions"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Conditions
            </Link>
            <Link
              href="/calculator"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Calculator
            </Link>
            <Link
              href="/evidence"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Evidence
            </Link>
            <Link
              href="/compare"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Compare
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="teaching-mode"
              className="text-xs text-muted-foreground"
            >
              Teaching
            </label>
            <Switch
              id="teaching-mode"
              checked={teachingMode}
              onCheckedChange={toggleTeachingMode}
            />
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </header>
  );
}
