'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    SendTransactionError
} from '@solana/web3.js';

// Data for states and universities (from test2 template, duplicated for now)
const malaysianStates = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Malacca", "Negeri Sembilan", 
  "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu"
];

const allUniversities = [
  { name: "Universiti Teknologi Malaysia (UTM)", state: "Johor" },
  { name: "Universiti Tun Hussein Onn Malaysia (UTHM)", state: "Johor" },
  { name: "Universiti Utara Malaysia (UUM)", state: "Kedah" },
  { name: "AIMST University", state: "Kedah" },
  { name: "Universiti Malaysia Kelantan (UMK)", state: "Kelantan" },
  { name: "Universiti Malaya (UM)", state: "Kuala Lumpur" },
  { name: "Universiti Pertahanan Nasional Malaysia (UPNM)", state: "Kuala Lumpur" },
  { name: "Asia Pacific University of Technology & Innovation (APU)", state: "Kuala Lumpur" },
  { name: "International Islamic University Malaysia (IIUM)", state: "Kuala Lumpur" },
  { name: "Perdana University", state: "Kuala Lumpur" },
  { name: "UCSI University", state: "Kuala Lumpur" },
  { name: "Universiti Kuala Lumpur (UniKL)", state: "Kuala Lumpur" },
  { name: "Universiti Malaya - Wales (UM-Wales)", state: "Kuala Lumpur" },
  { name: "Universiti Poly-Tech Malaysia (UPTM)", state: "Kuala Lumpur" },
  { name: "HELP University", state: "Kuala Lumpur" },
  { name: "International Medical University (IMU)", state: "Kuala Lumpur" },
  { name: "Tunku Abdul Rahman University of Management and Technology (TARUMT)", state: "Kuala Lumpur" },
  { name: "Universiti Teknikal Malaysia Melaka (UTeM)", state: "Malacca" },
  { name: "Multimedia University (MMU) - Melaka", state: "Malacca" }, // Note: MMU has multiple campuses, specifying Melaka
  { name: "Universiti Sains Islam Malaysia (USIM)", state: "Negeri Sembilan" },
  { name: "INTI International University", state: "Negeri Sembilan" },
  { name: "KPJ Healthcare University", state: "Negeri Sembilan" },
  { name: "Nilai University", state: "Negeri Sembilan" },
  { name: "Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)", state: "Pahang" }, // Updated name
  { name: "DRB-HICOM University of Automotive Malaysia", state: "Pahang" },
  { name: "Universiti Sains Malaysia (USM)", state: "Penang" },
  { name: "Wawasan Open University (WOU)", state: "Penang" },
  { name: "Han Chiang University College of Communication", state: "Penang" },
  { name: "Sentral College Penang", state: "Penang" },
  { name: "Universiti Pendidikan Sultan Idris (UPSI)", state: "Perak" },
  { name: "Universiti Teknologi Petronas (UTP)", state: "Perak" },
  { name: "Quest International University (QIU)", state: "Perak" },
  { name: "Universiti Malaysia Perlis (UniMAP)", state: "Perlis" },
  { name: "Universiti Malaysia Sabah (UMS)", state: "Sabah" },
  { name: "Universiti Malaysia Sarawak (UNIMAS)", state: "Sarawak" },
  { name: "Curtin University Malaysia", state: "Sarawak" },
  { name: "Swinburne University of Technology Sarawak Campus", state: "Sarawak" },
  { name: "UCSI University, Sarawak Campus", state: "Sarawak" },
  { name: "University College of Technology Sarawak", state: "Sarawak" }, // Added based on search
  { name: "Universiti Kebangsaan Malaysia (UKM)", state: "Selangor" },
  { name: "Universiti Putra Malaysia (UPM)", state: "Selangor" },
  { name: "Universiti Teknologi MARA (UiTM)", state: "Selangor" }, // UiTM has many campuses, Shah Alam is the main one, but listing generally under Selangor
  { name: "Monash University Malaysia", state: "Selangor" },
  { name: "Sunway University", state: "Selangor" },
  { name: "Taylor's University", state: "Selangor" },
  { name: "Al-Madinah International University (MEDIU)", state: "Selangor" },
  { name: "Asia e University (AeU)", state: "Selangor" },
  { name: "Binary University of Management & Entrepreneurship", state: "Selangor" },
  { name: "City University Malaysia", state: "Selangor" },
  { name: "Infrastructure University Kuala Lumpur (IUKL)", state: "Selangor" },
  { name: "Limkokwing University of Creative Technology", state: "Selangor" },
  { name: "MAHSA University", state: "Selangor" },
  { name: "Management and Science University (MSU)", state: "Selangor" },
  { name: "Multimedia University (MMU) - Cyberjaya", state: "Selangor" }, // Specifying Cyberjaya campus
  { name: "Open University Malaysia (OUM)", state: "Selangor" },
  { name: "SEGi University", state: "Selangor" },
  { name: "Selangor Islamic University (UIS)", state: "Selangor" },
  { name: "Universiti Tenaga Nasional (UNITEN)", state: "Selangor" },
  { name: "University of Cyberjaya (UoC)", state: "Selangor" },
  { name: "University of Nottingham Malaysia", state: "Selangor" },
  { name: "Universiti Selangor (UNISEL)", state: "Selangor" },
  { name: "Universiti Sultan Zainal Abidin (UniSZA)", state: "Terengganu" },
  { name: "Universiti Malaysia Terengganu (UMT)", state: "Terengganu" },
  { name: "UCSI University, Terengganu Campus", state: "Terengganu" }, // Added based on search
  { name: "TATI University College", state: "Terengganu" }, // Added based on search
];

// Ride type (duplicated for now)
interface Ride {
  id: string;
  type: 'offer' | 'request'; // Added type field
  origin: string;
  destination: string;
  state: string;
  university: string;
  date: string;
  time: string;
  price: string;
  seats: string;
  driver: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver'; // For now, sender will be 'user'
  timestamp: number;
}

const RIDES_STORAGE_KEY = 'campusCarpoolRides';
const CHAT_MESSAGES_STORAGE_KEY = 'campusCarpoolChatMessages';

export default function FindRidePage() {
  // --- State for Carpool Features ---
  const [currentSearchMode, setCurrentSearchMode] = useState<'findOffers' | 'findRequests'>('findOffers'); // New state for search mode
  // In a real app, rides would come from a global context or API
  const [rides, setRides] = useState<Ride[]>([]); 
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // State for search form
  const [searchState, setSearchState] = useState("");
  const [searchUniversitiesInState, setSearchUniversitiesInState] = useState<{name: string, state: string}[]>([]);
  const [searchUniversity, setSearchUniversity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchPriceRange, setSearchPriceRange] = useState("any");
  const [searchTimeOfDay, setSearchTimeOfDay] = useState("any");

  // State for chat feature
  const [activeChatRide, setActiveChatRide] = useState<Ride | null>(null);
  const [chatInputMessage, setChatInputMessage] = useState("");
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);

  // State for payment feature
  const [isPaying, setIsPaying] = useState(false);
  const [paymentTxSignature, setPaymentTxSignature] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [activePaymentRideId, setActivePaymentRideId] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Load rides from localStorage on component mount
  useEffect(() => {
    try {
      const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
      if (storedRides) {
        const parsedRides = JSON.parse(storedRides) as Ride[];
        setRides(parsedRides);
        // Initially, filteredRides should also be filtered by the currentSearchMode
        if (!searchPerformed) { 
          const initialFilter = parsedRides.filter(ride => 
            currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
          );
          setFilteredRides(initialFilter);
        }
      } else {
        // If no rides in storage, ensure initial state is empty
        setRides([]);
        setFilteredRides([]);
      }
    } catch (error) {
      console.error("Error loading rides from localStorage:", error);
      setRides([]);
      setFilteredRides([]);
      // localStorage.removeItem(RIDES_STORAGE_KEY); // Optional: clear corrupted data
    }
  }, []); // Removed searchPerformed from dependency array to only load once on mount initially

  // --- Effects for Carpool Features ---
  useEffect(() => {
    // Populate universities based on selected state for Search form
    if (searchState) {
      setSearchUniversitiesInState(
        allUniversities.filter(uni => uni.state === searchState)
      );
      setSearchUniversity("");
    } else {
      setSearchUniversitiesInState([]);
    }
  }, [searchState]);

  useEffect(() => {
    // Initialize filtered rides or update if rides change and no search performed
    // OR if currentSearchMode changes and no search performed
    if (!searchPerformed) {
      const modeFilteredRides = rides.filter(ride => 
        currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
      );
      setFilteredRides(modeFilteredRides);
    }
    // If searchPerformed is true, filteredRides is managed by handleRideSearch.
  }, [rides, searchPerformed, currentSearchMode]); // Added currentSearchMode to dependencies

  // --- Handlers for Carpool Features ---
  const handleRideSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search Mode:", currentSearchMode, "Search Criteria:", { searchKeyword, searchDate, searchPriceRange, searchState, searchUniversity, searchTimeOfDay });
    setSearchPerformed(true);

    const relevantRides = rides.filter(ride => 
      currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
    );

    const results = relevantRides.filter(ride => {
      let match = true;
      if (searchState && ride.state !== searchState) match = false;
      if (searchUniversity && ride.university !== searchUniversity) match = false;
      if (searchDate && ride.date !== searchDate) match = false;
      
      if (searchKeyword && 
          (!ride.destination?.toLowerCase().includes(searchKeyword.toLowerCase()) && 
           !ride.origin?.toLowerCase().includes(searchKeyword.toLowerCase()))) {
        match = false;
      }

      if (searchPriceRange !== 'any') {
        const price = parseFloat(ride.price);
        const [minStr, maxStr] = searchPriceRange.split('-');
        const min = parseFloat(minStr);
        const max = maxStr ? parseFloat(maxStr) : null;

        if (max !== null) { 
          if (price < min || price > max) match = false;
        } else { 
          if (price < min) match = false;
        }
      }
      
      if (searchTimeOfDay !== 'any' && ride.time) {
        const rideHour = parseInt(ride.time.split(':')[0]);
        if (searchTimeOfDay === 'morning' && (rideHour < 6 || rideHour >= 12)) match = false;
        if (searchTimeOfDay === 'afternoon' && (rideHour < 12 || rideHour >= 17)) match = false;
        if (searchTimeOfDay === 'evening' && (rideHour < 17 || rideHour >= 21)) match = false;
        if (searchTimeOfDay === 'night' && !((rideHour >= 21 && rideHour <=23) || (rideHour >=0 && rideHour < 6))) match = false;
      }
      return match;
    });
    setFilteredRides(results);
  };

  const handleOpenChat = (ride: Ride) => {
    setActiveChatRide(ride);
    setChatInputMessage("");
    try {
      const allStoredMessages = JSON.parse(localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY) || '{}');
      setCurrentChatMessages(allStoredMessages[ride.id] || []);
    } catch (error) {
      console.error("Error loading chat messages from localStorage:", error);
      setCurrentChatMessages([]);
    }
  };

  const handleSendChatMessage = () => {
    if (!activeChatRide || !chatInputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: chatInputMessage,
      sender: 'user', // All messages from current user for now
      timestamp: Date.now(),
    };

    const updatedMessagesForRide = [...currentChatMessages, newMessage];
    setCurrentChatMessages(updatedMessagesForRide);

    try {
      const allStoredMessages = JSON.parse(localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY) || '{}');
      allStoredMessages[activeChatRide.id] = updatedMessagesForRide;
      localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(allStoredMessages));
    } catch (error) {
      console.error("Error saving chat message to localStorage:", error);
      // Optionally, provide feedback to the user that saving failed
      // And potentially revert setCurrentChatMessages if persistence is critical before showing locally
    }

    console.log(`Message to driver ${activeChatRide.driver} for ride ${activeChatRide.id}: ${chatInputMessage}`);
    // Alert can be removed or changed now that messages are displayed
    // alert(`Message sent (logged & saved locally for this ride):\nMessage: ${chatInputMessage}`);
    setChatInputMessage("");
  };

  const handlePayForRide = useCallback(async (rideToPay: Ride) => {
    if (!publicKey || !sendTransaction || !connection) {
      setPaymentError("Wallet not connected or connection issue.");
      return;
    }

    if (rideToPay.type !== 'offer') {
        setPaymentError("Cannot pay for a ride request.");
        return;
    }

    // Ensure the driver's address is a valid base58 string before creating PublicKey
    // This is crucial if old data with "..." still exists or if driver key is somehow invalid
    let recipientPublicKey: PublicKey;
    try {
        recipientPublicKey = new PublicKey(rideToPay.driver);
    } catch (e) {
        console.error("Invalid driver public key:", rideToPay.driver, e);
        setPaymentError("Driver address is invalid. Cannot proceed with payment.");
        setActivePaymentRideId(rideToPay.id); // Set active ride for error display context
        return;
    }

    const conversionFactor = 0.0013311509375834281;
    const priceInMYR = parseFloat(rideToPay.price);

    if (isNaN(priceInMYR) || priceInMYR <= 0) {
        setPaymentError("Invalid ride price entered.");
        setActivePaymentRideId(rideToPay.id);
        return;
    }

    const ridePriceSOL = priceInMYR * conversionFactor;
    
    if (isNaN(ridePriceSOL) || ridePriceSOL <= 0) {
      setPaymentError("Calculated SOL amount is invalid or zero after conversion.");
      setActivePaymentRideId(rideToPay.id); // Set active ride for error display context
      return;
    }
    // Lamports should be an integer.
    const amountLamports = Math.round(ridePriceSOL * LAMPORTS_PER_SOL);


    setIsPaying(true);
    setActivePaymentRideId(rideToPay.id);
    setPaymentTxSignature(null);
    setPaymentError(null);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey, // Use the validated PublicKey
          lamports: amountLamports,    // Use the parsed amount in Lamports
        })
      );

      // Get a recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      
      setPaymentTxSignature(signature);
      console.log("Payment successful! Signature:", signature);
      // Potentially update UI to show ride as paid, or navigate away, etc.
      // For now, just logs and shows signature.

    } catch (error: any) {
      console.error("Payment failed:", error);
      let errorMessage = "Payment failed. Please try again.";
      if (error instanceof SendTransactionError) {
        // For SendTransactionError, you might have more specific logs
        // e.g., error.logs?.join('\n')
        errorMessage = `Transaction failed: ${error.message}`;
        if (error.logs) {
            console.error("Transaction logs:", error.logs);
            // errorMessage += ` Logs: ${error.logs.join(", ")}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setPaymentError(errorMessage);
    } finally {
      setIsPaying(false);
      // Keep activePaymentRideId for a bit so the message stays visible, or clear it after a delay
      // For now, let's clear it. If message disappears too fast, we can adjust.
      // setTimeout(() => setActivePaymentRideId(null), 5000); // Example delay
    }
  }, [publicKey, sendTransaction, connection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <section id="find-ride" className="my-16 md:my-24 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-12 text-center">
            {currentSearchMode === 'findOffers' ? 'Find a Ride Offer' : 'Find a Ride Request'}
          </h1>

          {/* Mode Toggle Buttons */}
          <div className="flex justify-center mb-8 space-x-2">
            <button 
              onClick={() => setCurrentSearchMode('findOffers')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors 
                ${currentSearchMode === 'findOffers' 
                  ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              I Need a Ride (Find Offers)
            </button>
            <button 
              onClick={() => setCurrentSearchMode('findRequests')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors 
                ${currentSearchMode === 'findRequests' 
                  ? 'bg-green-600 text-white shadow-md dark:bg-green-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              I'm Driving (Find Requests)
            </button>
          </div>

          <form onSubmit={handleRideSearch} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="search-keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keyword (Origin/Destination)
                </label>
                <input
                  type="text"
                  name="search-keyword"
                  id="search-keyword"
                  className="input-field-page"
                  placeholder="e.g., Library, Town"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="search-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input type="date" name="search-date" id="search-date" className="input-field-page" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="search-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select id="search-state" name="search-state" value={searchState} onChange={(e) => setSearchState(e.target.value)} className="input-field-page">
                  <option value="">All States</option>
                  {malaysianStates.map(state => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="search-university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                <select id="search-university" name="search-university" value={searchUniversity} onChange={(e) => setSearchUniversity(e.target.value)} disabled={!searchState || searchUniversitiesInState.length === 0} className="input-field-page disabled:bg-gray-200 dark:disabled:bg-gray-700/50">
                  <option value="">{searchState ? "All Universities in State" : "Select state first"}</option>
                  {searchUniversitiesInState.map(uni => (<option key={uni.name} value={uni.name}>{uni.name}</option>))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div>
                <label htmlFor="search-priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select id="search-priceRange" name="search-priceRange" className="input-field-page" value={searchPriceRange} onChange={(e) => setSearchPriceRange(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="0-5">RM0 - RM5</option>
                  <option value="5-10">RM5 - RM10</option>
                  <option value="10-20">RM10 - RM20</option>
                  <option value="20+">RM20+</option>
                </select>
              </div>
              <div>
                <label htmlFor="search-timeOfDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time of Day</label>
                <select id="search-timeOfDay" name="search-timeOfDay" className="input-field-page" value={searchTimeOfDay} onChange={(e) => setSearchTimeOfDay(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="morning">Morning (6am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-9pm)</option>
                  <option value="night">Night (9pm-6am)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600">
              Search Rides
            </button>
          </form>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">
              {currentSearchMode === 'findOffers' ? 'Available Ride Offers' : 'Available Ride Requests'}
            </h3>
            {searchPerformed && filteredRides.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No {currentSearchMode === 'findOffers' ? 'ride offers' : 'ride requests'} found matching your criteria.
              </p>
            )}
            {!searchPerformed && filteredRides.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No {currentSearchMode === 'findOffers' ? 'ride offers' : 'ride requests'} currently available. 
                  {currentSearchMode === 'findOffers' && 
                    <Link href="/add-ride" legacyBehavior><a className="text-blue-600 hover:underline">Offer a ride</a></Link> }
                  {currentSearchMode === 'findRequests' && 
                    <Link href="/add-ride" legacyBehavior><a className="text-green-600 hover:underline">Request a ride</a></Link> }
                   or try a search later!
                </p>
            )}
            <div className="space-y-4">
              {filteredRides.map(ride => (
                <div key={ride.id} 
                  className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow 
                  ${ride.type === 'offer' ? 'bg-green-50 dark:bg-green-800/30' : 
                    ride.type === 'request' ? 'bg-blue-50 dark:bg-blue-800/30' : 
                    'bg-gray-50 dark:bg-gray-700/70'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-xl font-semibold 
                      ${ride.type === 'offer' ? 'text-green-700 dark:text-green-300' : 
                        ride.type === 'request' ? 'text-blue-700 dark:text-blue-300' : 
                        'text-gray-700 dark:text-gray-300'}`}>
                      {ride.type === 'offer' ? 'Ride Offer' : 
                       ride.type === 'request' ? 'Ride Request' : 
                       'Ride Posting'}                                         
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
                      ${ride.type === 'offer' ? 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100' : 
                        ride.type === 'request' ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                      {ride.type ? ride.type.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="text-md text-gray-700 dark:text-gray-200">From: <span className="font-medium">{ride.origin}</span></p>
                  <p className="text-md text-gray-700 dark:text-gray-200">To: <span className="font-medium">{ride.destination}</span> ({ride.university})</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">State: {ride.state}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date: {ride.date} at {ride.time}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ride.type === 'request' ? 'Requester' : 'Driver'}: {ride.driver} | 
                    {ride.type === 'offer' ? 'Seats Available' : 'Seats Needed'}: {ride.seats}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <p className={`text-lg font-bold ${ride.type === 'offer' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        RM{parseFloat(ride.price).toFixed(2)}
                        {ride.type === 'request' && <span className="text-xs font-normal"> (Willing to Pay)</span>}
                    </p>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => handleOpenChat(ride)}
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-colors duration-150 ease-in-out">
                            {ride.type === 'offer' ? 'Chat with Driver' : 'Chat with Requester'}
                        </button>
                        {ride.type === 'offer' && publicKey && (
                            <button 
                                onClick={() => handlePayForRide(ride)} 
                                disabled={isPaying && activePaymentRideId === ride.id}
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out">
                                {(isPaying && activePaymentRideId === ride.id) ? 'Processing...' : 'Pay with SOL'}
                            </button>
                        )}
                    </div>
                  </div>
                  {/* Payment status feedback for this specific ride card */}
                  {activePaymentRideId === ride.id && paymentTxSignature && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 break-all">
                      Payment Successful! Tx: {paymentTxSignature.substring(0, 20)}...
                    </div>
                  )}
                  {activePaymentRideId === ride.id && paymentError && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 break-all">
                      Payment Failed: {paymentError}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chat Modal/Area */}
        {activeChatRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col" style={{maxHeight: '80vh'}}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Chat with {activeChatRide?.type === 'offer' ? 'Driver' : 'Requester'}
                </h4>
                <button onClick={() => setActiveChatRide(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Ride ID: <span className="font-medium">{activeChatRide.id.substring(0,8)}...</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeChatRide?.type === 'offer' ? 'Driver' : 'Requester'}: <span className="font-medium">{activeChatRide.driver}</span>
                </p>
              </div>
              
              {/* Chat Message Display Area */}
              <div className="flex-grow h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-3 mb-4 bg-gray-50 dark:bg-gray-700/50 space-y-2">
                {currentChatMessages.length === 0 ? (
                  <p className='text-xs text-gray-500 dark:text-gray-400 italic text-center py-4'>No messages yet. Start the conversation!</p>
                ) : (
                  currentChatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg shadow ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center">
                <textarea 
                  value={chatInputMessage}
                  onChange={(e) => setChatInputMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChatMessage(); } }}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-12 resize-none"
                />
                <button 
                  onClick={handleSendChatMessage}
                  disabled={!chatInputMessage.trim()}
                  className="py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 flex items-center justify-center"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Duplicating styles for now, consider moving to globals.css */}
      <style jsx global>{`
        .input-field-page {
          display: block;
          width: 100%;
          margin-top: 0.25rem;
          padding: 0.75rem 1rem; 
          border: 1px solid #D1D5DB; 
          border-radius: 0.375rem; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
          background-color: #FFF; 
          color: #111827; 
        }
        .dark .input-field-page {
          background-color: #374151; 
          border-color: #4B5563; 
          color: #F3F4F6; 
        }
        .input-field-page:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3B82F6; 
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); 
        }
        .input-field-page.disabled\:bg-gray-200:disabled {
            background-color: #E5E7EB; 
        }
        .dark .input-field-page.dark\:disabled\:bg-gray-700\/50:disabled {
            background-color: rgba(55, 65, 81, 0.5); 
        }
        /* Basic fade-in animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
} 