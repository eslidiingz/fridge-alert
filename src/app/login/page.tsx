import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/dashboard/brand-mark";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { FadeIn } from "@/components/motion/fade-in";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = { title: "เข้าสู่ระบบ · ตู้เย็นแจ้งเตือน" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <BackgroundBeams className="opacity-70" />
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <Spotlight />
      </div>
      <div className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10">
        <ThemeToggle />
      </div>

      <FadeIn className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <TextGenerateEffect words="ตู้เย็น แจ้งเตือน" className="mt-4 text-3xl [&_div]:text-3xl" />
          <p className="mt-1 text-sm text-muted-foreground">เข้าสู่ระบบเพื่อจัดการอาหารในตู้เย็นของบ้าน</p>
        </div>
        <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40">
          <LoginForm />
        </div>
      </FadeIn>
    </main>
  );
}
