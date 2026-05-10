import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Abaikan amaran ESLint semasa proses 'build' di Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Abaikan amaran TypeScript semasa proses 'build' di Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;