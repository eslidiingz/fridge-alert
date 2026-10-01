"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { TapButton } from "@/components/motion/tap-button";

export function EmptyState({ filtered, onAdd }: { filtered: boolean; onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border px-6 py-14 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="text-6xl"
        aria-hidden
      >
        {filtered ? "🔍" : "🧊"}
      </motion.div>
      <div>
        <p className="font-semibold">{filtered ? "ไม่มีรายการในหมวดนี้" : "ตู้เย็นยังว่างอยู่"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered ? "ลองเลือกตัวกรองอื่นดูนะ" : "เพิ่มอาหารพร้อมวันหมดอายุ แล้วเราจะคอยเตือนให้"}
        </p>
      </div>
      {!filtered && (
        <TapButton type="button" onClick={onAdd}>
          <Plus className="size-5" />
          เพิ่มรายการแรก
        </TapButton>
      )}
    </motion.div>
  );
}
