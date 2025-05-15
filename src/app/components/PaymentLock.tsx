import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { IDL } from '../../idl/ride_chain';
import { PROGRAM_ID, RPC_URL, LAMPORTS_PER_SOL } from '../config';

interface PaymentLockProps {
  rideId: string;
  amount: number;
  driverAddress: string;
  onPaymentLocked: () => void;
  onPaymentReleased: () => void;
}

export function PaymentLock({ rideId, amount, driverAddress, onPaymentLocked, onPaymentReleased }: PaymentLockProps) {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitializePayment = async () => {
    if (!publicKey || !wallet) {
      setError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert amount from SOL to lamports
      const amountLamports = new BN(amount * LAMPORTS_PER_SOL);

      // Setup connection
      const connection = new Connection(RPC_URL, 'confirmed');

      // Create provider
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed', preflightCommitment: 'confirmed' }
      );

      // Initialize program
      const programId = new PublicKey(PROGRAM_ID);
      const program = new Program(IDL as any, programId, provider);

      // Find PDA for the ride - truncate rideId to avoid max seed length error
      const truncatedRideId = rideId.substring(0, 32);
      const [ridePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('ride'), Buffer.from(truncatedRideId)],
        program.programId
      );

      console.log("Initializing payment for ride:", rideId);
      console.log("Truncated ride ID for PDA:", truncatedRideId);
      console.log("Ride PDA:", ridePda.toString());
      console.log("Driver address:", driverAddress);
      console.log("Amount:", amount, "SOL", "(", amountLamports.toString(), "lamports)");

      // First check if the ride account exists, if not create it with createOrUpdateRide
      const accountInfo = await connection.getAccountInfo(ridePda);
      
      let tx: Transaction | null = null;
      
      // If account doesn't exist yet, create it first
      if (!accountInfo) {
        console.log("Ride account does not exist, creating it first");
        
        // Create a transaction that will create the ride account
        tx = await program.methods
          .createOrUpdateRide(
            truncatedRideId,
            "Origin", // Placeholder
            "Destination", // Placeholder
            amountLamports,
            new Date().toISOString().split('T')[0], // Today's date
            new Date().toTimeString().split(' ')[0], // Current time
            1, // Default seats
            "State", // Placeholder
            "University", // Placeholder
            "offer",
            "pending"
          )
          .accounts({
            ride: ridePda,
            driver: publicKey, // In this case, passenger is also initializing
            systemProgram: web3.SystemProgram.programId,
          })
          .transaction();
      }
      
      // Create the initialize ride instruction
      const lockIx = await program.methods
        .initializeRide(amountLamports)
        .accounts({
          ride: ridePda,
          passenger: publicKey,
          driver: new PublicKey(driverAddress),
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();
        
      // If we already have a transaction, add the lock instruction
      if (tx) {
        tx.add(lockIx);
      } else {
        // Otherwise create a new transaction with just the lock instruction
        tx = new Transaction().add(lockIx);
      }

      // Set recent blockhash and fee payer
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      tx.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(tx, connection);
      console.log("Payment locked successfully! Transaction signature:", signature);
      
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Call the success callback
      onPaymentLocked();
    } catch (err) {
      console.error("Error locking payment:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Amount to lock: <span className="font-medium">{amount} SOL</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Driver: <span className="font-medium">{driverAddress.substring(0, 8)}...{driverAddress.substring(driverAddress.length - 8)}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Funds will be locked in the contract until you release them upon arrival at your destination.
        </p>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleInitializePayment}
          disabled={isLoading || !publicKey}
          className={`w-full py-2 px-4 rounded-md text-white shadow ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Processing...' : 'Lock Payment'}
        </button>
      </div>
    </div>
  );
} 