/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during production builds
    ignoreBuildErrors: true,
  },
  env: {
    // Google Maps API key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyDHNUG9E870MPZ38LzijxoPyPgtiUFYjTM',
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // This is needed for packages that depend on Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
  // Add any other custom Next.js configuration options here
};

module.exports = nextConfig; 