'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              How <span className="text-blue-600 dark:text-blue-400">Campus Carpool</span> Works
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A simple and secure way to share rides on campus
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md mr-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Create Your Account</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                Sign up with your university email and connect your Solana wallet. This ensures you're part of the campus community 
                and enables secure payments for ride sharing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md mr-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Post or Find a Ride</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                As a driver, post your route, schedule, and available seats. As a passenger, search for rides that match your 
                destination and timing. Our smart matching system helps you find the perfect ride.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md mr-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Connect and Coordinate</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                Use our built-in chat to coordinate pickup details, share your location, and communicate with your ride partners. 
                All messages are encrypted for your privacy.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md mr-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Secure Payment</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                Pay for your ride securely using SOL. Our smart contracts ensure that payments are only released after the ride 
                is completed, protecting both drivers and passengers.
              </p>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <Link href="/add-ride" legacyBehavior>
                <a className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                  Start Carpooling Today
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 