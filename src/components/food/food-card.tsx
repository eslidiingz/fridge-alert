"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { CalendarDays, Package, Tag, Trash2 } from "lucide-react";
import { forwardRef, useRef } from "react";
import { formatThaiDate } from "@/lib/expiry";
import type { FoodView } from "@/lib/food";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { STATUS_STYLE } from "./status-style";

const SWIPE_THRESHOLD = -96;

export const FoodCard = forwardRef<
  HTMLLIElement,
  { item: FoodView; index: number; onEdit: (item: FoodView) => void; onDelete: (item: FoodView) => void }
>(function FoodCard({ item, index, onEdit, onDelete }, ref) {
  const x = useMotionValue(0);
  const trashOpacity = useTransform(x, [-120, -30, 0], [1, 0.4, 0]);
  const trashScale = useTransform(x, [-120, -40], [1.15, 0.7]);

  const dragged = useRef(false);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < SWIPE_THRESHOLD) onDelete(item);
    // The click event fires right after pointerup; ignore it when the user was swiping.
    setTimeout(() => (dragged.current = false), 0);
  }

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(index * 0.04, 0.4), type: "spring", stiffness: 300, damping: 26 } }}
      exit={{ opacity: 0, x: -120, scale: 0.9, transition: { duration: 0.25 } }}
      className="relative list-none"
    >
      {/* swipe-to-delete backdrop */}
      <motion.div
        style={{ opacity: trashOpacity }}
        className="absolute inset-0 flex items-center justify-end rounded-2xl bg-red-500/90 pr-6 text-white"
        aria-hidden
      >
        <motion.span style={{ scale: trashScale }}>
          <Trash2 className="size-6" />
        </motion.span>
      </motion.div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.6, right: 0.05 }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        className="relative flex cursor-pointer touch-pan-y items-stretch overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        onClick={() => {
          if (!dragged.current) onEdit(item);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(item);
          }
        }}
        aria-label={`แก้ไข ${item.name}`}
      >
        <span className={cn("w-1.5 shrink-0", STATUS_STYLE[item.status].bar)} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 break-words text-base font-semibold leading-snug">{item.name}</h3>
            <StatusBadge status={item.status} daysLeft={item.daysLeft} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatThaiDate(item.expiresAt)}
            </span>
            {item.category && (
              <span className="inline-flex items-center gap-1">
                <Tag className="size-3.5" />
                {item.category}
              </span>
            )}
            {item.quantity && (
              <span className="inline-flex items-center gap-1">
                <Package className="size-3.5" />
                {item.quantity}
              </span>
            )}
          </div>
          {item.note && <p className="line-clamp-2 text-sm text-foreground/70">{item.note}</p>}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="hidden w-12 shrink-0 place-items-center text-muted-foreground hover:text-red-500 sm:grid"
          aria-label={`ลบ ${item.name}`}
        >
          <Trash2 className="size-5" />
        </motion.button>
      </motion.div>
    </motion.li>
  );
});
