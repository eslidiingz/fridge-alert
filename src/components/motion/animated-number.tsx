"use client";

import { animate, useMotionValue, useTransform, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("th-TH"));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [mv, value, reduce]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
