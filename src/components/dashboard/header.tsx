"use client";

import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { BrandMark } from "./brand-mark";
import { PushToggle } from "./push-toggle";
import { ThemeToggle } from "./theme-toggle";

export function DashboardHeader({ todayLabel }: { todayLabel: string }) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="sticky top-0 z-30 -mx-4 border-b border-border/60 bg-background/70 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold leading-tight">ตู้เย็นเตือนภัย</h1>
          <p className="truncate text-xs text-muted-foreground">{todayLabel}</p>
        </div>
        <PushToggle />
        <ThemeToggle />
        <form action={logout}>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            className="grid size-10 place-items-center rounded-xl border border-border bg-background/50 text-foreground/70 backdrop-blur hover:text-red-500"
            aria-label="ออกจากระบบ"
            title="ออกจากระบบ"
          >
            <LogOut className="size-5" />
          </motion.button>
        </form>
      </div>
    </motion.header>
  );
}
