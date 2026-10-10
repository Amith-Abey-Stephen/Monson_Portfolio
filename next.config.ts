import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16: React Compiler is stable — automatic memoization,
  // big win for this animation-heavy single-page portfolio.
  reactCompiler: true,
  // DATABASE_URL's sslrootcert points at certs/db-server.crt, which pg reads
  // at runtime — tracing can't see it, so ship it with every server route.
  outputFileTracingIncludes: {
    "/**": ["./certs/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
