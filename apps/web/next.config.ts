import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // packages/agente se publica como TypeScript sin compilar (workspace de npm).
  transpilePackages: ["agente"],
};

export default nextConfig;
