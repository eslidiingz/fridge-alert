"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { Field, FieldError, Input, Label } from "@/components/form/field";
import { Spinner, TapButton } from "@/components/motion/tap-button";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
};

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const fe = state?.fieldErrors;

  return (
    <motion.form
      action={action}
      noValidate
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
      className="flex flex-col gap-5"
    >
      <motion.div variants={item}>
        <Field>
          <Label htmlFor="username" required>ชื่อผู้ใช้</Label>
          <Input
            id="username"
            name="username"
            defaultValue={state?.username}
            autoComplete="username"
            autoCapitalize="none"
            placeholder="admin"
            aria-invalid={!!fe?.username}
            aria-describedby="username-error"
          />
          <FieldError id="username-error" message={fe?.username} />
        </Field>
      </motion.div>

      <motion.div variants={item}>
        <Field>
          <Label htmlFor="password" required>รหัสผ่าน</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-12"
              aria-invalid={!!fe?.password}
              aria-describedby="password-error"
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? "hide" : "show"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
          <FieldError id="password-error" message={fe?.password} />
        </Field>
      </motion.div>

      <AnimatePresence>
        {state?.error && (
          <motion.div
            key={state.error}
            role="alert"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
          >
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item}>
        <TapButton type="submit" disabled={pending} className="w-full">
          {pending ? <Spinner /> : <LogIn className="size-5" />}
          {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </TapButton>
      </motion.div>
    </motion.form>
  );
}
