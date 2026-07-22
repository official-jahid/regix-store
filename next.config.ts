import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: false,
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-libsql",
    "prisma",
    "better-auth",
  ],
};

export default nextConfig;
