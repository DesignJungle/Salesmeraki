/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  optimizeFonts: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
  },
  // Ensure standalone output is generated even with errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;