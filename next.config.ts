import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    staleTimes:{
      dynamic: 30,
      static: 180
    },
  },
  trailingSlash: true,
};

export default nextConfig;
