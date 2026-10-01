"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { removePushSubscription, savePushSubscription, sendTestPush } from "@/actions/push";
import { cn } from "@/lib/utils";

type State = "loading" | "unsupported" | "off" | "on" | "busy";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function PushToggle() {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        if (!cancelled) setState("unsupported");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
      const sub = await reg.pushManager.getSubscription();
      if (!cancelled) setState(sub ? "on" : "off");
    })().catch(() => !cancelled && setState("unsupported"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("ไม่ได้รับอนุญาตให้แจ้งเตือน", { description: "เปิดสิทธิ์การแจ้งเตือนในการตั้งค่าเบราว์เซอร์" });
        setState("off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const res = await savePushSubscription(sub.toJSON());
      if (!res.ok) throw new Error(res.error);
      setState("on");
      toast.success("เปิดแจ้งเตือนแล้ว 🔔", {
        description: "จะแจ้งเตือนทุกเช้า 7 โมงเมื่อมีอาหารใกล้หมดอายุ",
        action: { label: "ทดสอบ", onClick: () => void test() },
      });
    } catch (err) {
      toast.error("เปิดแจ้งเตือนไม่สำเร็จ", { description: err instanceof Error ? err.message : undefined });
      setState("off");
    }
  }

  async function disable() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
      toast.success("ปิดแจ้งเตือนบนอุปกรณ์นี้แล้ว");
    } catch {
      toast.error("ปิดแจ้งเตือนไม่สำเร็จ");
      setState("on");
    }
  }

  async function test() {
    const res = await sendTestPush();
    if (res.ok) toast.success("ส่งแจ้งเตือนทดสอบแล้ว");
    else toast.error(res.error);
  }

  if (state === "unsupported" || state === "loading") return null;

  const on = state === "on";
  const Icon = state === "busy" ? BellRing : on ? Bell : BellOff;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      disabled={state === "busy"}
      onClick={on ? disable : enable}
      className={cn(
        "relative grid size-10 place-items-center rounded-xl border backdrop-blur",
        on ? "border-primary/40 bg-primary/15 text-primary" : "border-border bg-background/50 text-foreground/70",
      )}
      aria-label={on ? "ปิดการแจ้งเตือนบนอุปกรณ์นี้" : "เปิดการแจ้งเตือนบนอุปกรณ์นี้"}
      title={on ? "แจ้งเตือนเปิดอยู่" : "เปิดแจ้งเตือน"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ rotate: -30, opacity: 0 }}
          animate={state === "busy" ? { rotate: [0, -15, 15, -10, 10, 0], opacity: 1 } : { rotate: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={state === "busy" ? { repeat: Infinity, duration: 0.8 } : { duration: 0.2 }}
        >
          <Icon className="size-5" />
        </motion.span>
      </AnimatePresence>
      {on && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />}
    </motion.button>
  );
}
