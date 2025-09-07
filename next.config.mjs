/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  env: {
    BACKEND_URL: "http://127.0.0.1:8000/",
  },
  ignoreDuringBuilds: true,
};

export default nextConfig;
