'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function SafetyTips() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Safety <span className="text-blue-600 dark:text-blue-400">Tips</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your safety is our top priority. Follow these guidelines for a secure carpooling experience.
            </p>
          </div>

          <div className="space-y-12">
            {/* For Passengers */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">For Passengers</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Always verify the driver's identity and vehicle details before getting in.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Share your ride details with a friend or family member.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Use the in-app chat for communication and keep records of conversations.</p>
                </div>
              </div>
            </div>

            {/* For Drivers */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">For Drivers</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Ensure your vehicle is well-maintained and meets safety standards.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Keep your profile and vehicle information up to date.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Follow traffic rules and maintain safe driving practices.</p>
                </div>
              </div>
            </div>

            {/* General Safety */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">General Safety Guidelines</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Always wear seatbelts and follow COVID-19 safety protocols.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Report any safety concerns or incidents through the app immediately.</p>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mt-1 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Respect personal boundaries and maintain professional conduct.</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Emergency Contact</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you experience any safety issues or emergencies, please contact:
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="tel:911" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-red-600 border-2 border-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Emergency: 911
                  </a>
                </Link>
                <Link href="mailto:support@campuscarpool.com" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Support Email
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