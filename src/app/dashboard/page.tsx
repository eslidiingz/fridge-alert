import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { DashboardHeader } from "@/components/dashboard/header";
import { requireSession } from "@/lib/auth/session";
import { APP_TIMEZONE } from "@/lib/expiry";
import { listFoodWithStatus } from "@/lib/food";

export const metadata: Metadata = { title: "ตู้เย็นของฉัน · ตู้เย็นแจ้งเตือน" };

export default async function DashboardPage() {
  await requireSession();
  const items = await listFoodWithStatus();
  const todayLabel = new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIMEZONE,
  }).format(new Date());

  return (
    <main className="relative min-h-dvh px-4 pb-32">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <DashboardHeader todayLabel={todayLabel} />
      <div className="mx-auto max-w-3xl pt-5">
        <Dashboard items={items} />
      </div>
    </main>
  );
}
