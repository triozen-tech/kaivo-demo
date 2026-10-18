import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  images: { qualities: [92], formats: ["image/webp"] },
};

export default config;
