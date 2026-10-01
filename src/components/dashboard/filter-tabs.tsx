"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { STATUS_META, type ExpiryStatus } from "@/lib/expiry";
import { cn } from "@/lib/utils";

export type Filter = ExpiryStatus | "all";
const TABS: Filter[] = ["all", "expired", "urgent", "soon", "fresh"];

export function FilterTabs({ value, onChange, counts }: { value: Filter; onChange: (f: Filter) => void; counts: Record<Filter, number> }) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the selected tab visible when it is chosen from the stat cards.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [value]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card/50">
      <div ref={listRef} role="tablist" className="flex gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const selected = value === t;
          return (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onChange(t)}
              className={cn(
                "relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors sm:flex-1",
                selected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-1.5 whitespace-nowrap">
                {t === "all" ? "ทั้งหมด" : STATUS_META[t].label}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", selected ? "bg-black/15" : "bg-foreground/10")}>
                  {counts[t]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
