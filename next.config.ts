import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "ymydurakipswigsfbsvv.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "recipes.timesofindia.com",
      },
      {
        protocol: "https",
        hostname: "static.toiimg.com",
      },
      {
        protocol: "https",
        hostname: "www.indianhealthyrecipes.com",
      },
      {
        protocol: "https",
        hostname: "deliciouslyindian.net",
      },
      {
        protocol: "https",
        hostname: "*.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

