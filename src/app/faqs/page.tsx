'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function FAQs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Frequently Asked <span className="text-blue-600 dark:text-blue-400">Questions</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about Campus Carpool
            </p>
          </div>

          <div className="space-y-8">
            {/* Getting Started */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How do I create an account?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    To create an account, you'll need a valid university email address and a Solana wallet. Click the "Sign Up" 
                    button, enter your university email, and connect your Solana wallet. Follow the verification steps to complete 
                    your registration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Which Solana wallets are supported?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We support popular Solana wallets including Phantom, Solflare, and Slope. Make sure your wallet is connected 
                    to the Solana mainnet and has sufficient SOL for transactions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How do I verify my university email?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    After signing up, you'll receive a verification email. Click the link in the email to verify your account. 
                    If you don't receive the email, check your spam folder or request a new verification email from your account settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Using the Platform */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Using the Platform</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How do I post a ride?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Post a Ride" and fill in your route details, including pickup and dropoff locations, date, time, 
                    and number of available seats. Set your price in SOL and publish your ride. Other users can then book 
                    available seats.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How do I book a ride?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Search for available rides using the search bar. Filter by date, time, and route. When you find a suitable 
                    ride, click "Book" and confirm the payment using your Solana wallet. The driver will be notified of your booking.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How are payments handled?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All payments are processed through Solana smart contracts. The payment is held in escrow until the ride is 
                    completed. Once the ride is marked as complete, the payment is automatically released to the driver.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety and Security */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Safety and Security</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How do you ensure user safety?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We verify all users through their university email addresses, maintain ride history, and provide in-app 
                    communication. Users can rate and review each other after rides. We also have a 24/7 support team for 
                    safety concerns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    What should I do if I have a safety concern?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you experience any safety issues, immediately contact our support team through the app or call our 
                    emergency line. We take all safety concerns seriously and will investigate promptly.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    How is my personal information protected?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use industry-standard encryption to protect your data. Your personal information is only shared with 
                    other users when necessary for ride coordination. We never sell your data to third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Need More Help */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Still have questions? We're here to help!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/contact-us" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                    Contact Support
                  </a>
                </Link>
                <Link href="/help-center" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Visit Help Center
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