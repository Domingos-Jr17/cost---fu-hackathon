/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Costant",
    NEXT_PUBLIC_APP_DESCRIPTION:
      process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
      "A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos",
  },

  // Optimization
  swcMinify: true,

  // Images
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // API Rewrites
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
