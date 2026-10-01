import { replyLineText, verifyLineSignature } from "@/lib/notify/line";
import { LINE_GROUP_KEY, setSetting } from "@/lib/settings";

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { type: "user" | "group" | "room"; groupId?: string; roomId?: string };
  message?: { type: string; text?: string };
};

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyLineSignature(raw, request.headers.get("x-line-signature"))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { events = [] } = JSON.parse(raw) as { events?: LineEvent[] };

  for (const event of events) {
    const groupId = event.source?.groupId ?? event.source?.roomId;
    if (!groupId) continue;

    // Register the group when the bot joins, or when someone types "/register" in the group.
    const isRegister = event.type === "message" && event.message?.text?.trim() === "/register";
    if (event.type === "join" || isRegister) {
      await setSetting(LINE_GROUP_KEY, groupId);
      if (event.replyToken) {
        await replyLineText(
          event.replyToken,
          "สวัสดีครับ 🧊 จะส่งสรุปอาหารใกล้หมดอายุในกลุ่มนี้ทุกวันตอน 7 โมงเช้านะครับ",
        ).catch((err) => console.error("LINE reply failed", err));
      }
    }
  }

  return Response.json({ ok: true });
}
