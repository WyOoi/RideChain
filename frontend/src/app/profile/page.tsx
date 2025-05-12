'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link'; // For potential future links to ride details

// Ride type should be consistent with other pages
interface Ride {
  id: string;
  origin: string;
  destination: string;
  state: string;
  university: string;
  date: string;
  time: string;
  price: string;
  seats: string;
  driver: string; // This should match the format stored (e.g., shortened public key)
}

const RIDES_STORAGE_KEY = 'campusCarpoolRides';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userOfferedRides, setUserOfferedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for license UI Mockup
  const [licenseExpiryYear, setLicenseExpiryYear] = useState<string | null>(null);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [isProcessingLicense, setIsProcessingLicense] = useState(false);
  const [licenseFileName, setLicenseFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // For the file input

  useEffect(() => {
    if (publicKey) {
      const fullAddress = publicKey.toBase58();
      setUserAddress(fullAddress);
      
      // No longer need to shorten the address for filtering
      // const storedDriverId = fullAddress.substring(0, 8) + '...';

      try {
        const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
        if (storedRides) {
          const allRides = JSON.parse(storedRides) as Ride[];
          // Filter by the full public key
          const offeredByMe = allRides.filter(ride => ride.driver === fullAddress);
          setUserOfferedRides(offeredByMe);
        }
      } catch (error) {
        console.error("Error loading or filtering rides from localStorage:", error);
        setUserOfferedRides([]);
      }
    } else {
      setUserAddress(null);
      setUserOfferedRides([]);
    }
    setIsLoading(false);
  }, [publicKey]);

  const handleLicenseFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLicenseFileName(file.name);
      setIsProcessingLicense(true);
      setLicenseVerified(false);
      setLicenseExpiryYear(null);

      // Simulate OCR processing
      setTimeout(() => {
        setLicenseExpiryYear("2027"); // Mocked data
        setLicenseVerified(true);
        setIsProcessingLicense(false);
        // Auto-delete: In a real scenario, you wouldn't store the file data.
        // Here, we just clear the file input for demonstration if needed, though it usually clears itself.
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        alert(`Mock OCR complete for ${file.name}. Expiry: 2027. Status: Verified. The file itself was not stored or truly processed.`);
      }, 2500);
    }
  };

  const handleClearLicenseData = () => {
    setLicenseFileName(null);
    setLicenseExpiryYear(null);
    setLicenseVerified(false);
    setIsProcessingLicense(false); // Ensure processing is also stopped
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <section id="profile-header" className="my-12 md:my-16 max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-8 text-center">
            My Profile
          </h1>
          
          {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Loading profile...</p>}
          
          {!isLoading && !publicKey && (
            <p className="text-center text-gray-700 dark:text-gray-300">
              Please connect your wallet to view your profile.
            </p>
          )}

          {userAddress && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Wallet Address:</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Wallet Address Text - takes up available space */}
                <p className="flex-grow text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md break-all">
                  {userAddress}
                </p>
                {/* QR Code Section - fixed size, on the right */}
                <div className="flex-shrink-0 text-center sm:ml-4">
                  <div className="p-1 bg-white dark:bg-gray-300 rounded-lg shadow-inner inline-block w-[136px] h-[136px]">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(userAddress)}&bgcolor=ffffff&color=000000&qzone=1`}
                      alt="Wallet Address QR Code"
                      width={128} 
                      height={128}
                      className="rounded-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scan to copy</p>
                </div>
              </div>
            </div>
          )}

          {/* License Verification Mockup Section */}
          {publicKey && !isLoading && (
            <div className="mb-10 pt-6 border-t border-gray-300 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Driving License Verification</h2>
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg shadow-sm space-y-4">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Status: </span>
                  {isProcessingLicense ? (
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">Pending Verification...</span>
                  ) : licenseVerified ? (
                    <span className="font-semibold text-green-600 dark:text-green-400">Verified (Mock)</span>
                  ) : (
                    <span className="font-semibold text-red-600 dark:text-red-400">Unverified</span>
                  )}
                </div>

                {licenseVerified && licenseExpiryYear && licenseFileName && (
                  <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                     <p><span className="font-medium">File:</span> {licenseFileName}</p>
                     <p><span className="font-medium">Mock Expiry Year:</span> {licenseExpiryYear}</p>
                  </div>
                )}

                {!isProcessingLicense && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
                    {!licenseVerified && (
                        <>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                onChange={handleLicenseFileSelect} 
                                className="hidden" 
                                ref={fileInputRef}
                                id="licenseUpload"
                            />
                            <label 
                                htmlFor="licenseUpload"
                                className="w-full sm:w-auto cursor-pointer py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-center"
                            >
                                Upload License (Mock)
                            </label>
                        </>
                    )}
                    {(licenseFileName || licenseVerified) && (
                        <button 
                            onClick={handleClearLicenseData}
                            className="w-full sm:w-auto py-2 px-4 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                        >
                            Clear License Data
                        </button>
                    )}
                  </div>
                )}
                {isProcessingLicense && licenseFileName && (
                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Processing {licenseFileName}...</p>
                )}
                {!isProcessingLicense && !licenseVerified && (
                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Upload an image to (mock) verify your license.</p>
                )}
              </div>
            </div>
          )}

          {publicKey && !isLoading && (
            <div className="pt-6 border-t border-gray-300 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Rides You've Offered:</h2>
              {userOfferedRides.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  You haven't offered any rides yet. 
                  <Link href="/add-ride" legacyBehavior>
                    <a className="text-blue-600 hover:underline">Offer a ride now!</a>
                  </Link>
                </p>
              ) : (
                <div className="space-y-6">
                  {userOfferedRides.map(ride => (
                    <div key={ride.id} className="bg-white dark:bg-gray-700/70 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400">From: {ride.origin}</h4>
                      <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400">To: {ride.destination} ({ride.university})</h4>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 grid grid-cols-2 gap-x-4 gap-y-1">
                        <p><strong>State:</strong> {ride.state}</p>
                        <p><strong>Date:</strong> {ride.date}</p>
                        <p><strong>Time:</strong> {ride.time}</p>
                        <p><strong>Price:</strong> RM{parseFloat(ride.price).toFixed(2)}</p>
                        <p><strong>Seats:</strong> {ride.seats}</p>
                        <p><strong>Ride ID:</strong> <span className="font-mono text-xs">{ride.id.substring(0,8)}...</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      {/* Shared styles can be in globals.css */}
    </div>
  );
} 