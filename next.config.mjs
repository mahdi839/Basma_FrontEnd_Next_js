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
        protocol: 'https',
        hostname: 'api.yourdomain.com', // production API domain
      },
    ],
  },
  // env: {
  //   BACKEND_URL: "https://api.ibtikarbd.com/", // use live API
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
