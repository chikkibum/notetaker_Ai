import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // add to skip type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  
  /* config options here */
};

export default nextConfig;
