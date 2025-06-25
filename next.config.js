/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
