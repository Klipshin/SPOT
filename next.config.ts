import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Temporarily allow builds to succeed on Vercel despite ESLint warnings.
    // Remove or set to false after fixing lint issues (alt attributes, no-img-element, unused vars).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
