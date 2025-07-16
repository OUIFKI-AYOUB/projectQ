// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  // Your other Next.js configuration options...
    webpack: (config) => {
    config.externals.push('@prisma/client');
    return config;
  }
};

module.exports = nextConfig;