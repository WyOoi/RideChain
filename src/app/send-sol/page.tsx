'use client';

import Navbar from "@/components/Navbar";
import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export default function SendSolPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  const handleSendSol = useCallback(async () => {
    console.log('[Send SOL] Initiated');
    if (!publicKey) {
      const errMsg = 'Wallet not connected. Please connect your wallet first. [Code: HSPK1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    console.log('[Send SOL] Wallet connected, public key:', publicKey.toBase58());

    if (!receiver) {
      const errMsg = 'Receiver address is required. [Code: HSRA1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    if (!amount) {
      const errMsg = 'Amount is required. [Code: HSAM1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    console.log(`[Send SOL] Receiver: ${receiver}, Amount: ${amount} SOL`);

    setError('');
    setTxSignature('');
    setSending(true);
    console.log('[Send SOL] State: Preparing to send transaction.');
    console.log('[Send SOL] Raw receiver input string:', receiver);

    let calculatedAmountLamports = 0;
    try {
      const receiverPublicKey = new PublicKey(receiver);
      console.log('[Send SOL] Parsed receiver PublicKey:', receiverPublicKey.toBase58());
      calculatedAmountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(calculatedAmountLamports) || calculatedAmountLamports <= 0) {
        const errMsg = `Invalid amount: ${amount}. Please enter a positive number. [Code: HSIA1]`;
        console.error('[Send SOL] Error: ', errMsg, "Raw amount:", amount, "Lamports:", calculatedAmountLamports);
        setError(errMsg);
        setSending(false);
        return;
      }
      console.log(`[Send SOL] Transaction details: To ${receiverPublicKey.toBase58()}, Lamports: ${calculatedAmountLamports}`);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPublicKey,
          lamports: calculatedAmountLamports,
        })
      );
      console.log('[Send SOL] Transaction object created.');

      console.log('[Send SOL] Calling sendTransaction via wallet adapter...');
      const signature = await sendTransaction(transaction, connection);
      console.log('[Send SOL] sendTransaction returned signature:', signature);

      console.log('[Send SOL] Confirming transaction...');
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      }, 'processed');
      console.log('[Send SOL] Transaction confirmed successfully.');

      setTxSignature(signature);
      console.log('[Send SOL] State: txSignature set.');
      setReceiver('');
      setAmount('');
      console.log('[Send SOL] State: Receiver and amount fields reset.');
      setError('');
    } catch (err) {
      console.error('[Send SOL] Caught error during transaction process:', err);
      let uiError = 'An unknown error occurred during the transaction. [Code: HSCE2]';
      if (err instanceof Error) {
        if (err.message && (err.message.includes('Invalid public key input') || err.message.includes('is not a valid public key'))) {
          uiError = "Invalid receiver address format. Please ensure it's a valid Solana address. [Code: HSINVADDRFMT]";
        } else if (err.name === 'WalletSendTransactionError' && err.message && err.message.toLowerCase().includes('invalid account')) {
          uiError = "The receiver account address appears to be invalid. Please double-check it and ensure it is a valid Solana account. [Code: HSINVACCNT]";
        } else {
          uiError = `Transaction failed: ${err.name} - ${err.message} [Code: HSCE1]`;
        }
      }
      setError(uiError);
      setTxSignature('');
    } finally {
      setSending(false);
      console.log('[Send SOL] State: sending set to false in finally block.');
      console.log('[Send SOL] Finished.');
    }
  }, [publicKey, receiver, amount, connection, sendTransaction, setError, setTxSignature, setSending, setReceiver, setAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-6 md:px-8 py-28 pt-32 md:pt-40 flex flex-col items-center">
        <section id="send-sol-section" className="my-8 max-w-2xl w-full scroll-mt-20">
          <div className="text-center mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-teal-700 bg-teal-100 rounded-full dark:bg-teal-700 dark:text-teal-100">
              Solana Features
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-400 mb-6 text-center">Send SOL</h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div>
                <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Receiver Address
                </label>
                <input
                  type="text"
                  name="receiver"
                  id="receiver"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter receiver's Solana address"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  disabled={sending || !publicKey}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter amount of SOL to send"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={sending || !publicKey}
                />
              </div>
              <button
                onClick={handleSendSol}
                disabled={sending || !publicKey || !receiver || !amount}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {sending ? 'Sending...' : 'Send SOL'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
            {txSignature && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400 text-center">
                <p>Transaction Successful!</p>
                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700 dark:hover:text-green-300"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 