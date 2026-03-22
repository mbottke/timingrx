"use client";

/**
 * Gradient Mesh + Aurora Background
 *
 * Renders animated radial gradient blobs behind all page content, giving
 * backdrop-filter: blur() on glass surfaces something rich to refract.
 *
 * Light mode: soft pastel blobs (blue, purple, pink) at low opacity.
 * Dark mode: deeper, more saturated blobs with aurora-like conic rotation.
 *
 * Uses CSS animations only — no JS, no re-renders, zero React overhead.
 * The element is `position: fixed` behind everything with `z-index: -1`.
 */

export function GradientMesh() {
  return (
    <div
      aria-hidden="true"
      className="gradient-mesh"
    >
      {/* Blob layer — multiple radial gradients that drift */}
      <div className="gradient-mesh-blob gradient-mesh-blob-1" />
      <div className="gradient-mesh-blob gradient-mesh-blob-2" />
      <div className="gradient-mesh-blob gradient-mesh-blob-3" />
      <div className="gradient-mesh-blob gradient-mesh-blob-4" />

      {/* Aurora layer — conic gradient with slow rotation (dark mode only) */}
      <div className="gradient-mesh-aurora" />
    </div>
  );
}
