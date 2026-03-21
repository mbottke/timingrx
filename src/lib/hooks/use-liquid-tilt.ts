"use client";

import { useEffect, type RefObject } from "react";

/**
 * Parallax tilt hook — applies perspective tilt + specular highlight tracking
 * on mousemove. Desktop-only (pointer: fine), respects prefers-reduced-motion.
 * Direct DOM manipulation — no React state, no re-renders.
 */
export function useLiquidTilt(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined") return;
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isPointerFine || prefersReducedMotion) return;

    let rafId: number | null = null;

    function onMouseMove(e: MouseEvent) {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        el.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        el.style.setProperty("--tilt-x", String(x));
        el.style.setProperty("--tilt-y", String(y));
      });
    }

    function onMouseLeave() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (!el) return;
      el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
      el.style.setProperty("--tilt-x", "0");
      el.style.setProperty("--tilt-y", "0");
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref]);
}
