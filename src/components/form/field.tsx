"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Label({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium text-foreground/80", className)}>
      {children}
      {required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border border-border bg-background/60 px-4 text-base text-foreground shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-background focus:ring-4 focus:ring-primary/15 aria-invalid:border-red-500/70 aria-invalid:ring-red-500/15 dark:bg-white/[0.03]";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "min-h-20 resize-none py-3", className)} {...props} />;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          className="text-sm text-red-500"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Field({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>;
}
