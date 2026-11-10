import type { NextConfig } from "next";
import { wgslTurbopackRule } from "@vgpu/wgsl/next";

const nextConfig: NextConfig = {
  // packages/agente se publica como TypeScript sin compilar (workspace de npm).
  transpilePackages: ["agente"],
  // Shaders de vgpu: los .wgsl se preparan al compilar (components/luz-sol.wgsl).
  turbopack: { rules: { "*.wgsl": wgslTurbopackRule({ minify: true }) } },
};

export default nextConfig;
