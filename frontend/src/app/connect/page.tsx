'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function Connect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Connect & <span className="text-blue-600 dark:text-blue-400">Coordinate</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Chat with your ride partner and coordinate the details
            </p>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Ride Details Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Main Campus → Engineering Building
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Today, 9:00 AM</span>
                    <span>•</span>
                    <span>3 seats available</span>
                    <span>•</span>
                    <span>0.5 SOL per seat</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {/* Sample Messages */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">JD</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-800 dark:text-gray-100">Hi! I'm interested in your ride. Is it still available?</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">9:30 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1">
                  <div className="bg-blue-600 dark:bg-blue-500 rounded-lg p-3">
                    <p className="text-white">Yes, it is! How many seats do you need?</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">9:31 AM</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600 dark:text-green-300">ME</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help? Check out our resources:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/safety-tips" legacyBehavior>
                <a className="text-blue-600 dark:text-blue-400 hover:underline">Safety Tips</a>
              </Link>
              <Link href="/how-it-works" legacyBehavior>
                <a className="text-blue-600 dark:text-blue-400 hover:underline">How It Works</a>
              </Link>
              <Link href="/help-center" legacyBehavior>
                <a className="text-blue-600 dark:text-blue-400 hover:underline">Help Center</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 