"use client";

import { motion } from "motion/react";
import { Refrigerator } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <motion.div
      initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "relative grid place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 text-white shadow-lg shadow-emerald-500/30",
        lg ? "size-16" : "size-10",
      )}
    >
      <Refrigerator className={lg ? "size-8" : "size-5"} />
      <motion.span
        className="absolute -right-1 -top-1 size-3 rounded-full bg-amber-400 ring-2 ring-background"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
