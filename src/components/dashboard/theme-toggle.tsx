"use client";

import { AnimatePresence, motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const order = ["system", "dark", "light"] as const;
const icons = { system: Monitor, dark: Moon, light: Sun };
const labels = { system: "ตามระบบ", dark: "โหมดมืด", light: "โหมดสว่าง" };

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme = "system", setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const current = (mounted ? theme : "system") as (typeof order)[number];
  const Icon = icons[current] ?? Monitor;
  const next = order[(order.indexOf(current) + 1) % order.length];

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      onClick={() => setTheme(next)}
      className="grid size-10 place-items-center rounded-xl border border-border bg-background/50 text-foreground/80 backdrop-blur hover:text-foreground"
      aria-label={`ธีม: ${labels[current]} (แตะเพื่อเปลี่ยนเป็น ${labels[next]})`}
      title={labels[current]}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ y: -14, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 14, opacity: 0, rotate: 60 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="size-5" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
