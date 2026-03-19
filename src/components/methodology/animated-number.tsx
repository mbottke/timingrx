"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
} from "framer-motion";

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  stiffness?: number;
  damping?: number;
}

export function AnimatedNumber({
  value,
  decimals = 2,
  className,
  suffix,
  stiffness = 200,
  damping = 25,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, { stiffness, damping });
  const displayValue = useTransform(springValue, (v) =>
    v.toFixed(decimals)
  );

  // Keep a ref to the span so we can set initial text content synchronously
  // (important in test environments where framer-motion springs don't animate)
  const spanRef = useRef<HTMLSpanElement>(null);

  // Drive the spring to the new target whenever `value` changes
  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  // Sync the initial text content so tests see the correct value immediately
  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = value.toFixed(decimals);
    }
  }, [value, decimals]);

  return (
    <span className={className}>
      <motion.span ref={spanRef}>{displayValue}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
