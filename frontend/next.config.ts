import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/upload/:path*",
        destination: `${BACKEND_URL}/api/upload/:path*`,
      },
      {
        source: "/api/catalog",
        destination: `${BACKEND_URL}/api/catalog`,
      },
      {
        source: "/api/catalog/:path*",
        destination: `${BACKEND_URL}/api/catalog/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
