'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
              Cookie <span className="text-blue-600 dark:text-blue-400">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last updated: March 15, 2024
            </p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Introduction</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This Cookie Policy explains how Campus Carpool uses cookies and similar technologies to recognize you when you 
                visit our platform. It explains what these technologies are and why we use them, as well as your rights to control 
                our use of them.
              </p>
            </div>

            {/* What are Cookies */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">What are Cookies?</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies 
                are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide 
                reporting information.
              </p>
            </div>

            {/* Types of Cookies */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    These cookies are strictly necessary for the platform to function properly. They enable core functionality such 
                    as security, network management, and accessibility. You may disable these by changing your browser settings, 
                    but this may affect how the platform functions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Performance Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    These cookies help us understand how visitors interact with our platform by collecting and reporting information 
                    anonymously. They help us improve the way our platform works.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    These cookies enable the platform to provide enhanced functionality and personalization. They may be set by us 
                    or by third-party providers whose services we have added to our pages.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">How We Use Cookies</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>To keep you signed in</li>
                  <li>To remember your preferences</li>
                  <li>To understand how you use our platform</li>
                  <li>To improve our platform's performance</li>
                  <li>To provide you with a better user experience</li>
                </ul>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Third-Party Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the 
                platform, deliver advertisements on and through the platform, and so on. These cookies are used to track your 
                browsing habits and enable us to show you relevant advertisements.
              </p>
            </div>

            {/* Managing Cookies */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Managing Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may 
                impact your experience using our platform. To learn more about cookies and how to manage them, visit 
                <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                  aboutcookies.org
                </a>.
              </p>
            </div>

            {/* Updates */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Updates to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we 
                use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly 
                to stay informed about our use of cookies and related technologies.
              </p>
            </div>

            {/* Contact */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If you have any questions about our use of cookies, please contact us:
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