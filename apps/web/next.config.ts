import type { NextConfig } from "next";

const apiDestination =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@orbit/design-tokens", "@orbit/shared-types"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiDestination.replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
