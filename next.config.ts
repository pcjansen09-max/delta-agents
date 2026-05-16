import type { NextConfig } from "next";

const DEV_ROUTES_ENABLED = process.env.NEXT_PUBLIC_DEV_ROUTES === "true";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    // Tijdens waitlist-fase: alle product-routes naar '/' tenzij
    // NEXT_PUBLIC_DEV_ROUTES=true (lokaal / preview deployments).
    // Marketing-routes (prijzen, integraties, contact) blijven altijd
    // verborgen tot product live gaat.
    const marketingRedirects = [
      { source: "/prijzen", destination: "/", permanent: false },
      { source: "/integraties", destination: "/", permanent: false },
      { source: "/contact", destination: "/", permanent: false },
    ];

    const productRedirects = DEV_ROUTES_ENABLED
      ? []
      : [
          { source: "/login", destination: "/", permanent: false },
          { source: "/dashboard", destination: "/", permanent: false },
          { source: "/dashboard/:path*", destination: "/", permanent: false },
          { source: "/onboarding", destination: "/", permanent: false },
          { source: "/onboarding/:path*", destination: "/", permanent: false },
          { source: "/auth", destination: "/", permanent: false },
          { source: "/auth/:path*", destination: "/", permanent: false },
        ];

    return [...marketingRedirects, ...productRedirects];
  },
};

export default nextConfig;
