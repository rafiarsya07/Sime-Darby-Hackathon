import type { NextConfig } from "next";

/**
 * Normal `npm run dev` and `npm run build` behave like any Next.js app.
 * `npm run build:pages` sets PAGES_BASE and exports a static site for GitHub Pages.
 */
const base = process.env.PAGES_BASE;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(base
    ? { output: "export" as const, basePath: base, trailingSlash: true, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
