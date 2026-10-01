"use client";

import { motion } from "motion/react";
import { TapButton } from "@/components/motion/tap-button";

export default function DashboardError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="text-5xl">🥶</div>
        <p className="font-semibold">โหลดข้อมูลไม่สำเร็จ</p>
        <p className="text-sm text-muted-foreground">ตรวจสอบการเชื่อมต่อฐานข้อมูล แล้วลองใหม่อีกครั้ง</p>
        <TapButton onClick={() => retry()}>ลองใหม่</TapButton>
      </motion.div>
    </main>
  );
}
