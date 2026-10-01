"use client";

import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteFood } from "@/actions/food";
import { Sheet } from "@/components/motion/sheet";
import { Spinner, TapButton } from "@/components/motion/tap-button";
import type { FoodView } from "@/lib/food";

export function ConfirmDelete({ item, open, onClose }: { item: FoodView | null; open: boolean; onClose: () => void }) {
  const [pending, startTransition] = useTransition();

  function confirm() {
    if (!item) return;
    startTransition(async () => {
      const res = await deleteFood(item.id);
      if (res.ok) {
        toast.success(`ลบ "${item.name}" แล้ว`);
        onClose();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Sheet open={open && !!item} onClose={onClose} title="ลบรายการ?">
      <div className="flex flex-col items-center gap-4 pb-1 pt-2 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -6, 0] }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="grid size-16 place-items-center rounded-full bg-red-500/15 text-red-500"
        >
          <Trash2 className="size-8" />
        </motion.div>
        <p className="text-sm text-muted-foreground">
          ต้องการลบ <span className="font-semibold text-foreground">{item?.name}</span> ออกจากรายการใช่ไหม?
        </p>
        <div className="grid w-full grid-cols-2 gap-3">
          <TapButton type="button" variant="outline" onClick={onClose} disabled={pending}>
            ยกเลิก
          </TapButton>
          <TapButton type="button" variant="danger" onClick={confirm} disabled={pending}>
            {pending ? <Spinner /> : <Trash2 className="size-5" />}
            ลบ
          </TapButton>
        </div>
      </div>
    </Sheet>
  );
}
