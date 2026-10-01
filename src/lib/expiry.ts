export const APP_TIMEZONE = "Asia/Bangkok";

export type ExpiryStatus = "expired" | "urgent" | "soon" | "fresh";

export const STATUS_META: Record<ExpiryStatus, { label: string; emoji: string }> = {
  expired: { label: "หมดอายุแล้ว", emoji: "🚫" },
  urgent: { label: "ใกล้หมดมาก", emoji: "⚠️" },
  soon: { label: "ใกล้หมด", emoji: "⏳" },
  fresh: { label: "ยังสด", emoji: "🥬" },
};

/** Today's date (YYYY-MM-DD) in the app timezone. */
export function todayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from today until the expiry date (negative = already expired). */
export function daysUntil(expiresAt: string, today: string = todayISO()): number {
  return Math.round((Date.parse(`${expiresAt}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS);
}

export function statusFor(days: number): ExpiryStatus {
  if (days < 0) return "expired";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "fresh";
}

export function describeDays(days: number): string {
  if (days < 0) return `เลยมา ${Math.abs(days)} วัน`;
  if (days === 0) return "หมดอายุวันนี้";
  if (days === 1) return "หมดพรุ่งนี้";
  return `อีก ${days} วัน`;
}

export function formatThaiDate(iso: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
