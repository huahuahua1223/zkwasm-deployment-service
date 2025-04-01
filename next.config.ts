import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 在生产构建时不检查ESLint规则
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
