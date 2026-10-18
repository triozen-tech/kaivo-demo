import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  images: { qualities: [92], formats: ["image/webp"] },
};

export default config;
