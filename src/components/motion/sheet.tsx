"use client";

import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** Bottom sheet on mobile, centered dialog on ≥sm screens. Drag down to dismiss. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = useId();
  const dragControls = useDragControls();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            dragControls={dragControls}
            dragListener={false}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:max-w-lg sm:rounded-3xl",
              className,
            )}
          >
            {/* Drag only from the handle so form fields stay usable. */}
            <div
              className="flex cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing sm:hidden"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1.5 w-12 rounded-full bg-foreground/20" />
            </div>
            <div className="flex items-center justify-between px-5 pb-2 pt-2 sm:pt-5">
              <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                aria-label="ปิด"
              >
                <X className="size-5" />
              </motion.button>
            </div>
            <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
