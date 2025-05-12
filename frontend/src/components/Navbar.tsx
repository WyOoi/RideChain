'use client';

import Link from 'next/link';
// import { useRouter } from 'next/router'; // Not strictly needed if only using hash links
import WalletButton from '@/components/WalletButton';
// import ClientSideThemeSwitcher from './ClientSideThemeSwitcher';
import React from 'react';

export default function Navbar() {
  // const router = useRouter(); // Can be used for more complex navigation if needed

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 sm:py-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-bold text-gray-800 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Campus<span className="text-blue-600 dark:text-blue-400">Carpool</span>
            </a>
          </Link>
          
          {/* Moved navigation and wallet button to a single flex container on the right */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/find-ride" legacyBehavior>
                <a className="text-base font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Find a Ride
                </a>
              </Link>
              <Link href="/add-ride" legacyBehavior>
                <a className="text-base font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Offer a Ride
                </a>
              </Link>
              <Link href="/send-sol" legacyBehavior> 
                <a className="text-base font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Send SOL
                </a>
              </Link>
              <Link href="/profile" legacyBehavior> 
                <a className="text-base font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  My Profile
                </a>
              </Link>
            </nav>
            <div className="ml-4"> {/* Added margin-left for spacing if needed */}
              <WalletButton />
            </div>
          </div>
          {/* Mobile menu button (optional, can be added later) */}
        </div>
      </div>
    </header>
  );
} 