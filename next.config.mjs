/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['127.0.0.1'],
      },
    env: {
      BACKEND_URL: "http://127.0.0.1:8000/",
    },
  };
  
  export default nextConfig;