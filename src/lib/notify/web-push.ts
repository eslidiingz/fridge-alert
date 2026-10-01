import "server-only";
import { inArray } from "drizzle-orm";
import webpush from "web-push";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";

export type PushMessage = { title: string; body: string; url?: string };

let configured = false;
function configure() {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export async function sendPushToAll(message: PushMessage): Promise<{ sent: number; failed: number; skipped?: string }> {
  if (!configure()) return { sent: 0, failed: 0, skipped: "VAPID keys not configured" };

  const db = getDb();
  const subs = await db.select().from(pushSubscriptions);
  const payload = JSON.stringify(message);
  const gone: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, {
          TTL: 60 * 60 * 12,
        });
        sent++;
      } catch (err) {
        failed++;
        const status = (err as { statusCode?: number }).statusCode;
        // 404/410 = subscription expired or unsubscribed; clean it up.
        if (status === 404 || status === 410) gone.push(s.endpoint);
        else console.error("web push failed", status, err);
      }
    }),
  );

  if (gone.length) await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.endpoint, gone));
  return { sent, failed };
}
