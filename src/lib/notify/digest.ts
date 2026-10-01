import "server-only";
import { describeDays, formatThaiDate, STATUS_META, todayISO } from "@/lib/expiry";
import { listFoodWithStatus, type FoodView } from "@/lib/food";

export type Digest = { expired: FoodView[]; urgent: FoodView[]; soon: FoodView[] };

export async function buildDigest(): Promise<Digest> {
  const items = await listFoodWithStatus();
  return {
    expired: items.filter((i) => i.status === "expired"),
    urgent: items.filter((i) => i.status === "urgent"),
    soon: items.filter((i) => i.status === "soon"),
  };
}

export function hasAlerts(d: Digest) {
  return d.expired.length + d.urgent.length > 0;
}

function lines(items: FoodView[]) {
  return items.map((i) => `• ${i.name}${i.quantity ? ` (${i.quantity})` : ""} — ${describeDays(i.daysLeft)}`).join("\n");
}

export function digestText(d: Digest): string {
  const header = `🧊 สรุปอาหารในตู้เย็น ${formatThaiDate(todayISO())}`;
  if (!hasAlerts(d) && d.soon.length === 0) return `${header}\n\n✅ ไม่มีอาหารใกล้หมดอายุ เยี่ยมมาก!`;
  const sections = [
    d.expired.length && `${STATUS_META.expired.emoji} ${STATUS_META.expired.label} (${d.expired.length})\n${lines(d.expired)}`,
    d.urgent.length && `${STATUS_META.urgent.emoji} ภายใน 3 วัน (${d.urgent.length})\n${lines(d.urgent)}`,
    d.soon.length && `${STATUS_META.soon.emoji} ภายใน 7 วัน (${d.soon.length})\n${lines(d.soon)}`,
  ].filter(Boolean);
  return `${header}\n\n${sections.join("\n\n")}`;
}

export function digestPush(d: Digest): { title: string; body: string } {
  const parts = [
    d.expired.length && `หมดอายุ ${d.expired.length}`,
    d.urgent.length && `ใกล้หมด ${d.urgent.length}`,
  ].filter(Boolean);
  const names = [...d.expired, ...d.urgent].slice(0, 4).map((i) => i.name).join(", ");
  return { title: `🧊 ${parts.join(" · ")} รายการ`, body: names };
}
