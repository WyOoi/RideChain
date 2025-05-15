'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    SendTransactionError
} from '@solana/web3.js';
import { PaymentLock } from '../components/PaymentLock';
import { AnchorProvider, Program, web3, BN } from '@project-serum/anchor';
import { IDL } from '@/idl/ride_chain';
import { 
  initializeSocket, 
  subscribeToRideUpdates,
  subscribeToNewRides,
  subscribeToDeletedRides
} from '@/services/websocket';
import { Ride } from '@/types/ride';
import { emitRideUpdate } from '@/services/websocket';
import { PROGRAM_ID, RPC_URL, RIDES_STORAGE_KEY } from '@/app/config';

// Remove the hardcoded exchange rate
// const RM_TO_SOL_RATE = 0.05; // Example: 1 RM = 0.05 SOL

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
// This should be moved to a shared type file and imported instead
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver'; // For now, sender will be 'user'
  timestamp: number;
}

const CHAT_MESSAGES_STORAGE_KEY = 'campusCarpoolChatMessages';

// Add blockchain data fetching function
async function fetchRidesFromBlockchain() {
  try {
    console.log("[Blockchain] Attempting to fetch rides from blockchain");
    
    // Get program ID from config or environment
    const programIdString = PROGRAM_ID;
    
    if (!programIdString || programIdString.trim() === '') {
      console.error("[Blockchain] Program ID is empty or invalid");
      return [];
    }
    
    console.log("[Blockchain] Using Program ID:", programIdString);
    
    // Validate program ID is a proper public key before creating PublicKey object
    try {
      // Setup connection (no need for wallet when just reading)
      const connection = new web3.Connection(RPC_URL, { commitment: 'confirmed' });
      const programId = new web3.PublicKey(programIdString);
      
      console.log("[Blockchain] Successfully created program ID public key");
      
      // Find all rides created by the program (using getProgramAccounts)
      console.log("[Blockchain] Fetching program accounts...");
      const accounts = await connection.getProgramAccounts(programId, {
        filters: [
          {
            memcmp: {
              offset: 8, // Skip the account discriminator
              bytes: web3.PublicKey.default.toBase58(), // This is a placeholder - actual filtering depends on your data structure
            },
          },
        ],
      });
      
      console.log(`[Blockchain] Found ${accounts.length} program accounts`);
      
      // Parse the account data
      const provider = new AnchorProvider(connection, {} as any, {});
      const program = new Program(IDL as any, programId, provider);
      
      const rides = accounts.map(account => {
        try {
          // Parse account data using the Ride account struct from IDL
          const rideAccount = program.coder.accounts.decode('Ride', account.account.data);
          
          // Convert to our frontend Ride type
          return {
            id: rideAccount.id,
            type: rideAccount.ride_type,
            origin: rideAccount.origin,
            destination: rideAccount.destination,
            state: rideAccount.state,
            university: rideAccount.university,
            date: rideAccount.date,
            time: rideAccount.time,
            price: (rideAccount.price.toNumber() / web3.LAMPORTS_PER_SOL).toString(),
            seats: rideAccount.seats.toString(),
            driver: rideAccount.driver.toBase58(),
            paymentStatus: rideAccount.payment_status,
          };
        } catch (error) {
          console.error('[Blockchain] Error decoding ride account:', error);
          return null;
        }
      }).filter(ride => ride !== null);
      
      console.log(`[Blockchain] Successfully parsed ${rides.length} rides`);
      return rides;
    } catch (publicKeyError) {
      console.error("[Blockchain] Invalid program ID format:", publicKeyError);
      return [];
    }
  } catch (error) {
    console.error('[Blockchain] Error fetching rides from blockchain:', error);
    return [];
  }
}

export default function FindRidePage() {
  const router = useRouter();
  // --- State for Carpool Features ---
  const [currentSearchMode, setCurrentSearchMode] = useState<'findOffers' | 'findRequests'>('findOffers'); // New state for search mode
  // In a real app, rides would come from a global context or API
  const [rides, setRides] = useState<Ride[]>([]); 
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for exchange rate
  const [exchangeRate, setExchangeRate] = useState<{
    rmToSol: number;
    lastUpdated: Date | null;
    isLoading: boolean;
    error: string | null;
  }>({
    rmToSol: 0.05, // Default fallback rate
    lastUpdated: null,
    isLoading: false,
    error: null
  });

  // Check URL parameters for mode
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      
      if (modeParam === 'findOffers' || modeParam === 'findRequests') {
        setCurrentSearchMode(modeParam);
        console.log(`Setting search mode from URL parameter: ${modeParam}`);
      }
    }
  }, []);

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

  // Add new state for payment locking
  const [isPaymentLocked, setIsPaymentLocked] = useState(false);
  const [showPaymentLock, setShowPaymentLock] = useState(false);

  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();

  // Add state for payment processing
  const [paymentLoadingRideId, setPaymentLoadingRideId] = useState<string | null>(null);
  const [paymentErrorRideId, setPaymentErrorRideId] = useState<string | null>(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Add state for transaction signature
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [txRideId, setTxRideId] = useState<string | null>(null);
  const [txAmount, setTxAmount] = useState<{rm: number, sol: number} | null>(null);

  // Function to fetch real-time exchange rates
  const fetchExchangeRates = async () => {
    try {
      setExchangeRate(prev => ({ ...prev, isLoading: true, error: null }));
      console.log("[Exchange] Fetching current exchange rates...");
      
      // Fetch SOL price in USD
      const solResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const solData = await solResponse.json();
      const solUsdPrice = solData.solana.usd;
      
      // Fetch MYR to USD rate
      const fxResponse = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
      const fxData = await fxResponse.json();
      const usdToMyr = fxData.rates.myr.value / fxData.rates.usd.value; // Convert from rate per USD to USD per MYR
      
      // Calculate RM to SOL rate
      const rmToSolRate = 1 / (solUsdPrice * usdToMyr);
      
      console.log(`[Exchange] Current rates: 1 SOL = $${solUsdPrice} USD, 1 USD = ${usdToMyr} MYR`);
      console.log(`[Exchange] Calculated conversion: 1 RM = ${rmToSolRate.toFixed(6)} SOL`);
      
      setExchangeRate({
        rmToSol: rmToSolRate,
        lastUpdated: new Date(),
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("[Exchange] Error fetching exchange rates:", error);
      setExchangeRate(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch current exchange rates. Using default rates."
      }));
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    // Connect to WebSocket
    const socket = initializeSocket();
    
    // Clean up on unmount
    return () => {
      // No need to disconnect the socket here as it should persist across the app
    };
  }, []);
  
  // Fetch exchange rates on mount and periodically
  useEffect(() => {
    // Initial fetch
    fetchExchangeRates();
    
    // Set up interval to refresh rates every 15 minutes
    const rateRefreshInterval = setInterval(fetchExchangeRates, 15 * 60 * 1000);
    
    return () => clearInterval(rateRefreshInterval);
  }, []);
  
  // Subscribe to ride updates
  useEffect(() => {
    // Subscribe to ride updates
    const unsubscribeRideUpdates = subscribeToRideUpdates((updatedRide) => {
      setRides(prevRides =>
        prevRides.map(ride => ride.id === updatedRide.id ? updatedRide : ride)
      );
      
      // Update filteredRides if necessary
      if (searchPerformed) {
        setFilteredRides(prevFiltered =>
          prevFiltered.map(ride => ride.id === updatedRide.id ? updatedRide : ride)
        );
      }
    });
    
    // Subscribe to new rides
    const unsubscribeNewRides = subscribeToNewRides((newRide) => {
      setRides(prevRides => [...prevRides, newRide]);
      
      // Update filteredRides if necessary and if the new ride matches current search mode
      if (!searchPerformed && 
          (currentSearchMode === 'findOffers' ? newRide.type === 'offer' : newRide.type === 'request')) {
        setFilteredRides(prevFiltered => [...prevFiltered, newRide]);
      }
    });
    
    // Subscribe to deleted rides
    const unsubscribeDeletedRides = subscribeToDeletedRides((deletedRideId) => {
      setRides(prevRides => prevRides.filter(ride => ride.id !== deletedRideId));
      setFilteredRides(prevFiltered => prevFiltered.filter(ride => ride.id !== deletedRideId));
    });
    
    // Clean up subscriptions on unmount
    return () => {
      unsubscribeRideUpdates();
      unsubscribeNewRides();
      unsubscribeDeletedRides();
    };
  }, [searchPerformed, currentSearchMode]);

  // Update useEffect to fetch from blockchain first, then fall back to localStorage
  useEffect(() => {
    async function loadRides() {
      setIsLoading(true);
      
      // Check if we need to force refresh from localStorage
      const forceRefresh = localStorage.getItem('forceRideRefresh') === 'true';
      if (forceRefresh) {
        // Clear the flag
        localStorage.removeItem('forceRideRefresh');
        console.log("Forced ride refresh detected, loading directly from localStorage");
        
        // Load directly from localStorage
        try {
          const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
          if (storedRides) {
            const parsedRides = JSON.parse(storedRides) as Ride[];
            setRides(parsedRides);
            
            // Filter rides by current search mode
            if (!searchPerformed) {
              const initialFilter = parsedRides.filter(ride => 
                currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
              );
              setFilteredRides(initialFilter);
            }
          }
          setIsLoading(false);
          return; // Skip the normal loading process
        } catch (error) {
          console.error("Error loading rides from localStorage during forced refresh:", error);
        }
      }
      
      try {
        // Always load from localStorage first to ensure we have some data
        let localRides: Ride[] = [];
        try {
          const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
          if (storedRides) {
            localRides = JSON.parse(storedRides) as Ride[];
            
            // Apply initial rides from localStorage
            setRides(localRides);
            
            // Filter rides by current search mode
            if (!searchPerformed) {
              const initialFilter = localRides.filter(ride => 
                currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
              );
              setFilteredRides(initialFilter);
            }
          }
        } catch (localStorageError) {
          console.error("Error loading rides from localStorage:", localStorageError);
        }
        
        // Try to fetch from blockchain in the background
        console.log("Attempting to fetch blockchain rides...");
        const blockchainRides = await fetchRidesFromBlockchain();
        
        // If successful, use blockchain data
        if (blockchainRides && blockchainRides.length > 0) {
          console.log(`Loaded ${blockchainRides.length} rides from blockchain`);
          
          // Merge with local rides to keep locally added rides
          // Use a Map to avoid duplicates, preferring blockchain data
          const mergedRidesMap = new Map<string, Ride>();
          
          // Add local rides first
          localRides.forEach(ride => {
            mergedRidesMap.set(ride.id, ride);
          });
          
          // Then add blockchain rides (will override any duplicates)
          blockchainRides.forEach(ride => {
            mergedRidesMap.set(ride.id, ride);
          });
          
          // Convert back to array
          const mergedRides = Array.from(mergedRidesMap.values());
          
          // Update state with merged rides
          setRides(mergedRides);
          
          // Store merged rides in localStorage for offline access
          localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(mergedRides));
          
          // Filter rides by current search mode
          if (!searchPerformed) {
            const initialFilter = mergedRides.filter(ride => 
              currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
            );
            setFilteredRides(initialFilter);
          }
        } else {
          console.log("No rides found on blockchain or fetch failed. Using local storage data only.");
        }
      } catch (error) {
        console.error("Error loading rides:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRides();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(loadRides, 30000);
    return () => clearInterval(refreshInterval);
  }, [currentSearchMode, searchPerformed]);

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
    // Initialize filtered rides or update if rides change or mode changes
    if (!searchPerformed) {
      const modeFilteredRides = rides.filter(ride =>
        currentSearchMode === 'findOffers' ? ride.type === 'offer' : ride.type === 'request'
      );
      setFilteredRides(modeFilteredRides);
    }
  }, [rides, searchPerformed, currentSearchMode]); // Added missing dependencies

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
      // Use unknown for JSON parse result
      const storedMessagesRaw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
      const allStoredMessages: Record<string, Message[]> = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : {};
      setCurrentChatMessages(allStoredMessages[ride.id] || []);
    } catch (error) {
      console.error("Error loading chat messages from localStorage:", error);
      setCurrentChatMessages([]);
    }
  };

  const handleSendChatMessage = (event?: React.FormEvent) => {
    // Prevent any form submission that might cause page navigation
    if (event) {
      event.preventDefault();
    }
    
    if (!activeChatRide || !chatInputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: chatInputMessage,
      sender: 'user', // Mark as sent by the current user
      timestamp: Date.now(),
    };

    const updatedMessagesForRide = [...currentChatMessages, newMessage];
    setCurrentChatMessages(updatedMessagesForRide);

    try {
      // Use unknown for JSON parse result
      const storedMessagesRaw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
      const allStoredMessages: Record<string, Message[]> = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : {};
      allStoredMessages[activeChatRide.id] = updatedMessagesForRide;
      localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(allStoredMessages));
    } catch (error) {
      console.error("Error saving chat message to localStorage:", error);
    }

    console.log(`Message to driver ${activeChatRide.driver} for ride ${activeChatRide.id}: ${chatInputMessage}`);
    setChatInputMessage("");
    
    // For testing purposes, simulate a driver response after 1 second
    setTimeout(() => {
      const driverResponse: Message = {
        id: Date.now().toString(),
        text: "Thanks for your message! This is an automated response to test message positioning.",
        sender: 'driver', // Mark as from the driver
        timestamp: Date.now(),
      };
      
      // Add to local state
      setCurrentChatMessages(prevMessages => [...prevMessages, driverResponse]);
      
      // Add to storage
      try {
        const updatedStoredMessagesRaw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
        const updatedAllStoredMessages: Record<string, Message[]> = updatedStoredMessagesRaw 
          ? JSON.parse(updatedStoredMessagesRaw) 
          : {};
          
        if (updatedAllStoredMessages[activeChatRide.id]) {
          updatedAllStoredMessages[activeChatRide.id] = [
            ...updatedAllStoredMessages[activeChatRide.id], 
            driverResponse
          ];
        } else {
          updatedAllStoredMessages[activeChatRide.id] = [driverResponse];
        }
        
        localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(updatedAllStoredMessages));
      } catch (error) {
        console.error("Error saving driver response to localStorage:", error);
      }
    }, 1000);
  };

  // Add new function to handle payment locking
  const handlePaymentLocked = () => {
    setIsPaymentLocked(true);
    setShowPaymentLock(false);
    if (activeChatRide) {
      const updatedRides = rides.map(ride => 
        ride.id === activeChatRide.id 
          ? { ...ride, paymentStatus: 'locked' as const }
          : ride
      );
      setRides(updatedRides);
      localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
    }
  };

  const handlePaymentReleased = () => {
    setIsPaymentLocked(false);
    if (activeChatRide) {
      const updatedRides = rides.map(ride => 
        ride.id === activeChatRide.id 
          ? { ...ride, paymentStatus: 'released' as const }
          : ride
      );
      setRides(updatedRides);
      localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
    }
  };

  // Function to lock or release payment
  const handleLockOrReleasePayment = async (ride: Ride, action: 'lock' | 'release') => {
    if (!publicKey || !wallet) {
      setPaymentErrorRideId(ride.id);
      setPaymentErrorMessage("Wallet not connected. Please connect your wallet first.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentLoadingRideId(ride.id);
      setPaymentErrorRideId(null);
      setPaymentErrorMessage(null);
      setTxSignature(null);
      setTxRideId(null);
      
      console.log(`[Payment] Initiated ${action} for ride ${ride.id}`);
      console.log(`[Payment] Ride details: Price ${ride.price} SOL, Driver: ${ride.driver}`);
      
      // Initialize driver's public key
      let driverPubkey;
      try {
        driverPubkey = new PublicKey(ride.driver);
        console.log(`[Payment] Driver public key parsed: ${driverPubkey.toString()}`);
      } catch (err) {
        console.error("[Payment] Invalid driver public key:", err);
        setPaymentErrorRideId(ride.id);
        setPaymentErrorMessage("Invalid driver wallet address. Cannot process payment.");
        return;
      }
      
      // Price calculation - handle decimal values correctly
      const priceInRM = parseFloat(ride.price);
      
      // Convert from RM to SOL
      const priceInSOL = priceInRM * exchangeRate.rmToSol;
      const priceInLamports = Math.floor(priceInSOL * LAMPORTS_PER_SOL);
      
      console.log(`[Payment] Amount: ${priceInRM} RM = ${priceInSOL} SOL (${priceInLamports} lamports)`);
      console.log(`[Payment] Using conversion rate: 1 RM = ${exchangeRate.rmToSol} SOL`);
      
      if (isNaN(priceInLamports) || priceInLamports <= 0) {
        console.error("[Payment] Invalid price amount:", priceInRM, priceInSOL, priceInLamports);
        setPaymentErrorRideId(ride.id);
        setPaymentErrorMessage(`Invalid price amount: ${priceInRM} RM. Please contact support.`);
        return;
      }
      
      // Setup connection with proper configuration
      const latestBlockHash = await connection.getLatestBlockhash('confirmed');
      console.log("[Payment] Got latest blockhash");
      
      // Find PDAs for the ride account
      const truncatedRideId = ride.id.substring(0, 32);
      console.log(`[Payment] Truncated ride ID: ${truncatedRideId}`);
      
      let transaction;
      
      if (action === 'lock') {
        console.log(`[Payment] Creating payment lock transaction for ${priceInLamports} lamports`);
        
        // Simple transfer transaction
        transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: driverPubkey,
            lamports: priceInLamports,
          })
        );
      } else {
        // For 'release' action - not applicable in this simplified version
        console.log("[Payment] Release action not implemented in this version");
        setPaymentErrorRideId(ride.id);
        setPaymentErrorMessage("Release functionality is not implemented in this version.");
        return;
      }
      
      // Set transaction parameters
      transaction.recentBlockhash = latestBlockHash.blockhash;
      transaction.feePayer = publicKey;
      
      // Send the transaction with improved error handling for user rejection
      let signature;
      try {
        console.log("[Payment] Sending transaction...");
        signature = await sendTransaction(transaction, connection);
        console.log(`[Payment] Transaction sent with signature: ${signature}`);
      } catch (walletError) {
        // Handle user rejection of transaction without showing errors
        const errorMessage = walletError instanceof Error ? walletError.message.toLowerCase() : '';
        const errorName = walletError instanceof Error ? walletError.name : '';
        
        // Check for all possible rejection patterns
        if ((errorName.includes('WalletSendTransaction') || 
             errorName.includes('Wallet') || 
             errorName === 'Error') && 
            (errorMessage.includes('user rejected') || 
             errorMessage.includes('user cancelled') || 
             errorMessage.includes('cancelled by user') ||
             errorMessage.includes('rejected') ||
             errorMessage.includes('cancelled') ||
             errorMessage.includes('denied') ||
             errorMessage.includes('declined'))) {
          
          console.log("[Payment] Transaction was cancelled by user");
          setIsProcessingPayment(false);
          setPaymentLoadingRideId(null);
          return; // Exit early without showing any errors
        }
        
        // For other wallet errors, re-throw to be caught by the outer try-catch
        throw walletError;
      }
      
      // Wait for transaction confirmation
      console.log("[Payment] Confirming transaction...");
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      }, 'confirmed');
      
      console.log("[Payment] Transaction confirmed successfully!");
      
      // Set the transaction signature for display
      setTxSignature(signature);
      setTxRideId(ride.id);
      setTxAmount({
        rm: priceInRM,
        sol: priceInSOL
      });
      
      if (action === 'lock') {
        // Update ride in state with 'locked' payment status
        const updatedRide: Ride = { ...ride, paymentStatus: 'locked' };
        // Emit ride update via websocket
        emitRideUpdate(updatedRide);
        
        // Update the list of rides with the updated ride
        setRides(rides.map(r => (r.id === ride.id ? updatedRide : r)));
        
        // Update local storage
        const updatedRides = rides.map(r => (r.id === ride.id ? updatedRide : r));
        localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
        
        alert(`Payment of ${priceInRM} RM (${priceInSOL.toFixed(4)} SOL) sent successfully to ${ride.driver}!`);
      }
    } catch (error) {
      console.error(`[Payment] Error ${action === 'lock' ? 'sending' : 'releasing'} payment:`, error);
      
      // Second chance to catch user rejections that might have slipped through
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        const errorName = error.name;
        
        if ((errorName.includes('Wallet') || errorName === 'Error') &&
            (errorMsg.includes('reject') || 
             errorMsg.includes('cancel') || 
             errorMsg.includes('denied') || 
             errorMsg.includes('user'))) {
          console.log("[Payment] Caught transaction cancellation in fallback handler");
          return; // Exit without showing error
        }
      }
      
      // Handle other errors
      let errorMessage = "An unknown error occurred. Please try again.";
      
      if (error instanceof Error) {
        console.error("[Payment] Error name:", error.name);
        console.error("[Payment] Error message:", error.message);
        
        if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient SOL in your wallet. Please add funds and try again.";
        } else if (error.message.includes("expired")) {
          errorMessage = "Transaction expired. Please try again with a better network connection.";
        } else if (error.message.includes("blockhash")) {
          errorMessage = "Network error: Could not get a valid blockhash. Please check your internet connection.";
        } else if (error.message.includes("Invalid public key") || error.message.includes("not a valid public key")) {
          errorMessage = "Invalid wallet address format. Please contact support.";
        } else {
          errorMessage = `${error.name}: ${error.message}`;
        }
      }
      
      setPaymentErrorRideId(ride.id);
      setPaymentErrorMessage(errorMessage);
      alert(`Payment Failed: ${errorMessage}`);
    } finally {
      setIsProcessingPayment(false);
      setPaymentLoadingRideId(null);
    }
  };

  // Add function to navigate to profile with the ride ID
  const handleChatWithDriver = (ride: Ride) => {
    // Store the ride ID in local storage to open the correct chat in profile
    localStorage.setItem('openChatRideId', ride.id);
    // Navigate to profile page
    router.push('/profile');
  };

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
                    <Link href="/add-ride" className="text-blue-600 hover:underline">Offer a ride</Link> }
                  {currentSearchMode === 'findRequests' && 
                    <Link href="/add-ride" className="text-green-600 hover:underline">Request a ride</Link> }
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
                            Chat Now
                        </button>
                        <button 
                            onClick={() => handleChatWithDriver(ride)}
                            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
                            View in Profile
                        </button>
                        {ride.type === 'offer' && publicKey && (
                            <button
                              onClick={() => handleLockOrReleasePayment(ride, 'lock')}
                              disabled={paymentLoadingRideId === ride.id || ride.paymentStatus === 'released'}
                              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${ride.paymentStatus === 'locked' ? 'bg-green-600 hover:bg-green-700' : ride.paymentStatus === 'released' ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}
                                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out`}
                            >
                              {paymentLoadingRideId === ride.id
                                ? 'Processing...'
                                : ride.paymentStatus === 'locked'
                                  ? 'Release Payment'
                                  : ride.paymentStatus === 'released'
                                    ? 'Payment Complete'
                                    : 'Pay with SOL'}
                            </button>
                        )}
                    </div>
                  </div>
                  {/* Payment status feedback for this specific ride card */}
                  {paymentErrorRideId === ride.id && paymentErrorMessage && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400 break-all">
                      Payment Error: {paymentErrorMessage}
                    </div>
                  )}
                  {txRideId === ride.id && txSignature && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                      <p>Payment Successful!</p>
                      {txAmount && (
                        <p className="mb-1">
                          {txAmount.rm.toFixed(2)} RM = {txAmount.sol.toFixed(6)} SOL
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                            (Rate: 1 RM = {exchangeRate.rmToSol.toFixed(6)} SOL)
                          </span>
                        </p>
                      )}
                      <a
                        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-700 dark:hover:text-green-300"
                      >
                        View on Solana Explorer
                      </a>
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
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                          {msg.sender === 'user' ? 'You' : 'Driver'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center">
                <textarea 
                  value={chatInputMessage}
                  onChange={(e) => setChatInputMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChatMessage(e); } }}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-12 resize-none"
                />
                <button 
                  onClick={(e) => handleSendChatMessage(e)}
                  disabled={!chatInputMessage.trim()}
                  className="py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 flex items-center justify-center"
                >
                  Send
                </button>
              </div>

              {/* Payment Lock Component */}
              {!isPaymentLocked && !showPaymentLock && (
                <button
                  onClick={() => setShowPaymentLock(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
                >
                  Lock Payment
                </button>
              )}

              {showPaymentLock && (
                <div className="mb-4">
                  <PaymentLock
                    rideId={activeChatRide.id}
                    amount={parseFloat(activeChatRide.price)}
                    driverAddress={activeChatRide.driver}
                    onPaymentLocked={handlePaymentLocked}
                    onPaymentReleased={handlePaymentReleased}
                  />
                </div>
              )}

              {/* Exchange Rate Information */}
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>
                  Current Exchange Rate: 1 RM = {exchangeRate.rmToSol.toFixed(6)} SOL
                  {exchangeRate.lastUpdated && (
                    <span className="ml-1">
                      (Updated: {exchangeRate.lastUpdated.toLocaleTimeString()})
                    </span>
                  )}
                  <button 
                    onClick={fetchExchangeRates}
                    disabled={exchangeRate.isLoading}
                    className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {exchangeRate.isLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </p>
                {exchangeRate.isLoading && (
                  <p className="italic">Updating exchange rates...</p>
                )}
                {exchangeRate.error && (
                  <p className="text-orange-500 dark:text-orange-400">{exchangeRate.error}</p>
                )}
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