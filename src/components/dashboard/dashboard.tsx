"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ConfirmDelete } from "@/components/food/confirm-delete";
import { FoodCard } from "@/components/food/food-card";
import { FoodForm } from "@/components/food/food-form";
import { Sheet } from "@/components/motion/sheet";
import type { ExpiryStatus } from "@/lib/expiry";
import type { FoodView } from "@/lib/food";
import { EmptyState } from "./empty-state";
import { FilterTabs, type Filter } from "./filter-tabs";
import { Stats } from "./stats";

type EditorState = { open: boolean; item?: FoodView; key: number };

export function Dashboard({ items }: { items: FoodView[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [editor, setEditor] = useState<EditorState>({ open: false, key: 0 });
  const [deleting, setDeleting] = useState<{ open: boolean; item: FoodView | null }>({ open: false, item: null });

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, expired: 0, urgent: 0, soon: 0, fresh: 0 };
    for (const i of items) c[i.status]++;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((i) => i.status === filter);

  const openAdd = useCallback(() => setEditor((e) => ({ open: true, item: undefined, key: e.key + 1 })), []);
  const openEdit = useCallback((item: FoodView) => setEditor((e) => ({ open: true, item, key: e.key + 1 })), []);
  const closeEditor = useCallback(() => setEditor((e) => ({ ...e, open: false })), []);
  const askDelete = useCallback((item: FoodView) => setDeleting({ open: true, item }), []);
  const closeDelete = useCallback(() => setDeleting((d) => ({ ...d, open: false })), []);

  return (
    <>
      <section className="flex flex-col gap-5">
        <Stats counts={counts as Record<ExpiryStatus, number>} active={filter} onSelect={setFilter} />
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />

        <AnimatePresence mode="popLayout" initial={false}>
          {visible.length === 0 ? (
            <EmptyState key={`empty-${filter}`} filtered={filter !== "all" && items.length > 0} onAdd={openAdd} />
          ) : (
            <motion.ul key="list" layout className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {visible.map((item, index) => (
                  <FoodCard key={item.id} item={item} index={index} onEdit={openEdit} onDelete={askDelete} />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>

        {items.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pb-2 text-center text-xs text-muted-foreground sm:hidden"
          >
            แตะเพื่อแก้ไข · ปัดซ้ายเพื่อลบ
          </motion.p>
        )}
      </section>

      {/* Floating add button */}
      <motion.button
        type="button"
        onClick={openAdd}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.08, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 }}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 z-40 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/40 sm:right-[max(1.5rem,calc((100vw-48rem)/2))]"
        aria-label="เพิ่มรายการอาหาร"
      >
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/30 [animation-duration:2.5s]" aria-hidden />
        <Plus className="relative size-7" />
      </motion.button>

      <Sheet open={editor.open} onClose={closeEditor} title={editor.item ? "แก้ไขรายการ" : "เพิ่มอาหาร"}>
        <FoodForm key={editor.key} item={editor.item} onDone={closeEditor} />
      </Sheet>

      <ConfirmDelete item={deleting.item} open={deleting.open} onClose={closeDelete} />
    </>
  );
}
