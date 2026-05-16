import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    // Waitlist-fase: alle oude marketing/product routes sturen
    // we tijdelijk naar de waitlist homepage. Halen we weg als
    // product live gaat.
    return [
      { source: "/prijzen", destination: "/", permanent: false },
      { source: "/integraties", destination: "/", permanent: false },
      { source: "/contact", destination: "/", permanent: false },
      { source: "/login", destination: "/", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/dashboard/:path*", destination: "/", permanent: false },
      { source: "/onboarding", destination: "/", permanent: false },
      { source: "/onboarding/:path*", destination: "/", permanent: false },
      { source: "/auth", destination: "/", permanent: false },
      { source: "/auth/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
