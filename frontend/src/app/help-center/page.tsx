'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Help <span className="text-blue-600 dark:text-blue-400">Center</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions and get support
            </p>
          </div>

          <div className="space-y-12">
            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/contact-us" legacyBehavior>
                <a className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Contact Us</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get in touch with our support team</p>
                </a>
              </Link>
              <Link href="/faqs" legacyBehavior>
                <a className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">FAQs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find answers to common questions</p>
                </a>
              </Link>
              <Link href="/safety-tips" legacyBehavior>
                <a className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Safety Tips</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn about safety guidelines</p>
                </a>
              </Link>
            </div>

            {/* Common Issues */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Common Issues</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Wallet Connection Issues</h3>
                  <p className="text-gray-600 dark:text-gray-400">If you're having trouble connecting your Solana wallet, try these steps:</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Make sure you have a Solana wallet installed (Phantom, Solflare, etc.)</li>
                    <li>Check if your wallet is properly connected to the Solana network</li>
                    <li>Try refreshing the page and reconnecting your wallet</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Payment Problems</h3>
                  <p className="text-gray-600 dark:text-gray-400">If you're experiencing issues with payments:</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Ensure you have sufficient SOL in your wallet</li>
                    <li>Check if the transaction was confirmed on the Solana blockchain</li>
                    <li>Contact support if the issue persists</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Account Verification</h3>
                  <p className="text-gray-600 dark:text-gray-400">For account verification issues:</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Use your university email address for registration</li>
                    <li>Check your email for verification links</li>
                    <li>Contact your university IT department if you can't access your email</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Need More Help?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our support team is here to help you with any questions or issues you may have.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/contact-us" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                    Contact Support
                  </a>
                </Link>
                <Link href="mailto:support@campuscarpool.com" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Email Support
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 