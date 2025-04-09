import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 在生产构建时不检查ESLint规则
    ignoreDuringBuilds: true,
  },
  // 禁用输出export-detail.json文件
  output: "standalone",
  // 允许服务端组件对Kubernetes API的请求
  serverExternalPackages: ["@kubernetes/client-node"],
};

export default nextConfig;
