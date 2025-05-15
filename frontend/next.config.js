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
    // Solana Program ID
    NEXT_PUBLIC_PROGRAM_ID: '4r6tCfcZddGA72vHBoCSB35oCYu7Ftqr3E7Psy2bfj8V',
    // Solana RPC URL (using Devnet)
    NEXT_PUBLIC_RPC_URL: 'https://api.devnet.solana.com',
  },
  // Add any other custom Next.js configuration options here
};

module.exports = nextConfig; 