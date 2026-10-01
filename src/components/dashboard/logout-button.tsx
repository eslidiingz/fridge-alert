"use client";

import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { logout } from "@/actions/auth";
import { Sheet } from "@/components/motion/sheet";
import { Spinner, TapButton } from "@/components/motion/tap-button";

export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      try {
        await logout();
      } catch (err) {
        // redirect() is thrown as a special error and handled by Next; anything else is a real failure.
        if (err instanceof Error && !("digest" in err)) toast.error("ออกจากระบบไม่สำเร็จ ลองใหม่อีกครั้ง");
        else throw err;
      }
    });
  }

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-xl border border-border bg-background/50 text-foreground/70 backdrop-blur hover:text-red-500"
        aria-label="ออกจากระบบ"
        title="ออกจากระบบ"
      >
        <LogOut className="size-5" />
      </motion.button>

      <Sheet open={open} onClose={() => !pending && setOpen(false)} title="ออกจากระบบ?">
        <div className="flex flex-col items-center gap-4 pb-1 pt-2 text-center">
          <motion.div
            initial={{ scale: 0, x: -10 }}
            animate={{ scale: 1, x: [0, 6, 0] }}
            transition={{ scale: { type: "spring", stiffness: 300, damping: 15 }, default: { duration: 0.5, ease: "easeOut" } }}
            className="grid size-16 place-items-center rounded-full bg-red-500/15 text-red-500"
          >
            <LogOut className="size-8" />
          </motion.div>
          <p className="text-sm text-muted-foreground">ต้องการออกจากระบบใช่ไหม? ต้องเข้าสู่ระบบใหม่เพื่อจัดการรายการอาหาร</p>
          <div className="grid w-full grid-cols-2 gap-3">
            <TapButton type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              ยกเลิก
            </TapButton>
            <TapButton type="button" variant="danger" onClick={confirm} disabled={pending}>
              {pending ? <Spinner /> : <LogOut className="size-5" />}
              ออกจากระบบ
            </TapButton>
          </div>
        </div>
      </Sheet>
    </>
  );
}
