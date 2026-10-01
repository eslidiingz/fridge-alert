# ตู้เย็นเตือนภัย — Food Expiry Tracker

Next.js 16 + Aceternity UI + motion · Neon Postgres (Drizzle) · Vercel Cron · Web Push · LINE Messaging API

## Setup

```bash
pnpm install
cp .env.example .env.local   # or: vercel env pull .env.local
pnpm db:push                 # create tables in Neon
pnpm dev
```

| Env | How to get it |
|---|---|
| `DATABASE_URL` | Vercel → Storage/Marketplace → Neon, then `vercel env pull .env.local` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | `pnpm hash-password '<password>'` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | `pnpm dlx web-push generate-vapid-keys` |
| `LINE_CHANNEL_ACCESS_TOKEN` / `LINE_CHANNEL_SECRET` | LINE Developers Console → Messaging API channel |
| `CRON_SECRET` | any random string; Vercel Cron sends it as `Authorization: Bearer …` |

## LINE group notifications

LINE Notify was shut down on 2025‑03‑31, so this app uses the **Messaging API**:

1. Create a LINE Official Account and enable Messaging API (LINE Developers Console).
2. In the channel settings: set **Webhook URL** to `https://<your-domain>/api/line/webhook`, turn **Use webhook** on, and allow the bot to **join groups**.
3. Put the channel access token + secret in Vercel env vars and redeploy.
4. Invite the bot into the family group. It replies with a greeting and saves the group ID automatically
   (or type `/register` in the group to re-register).

The daily digest runs at **07:00 Asia/Bangkok** (`0 0 * * *` UTC, see `vercel.ts`). On the Hobby plan the run can land anywhere in that hour.

Test it manually:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<your-domain>/api/cron/daily
```

## Web Push

Tap the bell icon in the dashboard header to enable push on that device. On iPhone you must first **Add to Home Screen** (iOS 16.4+), then open the app from the home screen.

## Expiry status

| Status | Days left |
|---|---|
| หมดอายุแล้ว | < 0 |
| ใกล้หมดมาก | 0–3 |
| ใกล้หมด | 4–7 |
| ยังสด | > 7 |
