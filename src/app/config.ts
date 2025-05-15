// Solana configuration
export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || '4r6tCfcZddGA72vHBoCSB35oCYu7Ftqr3E7Psy2bfj8V';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://ridechain-websocket.vercel.app';

// Local storage keys
export const RIDES_STORAGE_KEY = 'ridechain_rides';
export const USER_STORAGE_KEY = 'ridechain_user';

// Solana constants
export const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 10^9 lamports 