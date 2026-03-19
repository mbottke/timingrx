"use client";

import { useEffect, useRef, useState } from "react";

interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: "baseline", label: "Baseline" },
  { id: "multiplication", label: "Factors" },
  { id: "ci-propagation", label: "Uncertainty" },
  { id: "confidence", label: "Confidence" },
  { id: "or-correction", label: "Correction" },
  { id: "grade-mapping", label: "Grades" },
];

export function SectionNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Strip the "section-" prefix to get the raw section id
            const rawId = entry.target.id.replace(/^section-/, "");
            setActiveId(rawId);
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    observerRef.current = observer;

    for (const section of SECTIONS) {
      const el = document.getElementById(`section-${section.id}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      aria-label="Methodology sections"
      className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 xl:flex xl:flex-col xl:gap-3"
    >
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Jump to ${section.label} section`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2"
          >
            {/* Dot */}
            <span
              className={[
                "block rounded-full transition-all duration-200",
                isActive
                  ? "size-3 bg-primary"
                  : "size-2 bg-muted-foreground/40 group-hover:bg-muted-foreground/70",
              ].join(" ")}
            />
            {/* Label — visible on hover or when active */}
            <span
              className={[
                "whitespace-nowrap text-xs font-medium transition-opacity duration-150",
                isActive
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100",
              ].join(" ")}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
