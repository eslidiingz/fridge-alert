import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  // 00:00 UTC = 07:00 Asia/Bangkok. On the Hobby plan the run may land anywhere within that hour.
  crons: [{ path: "/api/cron/daily", schedule: "0 0 * * *" }],
};
