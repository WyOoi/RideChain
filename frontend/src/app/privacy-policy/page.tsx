'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last updated: March 15, 2024
            </p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Introduction</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                At Campus Carpool, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do 
                not agree with the terms of this privacy policy, please do not access the platform.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you 
                about any changes by updating the "Last updated" date of this Privacy Policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Personal Information</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may collect personal information that you voluntarily provide to us when you register on the platform, 
                    express an interest in obtaining information about us or our products and services, or otherwise contact us. 
                    The personal information that we collect depends on the context of your interactions with us and the platform, 
                    the choices you make, and the products and features you use.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Wallet Information</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    When you connect your Solana wallet to our platform, we collect your wallet address and transaction history 
                    related to our services. We do not store your private keys or seed phrases.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Usage Data</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may collect information about how you access and use our platform, including your IP address, browser type, 
                    operating system, referring URLs, and other usage information.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Provide, maintain, and improve our platform</li>
                  <li>Process and complete transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Protect the security and integrity of our platform</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We have implemented appropriate technical and organizational security measures designed to protect the security 
                of any personal information we process. However, please also remember that we cannot guarantee that the internet 
                itself is 100% secure. Although we will do our best to protect your personal information, transmission of 
                personal information to and from our platform is at your own risk.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Your Rights</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to our processing of your personal information</li>
                  <li>Request restriction of processing your personal information</li>
                  <li>Request transfer of your personal information</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>
            </div>

            {/* Contact Us */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/contact-us" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                    Contact Us
                  </a>
                </Link>
                <Link href="mailto:privacy@campuscarpool.com" legacyBehavior>
                  <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Email Privacy Team
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