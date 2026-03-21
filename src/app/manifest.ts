import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kairos — Obstetric Decision Intelligence",
    short_name: "Kairos",
    description:
      "Delivery timing decision support with risk calculators, confidence scoring, and interactive visualizations.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a14",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
