"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const YEARS_PER_PAGE = 12;

const monthNameFmt = new Intl.DateTimeFormat("th-TH", { month: "long", timeZone: "UTC" });
const monthShortFmt = new Intl.DateTimeFormat("th-TH", { month: "short", timeZone: "UTC" });
const yearFmt = new Intl.DateTimeFormat("th-TH", { year: "numeric", timeZone: "UTC" });
const fullFmt = new Intl.DateTimeFormat("th-TH", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Dates are YYYY-MM-DD strings interpreted in UTC, so there is no timezone drift.
const toISO = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
const parseISO = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return { y, m: m - 1 };
};
const fmtMonth = (m: number) => monthNameFmt.format(new Date(Date.UTC(2000, m, 1)));
const fmtMonthShort = (m: number) => monthShortFmt.format(new Date(Date.UTC(2000, m, 1)));
const fmtYear = (y: number) => yearFmt.format(new Date(Date.UTC(y, 0, 1))).replace(/[^\d]/g, "");

function buildMonth(y: number, m: number) {
  const firstWeekday = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

type Mode = "days" | "months" | "years";

const navBtn =
  "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-25";

/** Calendar date picker. Dates before `today` cannot be chosen. */
export function DatePicker({
  id,
  value,
  onChange,
  today,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  today: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const min = parseISO(today);
  const initialView = () => {
    const v = parseISO(value && value >= today ? value : today);
    return v;
  };

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("days");
  const [view, setView] = useState(initialView);
  const [yearPageStart, setYearPageStart] = useState(min.y);
  const [direction, setDirection] = useState(0);

  const atMinMonth = view.y === min.y && view.m === min.m;
  const isPastMonth = (y: number, m: number) => y < min.y || (y === min.y && m < min.m);

  function shiftMonth(delta: number) {
    if (delta < 0 && atMinMonth) return;
    setDirection(delta);
    setView(({ y, m }) => {
      const d = new Date(Date.UTC(y, m + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });
  }

  function shiftYear(delta: number) {
    setDirection(delta);
    setView(({ y, m }) => {
      const ny = Math.max(min.y, y + delta);
      return { y: ny, m: isPastMonth(ny, m) ? min.m : m };
    });
  }

  function toggle() {
    if (!open) {
      setView(initialView());
      setMode("days");
    }
    setOpen((o) => !o);
  }

  function pickMonth(m: number) {
    setDirection(0);
    setView((v) => ({ ...v, m }));
    setMode("days");
  }

  function pickYear(y: number) {
    setDirection(0);
    setView(({ m }) => ({ y, m: isPastMonth(y, m) ? min.m : m }));
    setMode("months");
  }

  function goToday() {
    setDirection(0);
    setView(min);
    setMode("days");
    onChange(today);
    setOpen(false);
  }

  const cells = buildMonth(view.y, view.m);
  const monthKey = `${view.y}-${view.m}`;

  return (
    <div className="flex flex-col gap-2">
      <motion.button
        id={id}
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={toggle}
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border bg-background/60 px-4 text-left text-base shadow-sm outline-none transition-[border-color,box-shadow] dark:bg-white/[0.03]",
          open ? "border-primary/60 ring-4 ring-primary/15" : "border-border",
          invalid && "border-red-500/70 ring-red-500/15",
        )}
      >
        <CalendarDays className="size-5 text-primary" />
        <span className={cn("flex-1 truncate", !value && "text-muted-foreground/70")}>
          {value ? fullFmt.format(new Date(`${value}T00:00:00Z`)) : "เลือกวันหมดอายุ"}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted-foreground">
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-background/60 p-3 dark:bg-white/[0.03]">
              {/* Header: arrows step by month / year / year-page depending on mode; titles switch modes */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() =>
                    mode === "days"
                      ? shiftMonth(-1)
                      : mode === "months"
                        ? shiftYear(-1)
                        : setYearPageStart((s) => Math.max(min.y, s - YEARS_PER_PAGE))
                  }
                  disabled={
                    mode === "days" ? atMinMonth : mode === "months" ? view.y <= min.y : yearPageStart <= min.y
                  }
                  className={navBtn}
                  aria-label={mode === "days" ? "เดือนก่อนหน้า" : "ปีก่อนหน้า"}
                >
                  <ChevronLeft className="size-5" />
                </motion.button>

                <div className="flex items-center gap-1">
                  {mode === "days" && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setMode("months")}
                      className="rounded-lg px-2 py-1 font-semibold hover:bg-foreground/5"
                      aria-label="เลือกเดือน"
                    >
                      {fmtMonth(view.m)}
                    </motion.button>
                  )}
                  {mode !== "years" ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setYearPageStart(Math.max(min.y, view.y - (view.y - min.y) % YEARS_PER_PAGE));
                        setMode("years");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold hover:bg-foreground/5"
                      aria-label="เลือกปี"
                    >
                      {fmtYear(view.y)}
                      <ChevronDown className="size-4 text-muted-foreground" />
                    </motion.button>
                  ) : (
                    <span className="px-2 py-1 font-semibold">
                      {fmtYear(yearPageStart)} – {fmtYear(yearPageStart + YEARS_PER_PAGE - 1)}
                    </span>
                  )}
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() =>
                    mode === "days"
                      ? shiftMonth(1)
                      : mode === "months"
                        ? shiftYear(1)
                        : setYearPageStart((s) => s + YEARS_PER_PAGE)
                  }
                  className={navBtn}
                  aria-label={mode === "days" ? "เดือนถัดไป" : "ปีถัดไป"}
                >
                  <ChevronRight className="size-5" />
                </motion.button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {mode === "days" && (
                  <motion.div
                    key="days"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                      {WEEKDAYS.map((w, i) => (
                        <span key={w} className={cn("py-1", i === 0 && "text-red-500/80")}>
                          {w}
                        </span>
                      ))}
                    </div>

                    <div className="relative -mx-1 overflow-hidden px-1 py-1">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={monthKey}
                          initial={{ x: direction * 60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: direction * -60, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.3}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) shiftMonth(1);
                            else if (info.offset.x > 50) shiftMonth(-1);
                          }}
                          className="grid touch-pan-y grid-cols-7 gap-y-1"
                        >
                          {cells.map((iso, i) => {
                            if (!iso) return <span key={`e${i}`} />;
                            const selected = iso === value;
                            const isToday = iso === today;
                            const disabled = iso < today;
                            return (
                              <motion.button
                                key={iso}
                                type="button"
                                whileTap={disabled ? undefined : { scale: 0.85 }}
                                disabled={disabled}
                                onClick={() => {
                                  onChange(iso);
                                  setOpen(false);
                                }}
                                aria-label={fullFmt.format(new Date(`${iso}T00:00:00Z`))}
                                aria-pressed={selected}
                                className={cn(
                                  "relative mx-auto grid size-10 place-items-center rounded-full text-sm tabular-nums transition-colors",
                                  disabled && "cursor-not-allowed text-muted-foreground/30 line-through decoration-muted-foreground/30",
                                  !disabled && (selected ? "font-semibold text-primary-foreground" : "hover:bg-foreground/5"),
                                  !disabled && !selected && isToday && "font-semibold text-primary",
                                )}
                              >
                                {selected && !disabled && (
                                  <motion.span
                                    layoutId={`${id}-selected`}
                                    className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/30"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  />
                                )}
                                {!selected && isToday && (
                                  <span className="absolute inset-0 rounded-full border border-primary/60" />
                                )}
                                <span className="relative">{Number(iso.slice(8))}</span>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {mode === "months" && (
                  <motion.div
                    key="months"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-3 gap-2 py-1"
                  >
                    {Array.from({ length: 12 }, (_, m) => {
                      const disabled = isPastMonth(view.y, m);
                      const current = m === view.m;
                      return (
                        <motion.button
                          key={m}
                          type="button"
                          whileTap={disabled ? undefined : { scale: 0.9 }}
                          disabled={disabled}
                          onClick={() => pickMonth(m)}
                          className={cn(
                            "relative h-11 rounded-xl text-sm font-medium transition-colors",
                            disabled && "cursor-not-allowed text-muted-foreground/30",
                            !disabled && (current ? "text-primary-foreground" : "hover:bg-foreground/5"),
                          )}
                          aria-label={fmtMonth(m)}
                        >
                          {current && !disabled && (
                            <motion.span
                              layoutId={`${id}-month`}
                              className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                            />
                          )}
                          <span className="relative">{fmtMonthShort(m)}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {mode === "years" && (
                  <motion.div
                    key={`years-${yearPageStart}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-3 gap-2 py-1"
                  >
                    {Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
                      const y = yearPageStart + i;
                      const current = y === view.y;
                      return (
                        <motion.button
                          key={y}
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => pickYear(y)}
                          className={cn(
                            "relative h-11 rounded-xl text-sm font-medium tabular-nums transition-colors",
                            current ? "text-primary-foreground" : "hover:bg-foreground/5",
                          )}
                        >
                          {current && (
                            <motion.span
                              layoutId={`${id}-year`}
                              className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30"
                            />
                          )}
                          <span className="relative">{fmtYear(y)}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 flex items-center justify-between">
                {mode !== "days" ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMode("days")}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  >
                    ‹ กลับไปเลือกวัน
                  </motion.button>
                ) : (
                  <span />
                )}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={goToday}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  วันนี้
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
