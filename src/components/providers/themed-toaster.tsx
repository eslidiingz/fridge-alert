"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      richColors
      position="top-center"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      // Keep toasts below the iOS status bar in standalone mode, where taps on it are swallowed by the system.
      offset={{ top: "max(24px, calc(env(safe-area-inset-top) + 8px))" }}
      mobileOffset={{ top: "max(16px, calc(env(safe-area-inset-top) + 8px))" }}
      toastOptions={{ className: "font-sans" }}
    />
  );
}
