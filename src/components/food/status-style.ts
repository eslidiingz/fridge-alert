import type { ExpiryStatus } from "@/lib/expiry";

export const STATUS_STYLE: Record<ExpiryStatus, { bar: string; pill: string; glow: string; text: string }> = {
  expired: {
    bar: "bg-red-500",
    pill: "bg-red-500/15 text-red-600 ring-red-500/30 dark:text-red-400",
    glow: "from-red-500/25",
    text: "text-red-600 dark:text-red-400",
  },
  urgent: {
    bar: "bg-orange-500",
    pill: "bg-orange-500/15 text-orange-600 ring-orange-500/30 dark:text-orange-400",
    glow: "from-orange-500/25",
    text: "text-orange-600 dark:text-orange-400",
  },
  soon: {
    bar: "bg-amber-400",
    pill: "bg-amber-400/15 text-amber-700 ring-amber-400/30 dark:text-amber-300",
    glow: "from-amber-400/20",
    text: "text-amber-700 dark:text-amber-300",
  },
  fresh: {
    bar: "bg-emerald-500",
    pill: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400",
    glow: "from-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
  },
};
