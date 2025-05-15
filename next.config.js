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
  webpack: (config) => {
    // This is needed for packages that depend on Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    
    // Add an alias for the missing module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tailwindcss/postcss': require.resolve('./shims/tailwindcss-postcss-shim.js'),
    };
    
    return config;
  },
};

module.exports = nextConfig; 