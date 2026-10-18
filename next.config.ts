import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",

  turbopack: {
    root: process.cwd(),
  },

  images: {
    qualities: [92],
    formats: ["image/webp"],
    unoptimized: true,
  },
};

export default config;
