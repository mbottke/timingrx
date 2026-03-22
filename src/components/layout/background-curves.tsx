"use client";

/**
 * Background Curves — renders the animated diverging risk curves as a
 * fixed full-viewport background layer. Sits behind all page content
 * so glass surfaces (backdrop-filter: blur) naturally refract the lines
 * as they scroll past.
 */

import { AnimatedHero } from "./animated-hero";

export function BackgroundCurves() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <AnimatedHero className="w-full h-full" />
    </div>
  );
}
