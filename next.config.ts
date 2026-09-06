import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-4d30aa29f0bb4b6a8d6f94c8d42a8e44.r2.dev",
        port: "",
        pathname: "/**",
      },
      // Matches any Cloudflare R2 pub domain wildcard
      {
        protocol: "https",
        hostname: "*.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;