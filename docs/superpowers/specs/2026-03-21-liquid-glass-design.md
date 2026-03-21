# Liquid Glass Design Pass — Kairos

**Date:** 2026-03-21
**Branch:** `feat/liquid-glass` (new branch for user review before merge)
**Approach:** CSS utility classes + inline SVG filter (Approach A)

---

## 1. Overview

Apply an iOS 26 "Liquid Glass" aesthetic across the entire Kairos app. Every surface gets glass material treatment. SVG refraction is reserved for hero + overlay surfaces. Full parallax tilt interaction on desktop. Light and dark modes each have a distinct personality — frosted ice (light) and smoky refractive glass (dark).

## 2. Glass Material System (CSS)

Three composable utility classes added to `src/app/globals.css`. Theme-aware via `:root` and `.dark` selectors.

### 2.1 `.liquid-glass` — Base Material

Applied to every card, panel, and surface.

**Light mode (`:root`):**
- `background: rgba(255, 255, 255, 0.7)`
- `backdrop-filter: blur(16px) saturate(1.6)`
- `::before` — diagonal highlight gradient: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`
- `::after` — specular rim: `border: 1px solid` with `rgba(255,255,255,0.3)` top edge fading to transparent at bottom
- `inset box-shadow: 0 1px 0 rgba(255,255,255,0.4)` top edge catch light

**Dark mode (`.dark`):**
- `background: rgba(20, 20, 45, 0.45)` — purple-tinted to pick up brand gradient
- `backdrop-filter: blur(20px) saturate(1.8)` — stronger than light mode
- `::before` — highlight gradient: `rgba(200, 180, 255, 0.12)` → transparent (warm purple tint)
- `::after` — specular rim: `rgba(255,255,255,0.15)` (dimmer than light mode)
- Multi-layer depth shadow:
  ```
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 2px 4px rgba(0,0,0,0.2),
    0 8px 24px rgba(0,0,0,0.3);
  ```

**Structural requirements:**
- Elements using `.liquid-glass` must have `position: relative` and `overflow: hidden` (for pseudo-elements)
- `border-radius: inherit` on pseudo-elements
- `pointer-events: none` on pseudo-elements
- `z-index: 1` on pseudo-elements so they overlay content subtly

### 2.2 `.liquid-glass-transparent` — Selective Transparency

Applied to surfaces where seeing-through is intentional: hero section, stat cards (home), command palette, dialogs, sheets.

**Light mode:**
- `background: rgba(255, 255, 255, 0.4)` (overrides `.liquid-glass` background)

**Dark mode:**
- `background: rgba(20, 20, 45, 0.3)` (overrides `.liquid-glass` background)

### 2.3 `.liquid-glass-refract` — SVG Displacement Filter

Applied to hero section, CommandDialog, Dialog, Sheet overlays.

- `filter: url(#liquid-glass-refract)` — references the shared inline SVG filter

## 3. SVG Refraction Filter

A single inline `<svg>` element added to `src/app/layout.tsx`. Hidden with `width="0" height="0"` and `position: absolute`.

### 3.1 Filter Definition (`<filter id="liquid-glass-refract">`)

```xml
<feTurbulence
  type="fractalNoise"
  baseFrequency="0.008 0.008"
  numOctaves="3"
  seed="1"
  result="noise"
/>
<feGaussianBlur
  in="noise"
  stdDeviation="2"
  result="smoothNoise"
/>
<feDisplacementMap
  in="SourceGraphic"
  in2="smoothNoise"
  scale="15"
  xChannelSelector="R"
  yChannelSelector="G"
  result="displaced"
/>
<feSpecularLighting
  in="smoothNoise"
  surfaceScale="3"
  specularConstant="0.75"
  specularExponent="20"
  lighting-color="#ffffff"
  result="specular"
>
  <fePointLight x="-100" y="-200" z="300" />
</feSpecularLighting>
<feBlend
  in="displaced"
  in2="specular"
  mode="screen"
  result="final"
/>
```

### 3.2 Animated Refraction (Hero Only)

In `src/components/layout/animated-hero.tsx`, a `useEffect` + `requestAnimationFrame` loop oscillates the `feTurbulence` `baseFrequency`:

- Oscillation range: `0.008 ± 0.002` (i.e., `0.006` to `0.010`)
- Speed: `time += 0.005` per frame (very slow, matching the calm ethereal motion of the existing hero curves)
- Uses `Math.sin(time)` for x-axis, `Math.cos(time * 0.7)` for y-axis (different frequencies prevent repetitive patterns)
- Only targets the hero's filter element — overlays use a separate static filter instance or the same filter without animation

**Important:** The hero needs its own filter ID (e.g., `liquid-glass-refract-hero`) separate from the static overlay filter, since the animation mutates the filter's attributes.

## 4. Parallax Tilt Hook

### 4.1 `useLiquidTilt()` — `src/lib/hooks/use-liquid-tilt.ts`

**Signature:** `useLiquidTilt(ref: RefObject<HTMLElement | null>): void`

**Desktop detection:** Checks `window.matchMedia('(pointer: fine)')` on mount. If false (touch device), hook is a complete no-op — no listeners, no computation.

**Mouse interaction:**
- `mousemove` on the ref element:
  - Calculate cursor position relative to element center as normalized values (-0.5 to 0.5)
  - Apply `transform: perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)` — max 5deg rotation
  - Set CSS custom properties `--tilt-x` and `--tilt-y` on the element for the specular highlight pseudo-element to read
- `mouseleave`:
  - Reset transform to `perspective(800px) rotateY(0deg) rotateX(0deg)`
  - Reset `--tilt-x` and `--tilt-y` to `0`
  - Element has `transition: transform 0.4s ease-out` for smooth return

**Implementation details:**
- Direct DOM manipulation via `ref.current.style` — no React state, no re-renders
- Each card registers `mousemove`/`mouseleave` on itself only — only the hovered card runs any code
- Uses `requestAnimationFrame` to throttle transform updates

### 4.2 Specular Highlight Tracking

The `.liquid-glass::before` pseudo-element reads `--tilt-x` and `--tilt-y` to shift its gradient origin:

```css
.liquid-glass::before {
  background: radial-gradient(
    circle at calc(50% + var(--tilt-x, 0) * 60%) calc(50% + var(--tilt-y, 0) * 60%),
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
}
```

**Dark mode:** Higher opacity shift — `rgba(255,255,255,0.2)` center (vs `0.3` in light) but the contrast against the dark surface makes it *more* visible, not less.

## 5. Surface Application Map

| Surface | `.liquid-glass` | `.liquid-glass-transparent` | `.liquid-glass-refract` | `useLiquidTilt()` |
|---|---|---|---|---|
| Header | Yes | No | No | No |
| Stat cards (home) | Yes | Yes | No | Yes |
| Category cards (home) | Yes | No | No | Yes |
| Condition cards (conditions page) | Yes | No | No | Yes |
| Calculator sidebar panels | Yes | No | No | No |
| Hero section (behind animated curves) | Yes | Yes | Yes (animated) | No |
| Command palette (CommandDialog) | Yes | Yes | Yes (static) | No |
| Dialog overlays | Yes | Yes | Yes (static) | No |
| Sheet overlays | Yes | Yes | Yes (static) | No |
| Footer | No | No | No | No |
| Badges/small elements | No | No | No | No |

## 6. Theme Personalities

### 6.1 Light Mode — "Frosted Ice"

- High-opacity frost on most surfaces (`rgba(255,255,255,0.7)`)
- Selective transparency only on hero, stat cards, overlays (`rgba(255,255,255,0.4)`)
- Crisp white specular highlights
- Subtle shadows — just enough to separate layers
- Clinical readability preserved; glass is a material treatment, not a distraction

### 6.2 Dark Mode — "Smoky Glass"

- Purple-tinted translucency (`rgba(20,20,45,0.45)`)
- Stronger `backdrop-filter` blur and saturation
- Warm-purple specular highlights (`rgba(200,180,255,0.12)`)
- Multi-layer depth shadows for floating-slab effect
- Brighter specular tracking on tilt interaction (higher contrast against dark surface)
- Existing gradient glow effects (`glow-hover`, `white-glow`, `kairos-card-hover`) layer on top

## 7. Preserved Existing Effects

The following existing CSS classes are preserved and layer on top of the glass material:

- `kairos-card-hover` — gradient border on hover via `::before` mask trick
- `glow-hover` — dark mode box-shadow glow on hover
- `white-glow` — white box-shadow glow on condition cards in dark mode
- `kairos-gradient-text` — gradient text on stat numbers
- `kairos-divider` — gradient section dividers
- `kairos-heading` — gradient underline on h1 elements

**Removed:**
- `.dark .glass-card` in globals.css — superseded by `.liquid-glass` dark mode variant

## 8. Interaction with Existing Pseudo-Elements

**Conflict:** `kairos-card-hover` already uses `::before` for gradient border masking. `.liquid-glass` also uses `::before` for the specular highlight.

**Resolution:** Wrap the specular highlight in a child `<span>` element with class `.liquid-glass-highlight` instead of using `::before`, OR use `::before` for glass highlight and move the `kairos-card-hover` gradient border to use an `outline` or `box-shadow` approach instead.

**Recommended:** Use a dedicated `<span class="liquid-glass-highlight">` inside glass surfaces. This avoids pseudo-element collision entirely and allows both effects to coexist.

**Alternative for the `::after` specular rim:** This can remain as `::after` since `kairos-card-hover` only uses `::before`.

## 9. Files Modified

- `src/app/globals.css` — add `.liquid-glass`, `.liquid-glass-transparent`, `.liquid-glass-refract` classes; remove `.dark .glass-card`
- `src/app/layout.tsx` — add inline SVG filter definitions (static + animated)
- `src/lib/hooks/use-liquid-tilt.ts` — new file, parallax tilt hook
- `src/components/layout/animated-hero.tsx` — add animated refraction driving logic
- `src/app/page.tsx` — add glass classes to stat cards, category cards, hero section
- `src/components/condition/condition-card.tsx` — add glass class + tilt hook
- `src/components/layout/header.tsx` — add glass class (translucent bg replacing opaque)
- `src/components/layout/command-palette.tsx` — add glass + refract classes
- `src/app/calculator/page.tsx` — add glass classes to panels
- `src/app/conditions/page.tsx` — no change (cards handled via ConditionCard component)
- `src/components/ui/dialog.tsx` — add glass + refract classes to overlay
- `src/components/ui/sheet.tsx` — add glass + refract classes to overlay
- `src/app/about/page.tsx` — replace `glass-card` with `liquid-glass`

## 10. Performance Considerations

- **SVG filter refraction:** Only applied to 1-4 surfaces at any time (hero + at most one overlay). Not applied to card grids.
- **Parallax tilt:** Direct DOM manipulation, no React state. Only the single hovered card runs any code. `requestAnimationFrame` throttled.
- **Animated refraction:** Single `requestAnimationFrame` loop for the hero filter. Pauses when hero is not visible (could use IntersectionObserver, but hero is above-fold so this is optional).
- **backdrop-filter on 167 cards:** This is the most expensive effect. Modern browsers handle this well for static content; scrolling performance may vary. If issues arise, `will-change: transform` on cards and `content-visibility: auto` on off-screen sections are fallback optimizations.
- **`prefers-reduced-motion`:** All animations (tilt, refraction oscillation, hover transitions) should respect `prefers-reduced-motion: reduce` by disabling or reducing them.
