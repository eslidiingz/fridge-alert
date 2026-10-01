import { ImageResponse } from "next/og";
import { BrandIconArt } from "@/components/brand-icon";

const SIZES = new Set([180, 192, 512]);

export async function GET(_req: Request, ctx: RouteContext<"/pwa-icon/[size]">) {
  const size = Number((await ctx.params).size);
  if (!SIZES.has(size)) return new Response("Not found", { status: 404 });
  return new ImageResponse(<BrandIconArt size={size} />, { width: size, height: size });
}
