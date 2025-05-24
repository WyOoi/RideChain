/**
 * Utility functions for currency conversion
 */

// Cache to store exchange rates with expiration
interface ExchangeRateCache {
  rmToUsd?: number;
  solToUsd?: number;
  timestamp: number;
}

// Cache expiration in milliseconds (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;

// In-memory cache
let rateCache: ExchangeRateCache = {
  timestamp: 0
};

/**
 * Fetches the exchange rate for RM to USD
 */
async function fetchRMToUSD(): Promise<number> {
  try {
    // Using a free currency API to get MYR to USD rate
    const response = await fetch('https://open.er-api.com/v6/latest/MYR');
    const data = await response.json();
    
    if (data && data.rates && data.rates.USD) {
      return data.rates.USD; // 1 MYR = x USD
    }
    throw new Error('Failed to get MYR to USD rate');
  } catch (error) {
    console.error('Error fetching RM to USD rate:', error);
    // Fallback rate if API fails
    return 0.21; // Approximate fallback value
  }
}

/**
 * Fetches the exchange rate for SOL to USD
 */
async function fetchSOLToUSD(): Promise<number> {
  try {
    // Using CoinGecko API to get SOL to USD rate
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    
    if (data && data.solana && data.solana.usd) {
      return data.solana.usd; // 1 SOL = x USD
    }
    throw new Error('Failed to get SOL to USD rate');
  } catch (error) {
    console.error('Error fetching SOL to USD rate:', error);
    // Fallback rate if API fails
    return 130; // Approximate fallback value
  }
}

/**
 * Converts Malaysian Ringgit (RM/MYR) to Solana (SOL)
 * @param rmAmount Amount in Malaysian Ringgit
 * @returns Equivalent amount in SOL
 */
export async function convertRMToSOL(rmAmount: number): Promise<number> {
  // Check if we need to refresh the cache
  const now = Date.now();
  if (!rateCache.rmToUsd || !rateCache.solToUsd || now - rateCache.timestamp > CACHE_EXPIRATION) {
    // Fetch both exchange rates concurrently
    const [rmToUsd, solToUsd] = await Promise.all([
      fetchRMToUSD(),
      fetchSOLToUSD()
    ]);
    
    // Update cache
    rateCache = {
      rmToUsd,
      solToUsd,
      timestamp: now
    };
    
    console.log(`Updated exchange rates: 1 RM = ${rmToUsd} USD, 1 SOL = ${solToUsd} USD`);
  }
  
  // Calculate using the cached rates
  // Formula: RM → USD → SOL
  const usdAmount = rmAmount * rateCache.rmToUsd!;
  const solAmount = usdAmount / rateCache.solToUsd!;
  
  console.log(`Converted ${rmAmount} RM to ${solAmount.toFixed(6)} SOL (via ${usdAmount.toFixed(2)} USD)`);
  return solAmount;
}

/**
 * Synchronous function to get the cached conversion rate
 * Call convertRMToSOL first to ensure the cache is populated
 */
export function getCachedRMToSOLRate(): number {
  if (!rateCache.rmToUsd || !rateCache.solToUsd) {
    // Return a reasonable default if cache isn't populated
    return 0.025; // Default fallback
  }
  
  return rateCache.rmToUsd / rateCache.solToUsd;
} 