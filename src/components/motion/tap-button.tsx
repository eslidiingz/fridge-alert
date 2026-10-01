"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-60",
  ghost: "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
  outline: "border border-border bg-background/40 text-foreground hover:bg-foreground/5",
  danger: "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:brightness-110 disabled:opacity-60",
};

export function TapButton({
  variant = "primary",
  className,
  children,
  ...props
}: HTMLMotionProps<"button"> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-medium outline-none transition-[filter,background-color] focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={cn("inline-block size-4 rounded-full border-2 border-current border-t-transparent", className)}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
    />
  );
}
