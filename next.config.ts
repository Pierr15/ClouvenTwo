import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nsjifawcftqwyseyfett.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;