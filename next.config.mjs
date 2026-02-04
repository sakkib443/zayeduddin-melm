/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Allow any external image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all hostnames
      },
    ],
    // Image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp', 'image/avif'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
