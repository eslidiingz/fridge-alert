import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSetting, LINE_GROUP_KEY } from "@/lib/settings";

const LINE_API = "https://api.line.me/v2/bot/message";

export function verifyLineSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function callLine(path: "push" | "reply", body: unknown) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  const res = await fetch(`${LINE_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LINE ${path} failed: ${res.status} ${await res.text()}`);
}

export async function replyLineText(replyToken: string, text: string) {
  await callLine("reply", { replyToken, messages: [{ type: "text", text }] });
}

/** Push a text message to the group the bot was invited to (or LINE_GROUP_ID override). */
export async function pushLineToGroup(text: string): Promise<{ sent: boolean; skipped?: string }> {
  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) return { sent: false, skipped: "LINE not configured" };
  const to = process.env.LINE_GROUP_ID || (await getSetting(LINE_GROUP_KEY));
  if (!to) return { sent: false, skipped: "No LINE group registered yet" };
  await callLine("push", { to, messages: [{ type: "text", text: text.slice(0, 5000) }] });
  return { sent: true };
}
