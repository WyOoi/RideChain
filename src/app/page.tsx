'use client';

import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-56 md:pt-64 animate-fade-in-up">
        
        <div className="text-center mb-32 md:mb-40 max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
              University Carpool Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight md:leading-snug">
            Smart Campus <span className="text-blue-600 dark:text-blue-400">Carpooling</span> Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Connect with fellow students, share rides, and make campus travel sustainable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/learn-more" legacyBehavior>
              <a className="w-full sm:w-auto px-8 py-3 text-lg font-medium text-blue-600 dark:text-blue-300 bg-transparent border-2 border-blue-500 dark:border-blue-400 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                Learn More
              </a>
            </Link>
            <Link href="/add-ride" legacyBehavior>
              <a className="w-full sm:w-auto px-8 py-3 text-lg font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 transition-colors">
                Offer a Ride
              </a>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-32 md:mb-40">
          <div className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-5">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Save Time</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Find rides that match your schedule and avoid waiting for campus shuttles.</p>
          </div>
          <div className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-5">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Save Money</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Split costs with fellow students and reduce your transportation expenses.</p>
          </div>
          <div className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-5">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Go Green</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Reduce carbon footprint and contribute to a sustainable campus environment.</p>
          </div>
        </div>

        <div className="text-center mb-32 md:mb-40">
          <div className="inline-block mb-6 md:mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-700 dark:text-purple-100">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-12 md:mb-20">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            <div className="text-center group p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <Link href="/post-ride" legacyBehavior>
                <a className="block">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md hover:bg-blue-600 transition-colors cursor-pointer">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                </a>
              </Link>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Post a Ride</h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Share your route, schedule, and how many seats you have or need.</p>
            </div>
            <div className="text-center group p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <Link href="/find-ride" legacyBehavior>
                <a className="block">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md hover:bg-blue-600 transition-colors cursor-pointer">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                </a>
              </Link>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Find Rides</h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Search for available rides or requests that match your criteria.</p>
            </div>
            <div className="text-center group p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <Link href="/connect" legacyBehavior>
                <a className="block">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-500 text-white rounded-full ring-4 ring-blue-200 dark:ring-blue-500/50 shadow-md hover:bg-blue-600 transition-colors cursor-pointer">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                </a>
              </Link>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Connect</h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Use the built-in chat to coordinate and travel together safely.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl md:rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden mb-32 md:mb-40 shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" style={{backgroundSize: '30px 30px'}}></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-50">Ready to Start Carpooling?</h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100/90 max-w-2xl mx-auto leading-relaxed">Join thousands of students already saving time and money while making campus travel more sustainable.</p>
            <Link href="/add-ride" legacyBehavior>
              <a className="px-10 py-4 text-lg md:text-xl font-semibold text-blue-700 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors dark:text-blue-600 dark:bg-slate-50 dark:hover:bg-slate-100 transform hover:scale-105 duration-300 ease-in-out">
                Get Started Now
              </a>
            </Link>
          </div>
        </div>

      </div>

      <footer className="bg-gray-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Campus Carpool</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Making campus travel smarter, greener, and more affordable for students.</p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-200">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about-us" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">About Us</a></Link></li>
                <li><Link href="/how-it-works" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">How It Works</a></Link></li>
                <li><Link href="/safety-tips" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Safety Tips</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-200">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help-center" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Help Center</a></Link></li>
                <li><Link href="/contact-us" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Contact Us</a></Link></li>
                <li><Link href="/faqs" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">FAQs</a></Link></li>
                <li><Link href="/learn-more" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Learn More</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-200">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></Link></li>
                <li><Link href="/terms-of-service" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Terms of Service</a></Link></li>
                <li><Link href="/cookie-policy" legacyBehavior><a className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Cookie Policy</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 pt-10 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Campus Carpool. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Inspired by the original Campus Carpool dApp by SuperIdol Smile.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
