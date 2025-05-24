import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import BN from 'bn.js';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { IDL } from '../../idl/contract';
import { convertRMToSOL, getCachedRMToSOLRate } from '@/utils/currencyConverter';

interface PaymentLockProps {
  rideId: string;
  amount: number; // Amount in RM
  driverAddress: string;
  onPaymentLocked?: () => void;
  onPaymentReleased?: () => void;
}

export const PaymentLock: FC<PaymentLockProps> = ({
  rideId,
  amount,
  driverAddress,
  onPaymentLocked,
  onPaymentReleased,
}) => {
  const { publicKey, signTransaction, wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0.025); // Default fallback rate
  const [solAmount, setSolAmount] = useState<number>(amount * exchangeRate);

  // Fetch exchange rate on component mount
  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        // This will update the cache
        const solValue = await convertRMToSOL(amount);
        setSolAmount(solValue);
        
        // Update the exchange rate
        const rate = getCachedRMToSOLRate();
        setExchangeRate(rate);
        console.log(`Updated RM to SOL exchange rate: ${rate}, RM${amount} = ${solValue} SOL`);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    }
    
    fetchExchangeRate();
  }, [amount]);

  const getProvider = () => {
    if (!wallet) return null;
    return new AnchorProvider(
      new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8899'),
      wallet as any,
      { commitment: 'confirmed' }
    );
  };

  const lockPayment = async () => {
    const provider = getProvider();
    if (!publicKey || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get fresh SOL conversion
      const amountSOL = await convertRMToSOL(amount);
      setSolAmount(amountSOL);

      const program = new Program(
        IDL as any,
        new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || ''),
        provider
      );

      // Create ride PDA
      const [ridePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('ride'), Buffer.from(rideId)],
        program.programId
      );

      // Convert to SOL first, then to lamports
      const amountLamports = Math.round(amountSOL * LAMPORTS_PER_SOL);
      console.log(`Converting RM${amount} to ${amountSOL} SOL (${amountLamports} lamports)`);

      // Lock payment
      const tx = await program.methods
        .initializeRide(
          rideId,
          new BN(amountLamports),
          new PublicKey(driverAddress),
          publicKey
        )
        .accounts({
          ride: ridePda,
          passenger: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log('Payment locked:', tx);
      onPaymentLocked?.();
    } catch (err) {
      console.error('Error locking payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to lock payment');
    } finally {
      setIsLoading(false);
    }
  };

  const releasePayment = async () => {
    const provider = getProvider();
    if (!publicKey || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const program = new Program(
        IDL as any,
        new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || ''),
        provider
      );

      // Get ride PDA
      const [ridePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('ride'), Buffer.from(rideId)],
        program.programId
      );

      // Release payment
      const tx = await program.methods
        .releasePayment()
        .accounts({
          ride: ridePda,
          driver: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log('Payment released:', tx);
      onPaymentReleased?.();
    } catch (err) {
      console.error('Error releasing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to release payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Amount:</span> RM{amount.toFixed(2)} 
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            (~{solAmount.toFixed(5)} SOL)
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">Exchange rate: 1 RM ≈ {exchangeRate.toFixed(6)} SOL</p>
      </div>
      <div className="flex flex-col space-y-2">
        <button
          onClick={lockPayment}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Lock Payment'}
        </button>
        <button
          onClick={releasePayment}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Release Payment'}
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}; 