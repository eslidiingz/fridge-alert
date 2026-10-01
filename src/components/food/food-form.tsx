"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createFood, updateFood, type FoodInput } from "@/actions/food";
import { Field, FieldError, Input, Label, Textarea } from "@/components/form/field";
import { Spinner, TapButton } from "@/components/motion/tap-button";
import { todayISO } from "@/lib/expiry";
import type { FoodView } from "@/lib/food";
import { cn } from "@/lib/utils";

const CATEGORIES = ["ผัก", "ผลไม้", "เนื้อสัตว์", "อาหารทะเล", "นม/ไข่", "ขนมปัง", "อาหารปรุงสุก", "ซอส/เครื่องปรุง", "เครื่องดื่ม"];
const QUICK_DAYS = [
  { label: "+3 วัน", days: 3 },
  { label: "+1 สัปดาห์", days: 7 },
  { label: "+2 สัปดาห์", days: 14 },
  { label: "+1 เดือน", days: 30 },
];

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

type Errors = Partial<Record<keyof FoodInput, string>>;

function validate(v: FoodInput): Errors {
  const e: Errors = {};
  if (!v.name?.trim()) e.name = "กรุณากรอกชื่ออาหาร";
  else if (v.name.trim().length > 100) e.name = "ชื่อยาวเกินไป";
  if (!v.expiresAt) e.expiresAt = "กรุณาเลือกวันหมดอายุ";
  return e;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function FoodForm({ item, onDone }: { item?: FoodView; onDone: () => void }) {
  const today = todayISO();
  const [values, setValues] = useState<FoodInput>({
    name: item?.name ?? "",
    expiresAt: item?.expiresAt ?? addDays(today, 7),
    category: item?.category ?? "",
    quantity: item?.quantity ?? "",
    note: item?.note ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof FoodInput>(key: K, value: FoodInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    startTransition(async () => {
      const res = item ? await updateFood(item.id, values) : await createFood(values);
      if (res.ok) {
        toast.success(item ? "บันทึกการแก้ไขแล้ว" : `เพิ่ม "${values.name}" แล้ว 🎉`);
        onDone();
      } else {
        setErrors((res.fieldErrors ?? {}) as Errors);
        toast.error(res.error);
      }
    });
  }

  return (
    <motion.form noValidate onSubmit={onSubmit} variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 pt-1">
      <motion.div variants={rise}>
        <Field>
          <Label htmlFor="food-name" required>ชื่ออาหาร</Label>
          <Input
            id="food-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="เช่น นมจืด, อกไก่, ผักกาด"
            maxLength={100}
            autoFocus={!item}
            aria-invalid={!!errors.name}
            aria-describedby="food-name-error"
          />
          <FieldError id="food-name-error" message={errors.name} />
        </Field>
      </motion.div>

      <motion.div variants={rise}>
        <Field>
          <Label htmlFor="food-exp" required>วันหมดอายุ</Label>
          <Input
            id="food-exp"
            type="date"
            value={values.expiresAt}
            onChange={(e) => set("expiresAt", e.target.value)}
            aria-invalid={!!errors.expiresAt}
            aria-describedby="food-exp-error"
            className="[color-scheme:light] dark:[color-scheme:dark]"
          />
          <div className="flex flex-wrap gap-2">
            {QUICK_DAYS.map((q) => {
              const target = addDays(today, q.days);
              const active = values.expiresAt === target;
              return (
                <motion.button
                  key={q.days}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => set("expiresAt", target)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {q.label}
                </motion.button>
              );
            })}
          </div>
          <FieldError id="food-exp-error" message={errors.expiresAt} />
        </Field>
      </motion.div>

      <motion.div variants={rise}>
        <Field>
          <Label htmlFor="food-cat">หมวดหมู่</Label>
          <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none]">
            <div className="flex w-max gap-2">
              {CATEGORIES.map((c) => {
                const active = values.category === c;
                return (
                  <motion.button
                    key={c}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => set("category", active ? "" : c)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="size-3" />
                      </motion.span>
                    )}
                    {c}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <Input
            id="food-cat"
            value={values.category ?? ""}
            onChange={(e) => set("category", e.target.value)}
            placeholder="หรือพิมพ์เอง"
            maxLength={50}
            aria-invalid={!!errors.category}
            aria-describedby="food-cat-error"
          />
          <FieldError id="food-cat-error" message={errors.category} />
        </Field>
      </motion.div>

      <motion.div variants={rise}>
        <Field>
          <Label htmlFor="food-qty">จำนวน</Label>
          <Input
            id="food-qty"
            value={values.quantity ?? ""}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="เช่น 2 กล่อง, 500 กรัม"
            maxLength={50}
            aria-invalid={!!errors.quantity}
            aria-describedby="food-qty-error"
          />
          <FieldError id="food-qty-error" message={errors.quantity} />
        </Field>
      </motion.div>

      <motion.div variants={rise}>
        <Field>
          <Label htmlFor="food-note">หมายเหตุ</Label>
          <Textarea
            id="food-note"
            value={values.note ?? ""}
            onChange={(e) => set("note", e.target.value)}
            placeholder="เช่น อยู่ชั้นล่างสุด"
            maxLength={300}
            aria-invalid={!!errors.note}
            aria-describedby="food-note-error"
          />
          <FieldError id="food-note-error" message={errors.note} />
        </Field>
      </motion.div>

      <motion.div variants={rise} className="pt-1">
        <TapButton type="submit" disabled={pending} className="w-full">
          {pending ? <Spinner /> : <Check className="size-5" />}
          {pending ? "กำลังบันทึก…" : item ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
        </TapButton>
      </motion.div>
    </motion.form>
  );
}
