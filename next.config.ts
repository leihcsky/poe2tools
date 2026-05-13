import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile devices on the local network to access the dev server.
  // Next.js 16 blocks cross-origin requests to dev resources by default.
  // Add your phone's IP here; update if DHCP reassigns it.
  allowedDevOrigins: ["192.168.31.129", "192.168.31.*"],
};

export default nextConfig;
