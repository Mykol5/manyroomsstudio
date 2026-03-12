import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This generates static HTML for Netlify
  images: {
    unoptimized: true, // Required for static export with images
  },
  trailingSlash: true, // Adds trailing slashes to URLs for better routing
  // Add any other config options here
};

export default nextConfig;
