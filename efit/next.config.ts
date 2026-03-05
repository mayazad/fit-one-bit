import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── Pin Turbopack root and resolve CSS packages from efit's own
  // node_modules to prevent Node's resolver from walking up to the parent
  // directory.
  turbopack: {
    root: __dirname,
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
