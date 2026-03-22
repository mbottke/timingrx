"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "./theme-toggle";
import { KairosLogo } from "./kairos-logo";

const primaryLinks: { href: string; label: string }[] = [
  { href: "/conditions", label: "Conditions" },
  { href: "/calculator", label: "Risk Curve" },
  { href: "/evidence", label: "Evidence" },
  { href: "/compare", label: "Compare" },
];

const moreLinks: { href: string; label: string }[] = [
  { href: "/physiology", label: "Physiology" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/methodology", label: "Methodology" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Header() {
  const { teachingMode, toggleTeachingMode } = useTeachingMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isMoreActive = moreLinks.some(({ href }) => pathname.startsWith(href));

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [moreOpen]);

  function openCommandPalette() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <header className="sticky top-0 z-50 liquid-glass" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <span className="liquid-glass-highlight" />
      <div className="relative z-[2] mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8 xl:px-12">
        <div className="flex items-center gap-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-transform duration-200 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--header-fg)] transition-transform duration-200 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>

          <Link href="/" className="flex items-center">
            <KairosLogo />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-medium md:flex">
            {primaryLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative pb-1 transition-colors hover:text-[var(--header-fg)] ${isActive ? "text-[var(--header-fg)]" : "text-[var(--header-muted)]"}`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "var(--kairos-gradient)" }} />
                  )}
                </Link>
              );
            })}
            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`relative flex items-center gap-1 pb-1 transition-colors hover:text-[var(--header-fg)] ${isMoreActive ? "text-[var(--header-fg)]" : "text-[var(--header-muted)]"}`}
              >
                More
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isMoreActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: "var(--kairos-gradient)" }} />
                )}
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-3 w-44 rounded-xl liquid-glass p-1.5 shadow-xl">
                  {moreLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[13px] text-[var(--header-muted)] transition-colors hover:bg-white/10 hover:text-[var(--header-fg)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
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
          <button
            onClick={openCommandPalette}
            className="hidden h-5 cursor-pointer select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[11px] font-medium text-[var(--header-muted)] hover:bg-white/20 transition-colors sm:flex"
          >
            <span className="text-xs">⌘</span>K
          </button>
        </div>
      </div>

      {/* Teaching mode indicator bar */}
      {teachingMode && (
        <div className="h-[3px]" style={{ background: "var(--kairos-gradient)" }} />
      )}

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[var(--header-bg)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {allLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 hover:text-[var(--header-fg)] ${isActive ? "text-[var(--header-fg)]" : "text-[var(--header-muted)]"}`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full" style={{ background: "var(--kairos-gradient)" }} />
                  )}
                </Link>
              );
            })}
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
