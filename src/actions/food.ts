"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { foodItems } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";

export type ActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string | undefined> };

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `ยาวเกิน ${max} ตัวอักษร`)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

const foodSchema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่ออาหาร").max(100, "ชื่อยาวเกินไป"),
  expiresAt: z.iso.date("กรุณาเลือกวันหมดอายุ"),
  category: optionalText(50),
  quantity: optionalText(50),
  note: optionalText(300),
});

export type FoodInput = z.input<typeof foodSchema>;

function parse(input: FoodInput): { data: z.output<typeof foodSchema> } | { error: ActionResult } {
  const parsed = foodSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data };
  const fe = z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>;
  const fieldErrors = Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]]));
  return { error: { ok: false, error: "ข้อมูลไม่ถูกต้อง", fieldErrors } };
}

export async function createFood(input: FoodInput): Promise<ActionResult> {
  await requireSession();
  const result = parse(input);
  if ("error" in result) return result.error;
  try {
    await getDb().insert(foodItems).values(result.data);
  } catch (err) {
    console.error("createFood failed", err);
    return { ok: false, error: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateFood(id: string, input: FoodInput): Promise<ActionResult> {
  await requireSession();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "ไม่พบรายการ" };
  const result = parse(input);
  if ("error" in result) return result.error;
  try {
    const rows = await getDb().update(foodItems).set(result.data).where(eq(foodItems.id, id)).returning({ id: foodItems.id });
    if (rows.length === 0) return { ok: false, error: "ไม่พบรายการ" };
  } catch (err) {
    console.error("updateFood failed", err);
    return { ok: false, error: "แก้ไขไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteFood(id: string): Promise<ActionResult> {
  await requireSession();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "ไม่พบรายการ" };
  try {
    await getDb().delete(foodItems).where(eq(foodItems.id, id));
  } catch (err) {
    console.error("deleteFood failed", err);
    return { ok: false, error: "ลบไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}
