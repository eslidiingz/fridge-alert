"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { STATUS_STYLE } from "@/components/food/status-style";
import { STATUS_META, type ExpiryStatus } from "@/lib/expiry";
import { cn } from "@/lib/utils";

const ORDER: ExpiryStatus[] = ["expired", "urgent", "soon", "fresh"];

export function Stats({
  counts,
  active,
  onSelect,
}: {
  counts: Record<ExpiryStatus, number>;
  active: ExpiryStatus | "all";
  onSelect: (s: ExpiryStatus | "all") => void;
}) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
    >
      {ORDER.map((s) => {
        const selected = active === s;
        return (
          <motion.button
            key={s}
            type="button"
            variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(selected ? "all" : s)}
            aria-pressed={selected}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-3.5 text-left transition-colors",
              selected ? "border-foreground/30 bg-card" : "border-border bg-card/60",
            )}
          >
            <GlowingEffect spread={36} glow disabled={false} proximity={48} inactiveZone={0.01} borderWidth={2} />
            <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-60", STATUS_STYLE[s].glow)} />
            <div className="relative">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{STATUS_META[s].emoji}</span>
                <span className="truncate">{STATUS_META[s].label}</span>
              </div>
              <AnimatedNumber value={counts[s]} className={cn("mt-1 block text-3xl font-bold tabular-nums", STATUS_STYLE[s].text)} />
            </div>
            {selected && (
              <motion.span layoutId="stat-selected" className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-foreground/50" />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
