"use client";

import Link from "next/link";
import { useState } from "react";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "./theme-toggle";
import { KairosLogo } from "./kairos-logo";

const navLinks = [
  { href: "/conditions", label: "Conditions" },
  { href: "/calculator", label: "Risk Curve" },
  { href: "/evidence", label: "Evidence" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "Methodology" },
] as const;

export function Header() {
  const { teachingMode, toggleTeachingMode } = useTeachingMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--header-bg)]/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-transform duration-200 ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-transform duration-200 ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>

          <Link href="/" className="flex items-center">
            <KairosLogo />
          </Link>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[var(--header-muted)] transition-colors hover:text-[var(--header-fg)]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="teaching-mode"
              className="text-xs text-[var(--header-muted)]"
            >
              Teaching
            </label>
            <Switch
              id="teaching-mode"
              checked={teachingMode}
              onCheckedChange={toggleTeachingMode}
            />
          </div>
          <ThemeToggle />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[11px] font-medium text-[var(--header-muted)] sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Teaching mode indicator bar */}
      {teachingMode && (
        <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-[var(--brand-teal)]" />
      )}

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[var(--header-bg)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-[var(--header-muted)] transition-colors hover:bg-white/10 hover:text-[var(--header-fg)]"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-white/10 px-3 pt-3">
              <label className="text-xs text-[var(--header-muted)]">
                Teaching Mode
              </label>
              <Switch
                checked={teachingMode}
                onCheckedChange={toggleTeachingMode}
              />
            </div>
          </div>
        </nav>
      )}

      {/* Gradient bottom edge */}
      <div className="kairos-divider" />
    </header>
  );
}
