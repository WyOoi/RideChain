import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import BN from 'bn.js';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { IDL } from '../../idl/contract';

interface PaymentLockProps {
  rideId: string;
  amount: number;
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

      // Lock payment
      const tx = await program.methods
        .initializeRide(
          rideId,
          new BN(amount * LAMPORTS_PER_SOL),
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