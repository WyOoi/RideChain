'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function PostRide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Post a <span className="text-blue-600 dark:text-blue-400">Ride</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Share your route and help fellow students travel sustainably
            </p>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <form className="space-y-6">
              {/* Route Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Route Details</h2>
                
                <div>
                  <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    id="pickup"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter pickup location"
                  />
                </div>

                <div>
                  <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    id="dropoff"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter dropoff location"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Schedule</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Ride Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Ride Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Seats
                    </label>
                    <input
                      type="number"
                      id="seats"
                      min="1"
                      max="7"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Number of seats"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price per Seat (SOL)
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Amount in SOL"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any additional information about the ride..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  Post Ride
                </button>
              </div>
            </form>
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