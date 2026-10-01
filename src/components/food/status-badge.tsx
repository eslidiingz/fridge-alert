"use client";

import { motion } from "motion/react";
import { describeDays, type ExpiryStatus } from "@/lib/expiry";
import { cn } from "@/lib/utils";
import { STATUS_STYLE } from "./status-style";

export function StatusBadge({ status, daysLeft }: { status: ExpiryStatus; daysLeft: number }) {
  const pulsing = status === "expired" || status === "urgent";
  return (
    <motion.span
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        STATUS_STYLE[status].pill,
      )}
    >
      <span className="relative flex size-2">
        {pulsing && (
          <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-75", STATUS_STYLE[status].bar)} />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", STATUS_STYLE[status].bar)} />
      </span>
      {describeDays(daysLeft)}
    </motion.span>
  );
}
