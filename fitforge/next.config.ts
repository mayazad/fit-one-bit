import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── FIX: Pin Turbopack to resolve CSS/style packages from fitforge's own
  // node_modules. Without this, Node's resolver walks up to the parent
  // "ADs Planner/" directory (which has a stray package.json but no
  // node_modules), causing an infinite resolution error loop that crashes
  // the entire machine.
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
      "tw-animate-css": path.resolve(__dirname, "node_modules/tw-animate-css"),
      "@tailwindcss/postcss": path.resolve(__dirname, "node_modules/@tailwindcss/postcss"),
      shadcn: path.resolve(__dirname, "node_modules/shadcn"),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
