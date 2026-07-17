import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/pixora/wp.aqlova.com/pixora/creative-agency-classic/digital-studio/index.html',
      },
      // Rewrite wp-content requests to your folder structure
      {
        source: '/wp-content/:path*',
        destination: '/pixora/wp.aqlova.com/pixora/creative-agency-classic/wp-content/:path*',
      },
      // Rewrite wp-includes requests
      {
        source: '/wp-includes/:path*',
        destination: '/pixora/wp.aqlova.com/pixora/creative-agency-classic/wp-includes/:path*',
      },
    ];
  },
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     unoptimized: true,
//   },
//   trailingSlash: true,
  
//   // Add CORS headers for external resources
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "*",
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET, POST, PUT, DELETE, OPTIONS",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value: "Content-Type, Authorization",
//           },
//         ],
//       },
//     ];
//   },
  
//   // Allow external image domains (if needed)
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "wp.aqlova.com",
//       },
//       {
//         protocol: "https",
//         hostname: "videos.pexels.com",
//       },
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//       },
//     ],
//   },
// };

// export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // SSR mode — required for API routes and middleware to work on Netlify
//   images: {
//     unoptimized: true,
//   },
//   trailingSlash: true,
// };

// export default nextConfig;
