import { safeEqual } from "@/lib/auth/password";
import { buildDigest, digestPush, digestText, hasAlerts } from "@/lib/notify/digest";
import { pushLineToGroup } from "@/lib/notify/line";
import { sendPushToAll } from "@/lib/notify/web-push";

// Runs daily at 00:00 UTC (07:00 Asia/Bangkok) via vercel.ts crons.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const digest = await buildDigest();
  const [line, push] = await Promise.allSettled([
    pushLineToGroup(digestText(digest)),
    hasAlerts(digest) ? sendPushToAll({ ...digestPush(digest), url: "/dashboard" }) : Promise.resolve({ sent: 0, failed: 0, skipped: "no alerts" }),
  ]);

  const summarize = (r: PromiseSettledResult<unknown>) =>
    r.status === "fulfilled" ? r.value : { error: r.reason instanceof Error ? r.reason.message : String(r.reason) };

  if (line.status === "rejected") console.error("LINE digest failed", line.reason);
  if (push.status === "rejected") console.error("Push digest failed", push.reason);

  return Response.json({
    counts: { expired: digest.expired.length, urgent: digest.urgent.length, soon: digest.soon.length },
    line: summarize(line),
    push: summarize(push),
  });
}
