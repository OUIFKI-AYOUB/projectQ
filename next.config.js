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
};

module.exports = nextConfig;