import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ตู้เย็นแจ้งเตือน — Food Expiry Tracker",
    short_name: "ตู้เย็น",
    description: "ติดตามและแจ้งเตือนอาหารใกล้หมดอายุ",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0b0c10",
    theme_color: "#0b0c10",
    lang: "th",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
