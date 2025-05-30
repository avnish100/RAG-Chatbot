import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {},
  },
  // Allow CORS for the backend in development
  async rewrites() {
    return [
      {
        source: '/api/upload',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
      },
      {
        source: '/api/chat',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ask`,
      },
    ]
  },
};

export default nextConfig;
