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
