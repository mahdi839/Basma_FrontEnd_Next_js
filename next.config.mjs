/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ibtikarbd.com', // your live API
        pathname: '/**',
      },
    ],
  },
  env: {
    BACKEND_URL: "https://api.ibtikarbd.com/", // use live API
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
