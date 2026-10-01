"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { safeEqual, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";

export type LoginState = { error?: string; fieldErrors?: { username?: string; password?: string } } | undefined;

const loginSchema = z.object({
  username: z.string().trim().min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return { fieldErrors: { username: errors.username?.[0], password: errors.password?.[0] } };
  }

  const { username, password } = parsed.data;
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const userOk = expectedUser.length > 0 && safeEqual(username, expectedUser);
  const passOk = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!userOk || !passOk) {
    return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }

  await createSession(username);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
