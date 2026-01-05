/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https', // ✅ Changed to https for production
        hostname: 'api.eyarafashion.xyz',
        pathname: '/storage/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  
  // ✅ Add these for production
  reactStrictMode: true,
  swcMinify: true,
  
  // ✅ Improve production logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;