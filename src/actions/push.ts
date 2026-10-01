"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { sendPushToAll } from "@/lib/notify/web-push";
import type { ActionResult } from "./food";

const subscriptionSchema = z.object({
  endpoint: z.url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

export async function savePushSubscription(sub: unknown): Promise<ActionResult> {
  await requireSession();
  const parsed = subscriptionSchema.safeParse(sub);
  if (!parsed.success) return { ok: false, error: "ข้อมูลการแจ้งเตือนไม่ถูกต้อง" };
  const { endpoint, keys } = parsed.data;
  try {
    await getDb()
      .insert(pushSubscriptions)
      .values({ endpoint, p256dh: keys.p256dh, auth: keys.auth })
      .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { p256dh: keys.p256dh, auth: keys.auth } });
  } catch (err) {
    console.error("savePushSubscription failed", err);
    return { ok: false, error: "เปิดการแจ้งเตือนไม่สำเร็จ" };
  }
  return { ok: true };
}

export async function removePushSubscription(endpoint: string): Promise<ActionResult> {
  await requireSession();
  try {
    await getDb().delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  } catch (err) {
    console.error("removePushSubscription failed", err);
    return { ok: false, error: "ปิดการแจ้งเตือนไม่สำเร็จ" };
  }
  return { ok: true };
}

export async function sendTestPush(): Promise<ActionResult> {
  await requireSession();
  const { sent } = await sendPushToAll({ title: "ทดสอบแจ้งเตือน 🔔", body: "การแจ้งเตือนทำงานแล้ว!", url: "/dashboard" });
  return sent > 0 ? { ok: true } : { ok: false, error: "ไม่มีอุปกรณ์ที่เปิดแจ้งเตือนไว้" };
}
