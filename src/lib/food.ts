import "server-only";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { foodItems, type FoodItem } from "@/db/schema";
import { daysUntil, statusFor, todayISO, type ExpiryStatus } from "./expiry";

export type FoodView = FoodItem & { daysLeft: number; status: ExpiryStatus };

export async function listFoodWithStatus(): Promise<FoodView[]> {
  const today = todayISO();
  const rows = await getDb().select().from(foodItems).orderBy(asc(foodItems.expiresAt), asc(foodItems.name));
  return rows.map((row) => {
    const daysLeft = daysUntil(row.expiresAt, today);
    return { ...row, daysLeft, status: statusFor(daysLeft) };
  });
}
