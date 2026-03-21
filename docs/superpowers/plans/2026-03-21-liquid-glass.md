# Liquid Glass Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply iOS 26 "Liquid Glass" aesthetic across the entire Kairos app — translucent glass surfaces, SVG refraction on hero + overlays, parallax tilt on cards, frosted-ice light mode, smoky dark mode.

**Architecture:** CSS utility classes (`.liquid-glass`, `.liquid-glass-transparent`, `.liquid-glass-refract`, `.liquid-glass-highlight`) in globals.css. Two inline SVG filter definitions in root layout (static + animated). A `useLiquidTilt()` hook for desktop parallax. Applied to all card/panel surfaces via className additions.

**Tech Stack:** CSS (backdrop-filter, custom properties), SVG filters (feTurbulence, feDisplacementMap, feSpecularLighting), React hooks (useRef, useEffect, requestAnimationFrame), Framer Motion (useAnimationFrame in existing hero).

**Branch:** `feat/liquid-glass` — create before starting work.

**Spec:** `docs/superpowers/specs/2026-03-21-liquid-glass-design.md`

---

## Chunk 1: Foundation — CSS Classes + SVG Filters + Tilt Hook

### Task 1.1: Create branch and add CSS glass classes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feat/liquid-glass
```

- [ ] **Step 2: Add `.liquid-glass` base class to globals.css**

Add after the existing `.dark .glass-card` block (which will be removed). The class needs both light and dark variants:

```css
/* ═══ Liquid Glass Material System ═══════════════════════════════════ */

/* Base glass material — translucent surface with backdrop blur */
.liquid-glass {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px) saturate(1.6);
  -webkit-backdrop-filter: blur(16px) saturate(1.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.4s ease-out;
}

/* Specular rim — top-bright, bottom-transparent border */
.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  border: 1px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.3);
  border-left-color: rgba(255, 255, 255, 0.15);
}

/* Dark mode — smoky glass */
.dark .liquid-glass {
  background: rgba(20, 20, 45, 0.45);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.dark .liquid-glass::after {
  border-top-color: rgba(255, 255, 255, 0.15);
  border-left-color: rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 3: Add `.liquid-glass-transparent` class**

```css
/* Selective transparency — for hero, stat cards, overlays */
.liquid-glass-transparent {
  background: rgba(255, 255, 255, 0.4);
}

.dark .liquid-glass-transparent {
  background: rgba(20, 20, 45, 0.3);
}
```

- [ ] **Step 4: Add `.liquid-glass-highlight` class**

```css
/* Specular highlight span — tracks cursor via --tilt-x / --tilt-y */
.liquid-glass-highlight {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    circle at calc(50% + var(--tilt-x, 0) * 60%) calc(50% + var(--tilt-y, 0) * 60%),
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
}

.dark .liquid-glass-highlight {
  background: radial-gradient(
    circle at calc(50% + var(--tilt-x, 0) * 60%) calc(50% + var(--tilt-y, 0) * 60%),
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
}
```

- [ ] **Step 5: Add `.liquid-glass-refract` class**

```css
/* SVG refraction filter — applied to WRAPPER elements only */
.liquid-glass-refract {
  filter: url(#liquid-glass-refract);
}

.liquid-glass-refract-hero {
  filter: url(#liquid-glass-refract-hero);
}
```

- [ ] **Step 6: Add reduced-motion overrides**

```css
@media (prefers-reduced-motion: reduce) {
  .liquid-glass {
    transition: none;
  }
}
```

- [ ] **Step 7: Remove the old `.dark .glass-card` class**

Remove these lines from globals.css (around line 444-448):
```css
/* Phase 3: Dark mode glass card surfaces */
.dark .glass-card {
  backdrop-filter: blur(8px);
  background: oklch(0.18 0.01 260 / 0.6);
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add Liquid Glass CSS material system"
```

---

### Task 1.2: Add inline SVG filter definitions to root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the hidden SVG with both filter definitions**

Add right after the opening `<body>` tag, before `<ThemeProvider>`:

```tsx
{/* Liquid Glass SVG filters — hidden, referenced by CSS classes */}
<svg
  aria-hidden="true"
  style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
>
  <defs>
    {/* Static refraction — overlays (command palette, dialogs, sheets) */}
    <filter id="liquid-glass-refract" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.008"
        numOctaves={3}
        seed={1}
        result="noise"
      />
      <feGaussianBlur in="noise" stdDeviation={2} result="smoothNoise" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="smoothNoise"
        scale={15}
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
      <feSpecularLighting
        in="smoothNoise"
        surfaceScale={3}
        specularConstant={0.75}
        specularExponent={20}
        lightingColor="#ffffff"
        result="specular"
      >
        <fePointLight x={-100} y={-200} z={300} />
      </feSpecularLighting>
      <feBlend in="displaced" in2="specular" mode="screen" />
    </filter>

    {/* Animated refraction — hero only (baseFrequency mutated by JS) */}
    <filter id="liquid-glass-refract-hero" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        id="hero-refract-turbulence"
        type="fractalNoise"
        baseFrequency="0.008 0.008"
        numOctaves={3}
        seed={2}
        result="noise"
      />
      <feGaussianBlur in="noise" stdDeviation={2} result="smoothNoise" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="smoothNoise"
        scale={15}
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
      <feSpecularLighting
        in="smoothNoise"
        surfaceScale={3}
        specularConstant={0.75}
        specularExponent={20}
        lightingColor="#ffffff"
        result="specular"
      >
        <fePointLight x={-100} y={-200} z={300} />
      </feSpecularLighting>
      <feBlend in="displaced" in2="specular" mode="screen" />
    </filter>
  </defs>
</svg>
```

Note: The hero filter has `id="hero-refract-turbulence"` on its `feTurbulence` element so the animation loop in `animated-hero.tsx` can find and mutate it via `document.getElementById`.

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Liquid Glass SVG refraction filters to root layout"
```

---

### Task 1.3: Create the `useLiquidTilt()` hook

**Files:**
- Create: `src/lib/hooks/use-liquid-tilt.ts`

- [ ] **Step 1: Write the hook**

```typescript
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

    // Desktop-only, motion-ok
    if (typeof window === "undefined") return;
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isPointerFine || prefersReducedMotion) return;

    let rafId: number | null = null;

    function onMouseMove(e: MouseEvent) {
      if (rafId !== null) return; // throttle to one rAF
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
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
      el.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg)";
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/hooks/use-liquid-tilt.ts
git commit -m "feat: add useLiquidTilt parallax tilt hook"
```

---

## Chunk 2: Hero Refraction Animation

### Task 2.1: Add animated refraction to the hero

**Files:**
- Modify: `src/components/layout/animated-hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add refraction animation loop to animated-hero.tsx**

Add a second `useEffect` after the existing `useEffect` (the `setVisible` timer) that drives the hero refraction filter animation:

```typescript
// Animate the hero refraction filter's turbulence
useEffect(() => {
  if (!visible) return;
  let time = 0;
  let animId: number;

  function animate() {
    time += 0.005;
    const turbulence = document.getElementById("hero-refract-turbulence");
    if (turbulence) {
      const bfx = 0.008 + Math.sin(time) * 0.002;
      const bfy = 0.008 + Math.cos(time * 0.7) * 0.002;
      turbulence.setAttribute("baseFrequency", `${bfx} ${bfy}`);
    }
    animId = requestAnimationFrame(animate);
  }

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReducedMotion) {
    animId = requestAnimationFrame(animate);
  }

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}, [visible]);
```

- [ ] **Step 2: Wrap the hero section in page.tsx with a refraction wrapper**

In `src/app/page.tsx`, the hero `<section>` needs to be wrapped. Change the hero section from:

```tsx
<section className="relative text-center mb-14">
  <AnimatedHero className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none z-0" />
  <div className="relative z-10 mx-auto max-w-2xl">
```

To:

```tsx
<div className="liquid-glass-refract-hero">
  <section className="relative text-center mb-14 liquid-glass liquid-glass-transparent">
    <span className="liquid-glass-highlight" />
    <AnimatedHero className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none z-0" />
    <div className="relative z-[2] mx-auto max-w-2xl">
```

And close with `</div>` after the section's closing `</section>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/animated-hero.tsx src/app/page.tsx
git commit -m "feat: add animated refraction to hero section"
```

---

## Chunk 3: Apply Glass to Home Page Surfaces

### Task 3.1: Glass treatment for stat cards, category cards, and CTAs

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add glass to StatCard component**

The `StatCard` function at the bottom of page.tsx — change:

```tsx
<Card className="overflow-hidden">
  <CardHeader className="p-5 text-center">
```

To:

```tsx
<Card className="liquid-glass liquid-glass-transparent overflow-hidden">
  <span className="liquid-glass-highlight" />
  <CardHeader className="relative z-[2] p-5 text-center">
```

StatCard needs to accept a ref for tilt. Convert StatCard to use `useLiquidTilt`:

```tsx
"use client"; // page.tsx needs this added at top if not already present
```

Since `page.tsx` is a server component, the StatCard with tilt needs to be extracted into a client component OR the page needs `"use client"`. Check if page.tsx already has `"use client"` — it does NOT (it's a server component using only static data).

**Solution:** Create a thin client wrapper `src/components/layout/liquid-glass-card.tsx` that wraps a shadcn `<Card>` with the tilt hook. It renders the real `<Card>` component (not a bare `<div>`) to preserve all shadcn Card styling (border-radius, ring, padding patterns):

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useLiquidTilt } from "@/lib/hooks/use-liquid-tilt";

export function LiquidGlassCard({
  children,
  className = "",
  transparent = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  transparent?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLiquidTilt(ref);

  return (
    <Card
      ref={ref}
      className={`liquid-glass ${transparent ? "liquid-glass-transparent" : ""} ${className}`}
      style={style}
    >
      <span className="liquid-glass-highlight" />
      {children}
    </Card>
  );
}
```

Note: shadcn `<Card>` accepts refs via `React.ComponentProps<"div">` spread — it renders a plain `<div>` with data attributes.

Then in page.tsx, replace `<Card>` with `<LiquidGlassCard>` in StatCard and category cards.

- [ ] **Step 2: Update StatCard to use LiquidGlassCard**

Change StatCard from:
```tsx
<Card className="overflow-hidden">
  <CardHeader className="p-5 text-center">
```

To:
```tsx
<LiquidGlassCard transparent className="overflow-hidden">
  <CardHeader className="relative z-[2] p-5 text-center">
```

- [ ] **Step 3: Update category cards to use LiquidGlassCard**

Change the category card from:
```tsx
<Card
  className={`glow-hover kairos-card-hover h-full border-l-4 ${accent.border} transition-all duration-200 hover:-translate-y-0.5`}
  style={{ "--card-glow": accent.glow } as React.CSSProperties}
>
```

To:
```tsx
<LiquidGlassCard
  className={`glow-hover kairos-card-hover h-full border-l-4 ${accent.border} hover:-translate-y-0.5`}
  style={{ "--card-glow": accent.glow } as React.CSSProperties}
>
```

And update the inner `CardHeader` to add `relative z-[2]`. Change closing `</Card>` to `</LiquidGlassCard>`.

- [ ] **Step 4: Add import for LiquidGlassCard**

```tsx
import { LiquidGlassCard } from "@/components/layout/liquid-glass-card";
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/liquid-glass-card.tsx src/app/page.tsx
git commit -m "feat: apply Liquid Glass to home page stat cards and category cards"
```

---

## Chunk 4: Apply Glass to Condition Cards + Header

### Task 4.1: Glass treatment for condition cards

**Files:**
- Modify: `src/components/condition/condition-card.tsx`

- [ ] **Step 1: Add glass classes and tilt hook**

This is already a client-importable component. Add tilt:

```tsx
import { useRef } from "react";
import { useLiquidTilt } from "@/lib/hooks/use-liquid-tilt";
```

In the component body:
```tsx
const cardRef = useRef<HTMLDivElement>(null);
useLiquidTilt(cardRef);
```

Change the Card element:
```tsx
<Card className="white-glow kairos-card-hover h-full transition-all duration-200 hover:-translate-y-0.5">
```

To:
```tsx
<Card ref={cardRef} className="liquid-glass white-glow kairos-card-hover h-full hover:-translate-y-0.5">
```

Note: shadcn `<Card>` accepts refs via `...props` spread on a plain `<div>` — confirmed by reading `src/components/ui/card.tsx`.

Add the highlight span as the first child inside Card:
```tsx
<span className="liquid-glass-highlight" />
```

Add `relative z-[2]` to `CardHeader`.

The component needs `"use client"` — check if it's already there. It's not explicitly marked but imports from shadcn which are client components. Add `"use client"` at top if missing.

- [ ] **Step 2: Commit**

```bash
git add src/components/condition/condition-card.tsx
git commit -m "feat: apply Liquid Glass + tilt to condition cards"
```

---

### Task 4.2: Glass treatment for header

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Add glass class to header**

The header currently uses:
```tsx
<header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--header-bg)]/95" style={{ paddingTop: "env(safe-area-inset-top)" }}>
```

Change to:
```tsx
<header className="sticky top-0 z-50 liquid-glass" style={{ paddingTop: "env(safe-area-inset-top)" }}>
```

The old `bg-[var(--header-bg)]` and `backdrop-blur` classes are replaced by the `.liquid-glass` class which provides its own backdrop-filter and translucent background.

Add `relative z-[2]` to the inner nav container div so content sits above the glass decorative layers.

Add the highlight span after the opening `<header>` tag:
```tsx
<span className="liquid-glass-highlight" />
```

**Note:** The header background in dark mode will change from the opaque `--header-bg` to the translucent smoky glass. This is intentional — the page content will be subtly visible through the header when scrolling.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat: apply Liquid Glass to header"
```

---

## Chunk 5: Apply Glass to Overlays + Calculator + About

### Task 5.1: Glass treatment for command palette, dialog, and sheet overlays

**Files:**
- Modify: `src/components/layout/command-palette.tsx`
- Modify: `src/components/ui/dialog.tsx`
- Modify: `src/components/ui/sheet.tsx`

- [ ] **Step 1: Add refraction to dialog overlay backdrop**

In `src/components/ui/dialog.tsx`, the `DialogOverlay` component renders the backdrop. Add the refraction class to it:

```tsx
className={cn(
  "fixed inset-0 isolate z-50 bg-black/10 duration-100 liquid-glass-refract supports-backdrop-filter:backdrop-blur-xs data-open:animate-in ...",
```

In `DialogContent`, add glass classes to the popup panel:

```tsx
className={cn(
  "liquid-glass liquid-glass-transparent fixed top-1/2 left-1/2 z-50 ...",
```

Add `<span className="liquid-glass-highlight" />` as first child inside the popup, and add `relative z-[2]` to content wrapper.

- [ ] **Step 2: Add refraction to sheet overlay backdrop**

Same pattern for `src/components/ui/sheet.tsx`:

Add `liquid-glass-refract` to `SheetOverlay`.
Add `liquid-glass liquid-glass-transparent` to `SheetContent` popup.
Add highlight span inside content.

- [ ] **Step 3: Command palette — no additional changes needed**

The command palette uses `CommandDialog` (in `src/components/ui/command.tsx`) which internally renders `<DialogContent>`. Since Step 1 already adds glass classes to `DialogContent` and refraction to `DialogOverlay`, the command palette inherits glass treatment automatically. No changes to `src/components/layout/command-palette.tsx` or `src/components/ui/command.tsx` are needed.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/dialog.tsx src/components/ui/sheet.tsx src/components/layout/command-palette.tsx
git commit -m "feat: apply Liquid Glass + refraction to dialog, sheet, and command palette overlays"
```

---

### Task 5.2: Glass treatment for calculator panels

**Files:**
- Modify: `src/app/calculator/page.tsx`

- [ ] **Step 1: Add glass to the evidence grade key panel**

Change:
```tsx
<div className="mb-6 rounded-lg border bg-card p-4">
```

To:
```tsx
<div className="mb-6 rounded-lg liquid-glass p-4">
  <span className="liquid-glass-highlight" />
```

Add `relative z-[2]` to the content inside.

- [ ] **Step 2: Add glass to the calculator sidebar**

The left sidebar panel area — add `liquid-glass` class to the sidebar wrapper div. The chart area can stay as-is since charts need clear backgrounds for readability.

- [ ] **Step 3: Commit**

```bash
git add src/app/calculator/page.tsx
git commit -m "feat: apply Liquid Glass to calculator panels"
```

---

### Task 5.3: Update about page — replace old glass-card class

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Replace `glass-card` with `liquid-glass`**

Find all instances of `glass-card` and replace with `liquid-glass`:

```tsx
<Card className="liquid-glass border-l-4 border-l-primary">
```

Add highlight spans inside each Card.

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: replace old glass-card with Liquid Glass on about page"
```

---

## Chunk 6: Final Polish + Verification

### Task 6.1: Build verification and visual check

- [ ] **Step 1: Run build**

```bash
cd timingrx && npx next build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 2: Run dev server and visually verify**

```bash
npx next dev
```

Check in Chrome (not Safari):
- Home page: hero has animated refraction, stat cards and category cards have glass + tilt
- Conditions page: all 167 cards have glass + tilt, scroll performance is acceptable
- Calculator: sidebar panels have glass
- Command palette (Cmd+K): overlay has refraction, content panel has glass
- Toggle dark mode: frosted-ice → smoky-glass transition
- About page: cards have glass (no `glass-card` references remain)

- [ ] **Step 3: Check for `glass-card` references anywhere in codebase**

```bash
grep -r "glass-card" src/
```

Expected: No results (all replaced with `liquid-glass`).

- [ ] **Step 4: Final commit if any adjustments were needed**

```bash
git add -A
git commit -m "fix: Liquid Glass polish and adjustments"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin feat/liquid-glass
```
