'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Terms of <span className="text-blue-600 dark:text-blue-400">Service</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last updated: March 15, 2024
            </p>
          </div>

          <div className="space-y-12">
            {/* Agreement */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Agreement to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                By accessing or using Campus Carpool, you agree to be bound by these Terms of Service and all applicable laws 
                and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this 
                platform.
              </p>
            </div>

            {/* Eligibility */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Eligibility</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  To use Campus Carpool, you must:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Have a valid university email address</li>
                  <li>Have a valid driver's license (if offering rides)</li>
                  <li>Have a Solana wallet with sufficient SOL for transactions</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">User Responsibilities</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Account Security</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You are responsible for maintaining the security of your account and wallet. You agree to notify us immediately 
                    of any unauthorized access to your account or any other breach of security.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Prohibited Activities</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You agree not to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                    <li>Use the platform for any illegal purposes</li>
                    <li>Violate any laws or regulations</li>
                    <li>Harass, abuse, or harm others</li>
                    <li>Impersonate others or provide false information</li>
                    <li>Interfere with the proper functioning of the platform</li>
                    <li>Attempt to gain unauthorized access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Payment Terms</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  All payments are processed through Solana smart contracts. By using our platform, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Pay the agreed-upon amount in SOL for rides</li>
                  <li>Maintain sufficient SOL in your wallet for transactions</li>
                  <li>Accept that all transactions are final and non-refundable</li>
                  <li>Understand that we charge a small platform fee for each transaction</li>
                </ul>
              </div>
            </div>

            {/* Liability */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Campus Carpool is a platform that connects drivers and passengers. We are not responsible for the conduct of any 
                user, the condition of any vehicle, or the safety of any ride. Users are responsible for their own safety and 
                should exercise caution when using our platform.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting 
                the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the platform 
                after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </div>

            {/* Contact */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/contact-us" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                    Contact Us
                  </a>
                </Link>
                <Link href="mailto:legal@campuscarpool.com" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Email Legal Team
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