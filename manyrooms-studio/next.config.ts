import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR mode — required for API routes and middleware to work on Netlify
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
