"use client";

import { motion } from "motion/react";
import { STATUS_META, type ExpiryStatus } from "@/lib/expiry";
import { cn } from "@/lib/utils";

export type Filter = ExpiryStatus | "all";
const TABS: Filter[] = ["all", "expired", "urgent", "soon", "fresh"];

export function FilterTabs({ value, onChange, counts }: { value: Filter; onChange: (f: Filter) => void; counts: Record<Filter, number> }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <div role="tablist" className="flex w-max gap-1 rounded-2xl border border-border bg-card/50 p-1">
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
                "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
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
