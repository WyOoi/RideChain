'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link'; // For potential future links to ride details
import Image from 'next/image'; // Import Next.js Image component
import OsmLocationAutocomplete from '@/components/OsmLocationAutocomplete';
import { calculateDistance, calculatePrice, formatPrice } from '@/utils/distance';

// Ride type should be consistent with other pages
interface Ride {
  id: string;
  type: 'offer' | 'request'; // Adding type field
  origin: string;
  destination: string;
  state: string;
  university: string;
  date: string;
  time: string;
  price: string;
  seats: string;
  driver: string; // This should match the format stored (e.g., shortened public key)
  transaction_id?: string; // Add transaction ID field
  status?: 'PaymentLocked' | 'Completed' | 'Disputed'; // Add status field
}

const RIDES_STORAGE_KEY = 'campusCarpoolRides';

// Data for states and universities (same as add-ride page)
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
  { name: "Multimedia University (MMU) - Melaka", state: "Malacca" },
  { name: "Universiti Sains Islam Malaysia (USIM)", state: "Negeri Sembilan" },
  { name: "INTI International University", state: "Negeri Sembilan" },
  { name: "KPJ Healthcare University", state: "Negeri Sembilan" },
  { name: "Nilai University", state: "Negeri Sembilan" },
  { name: "Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)", state: "Pahang" },
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
  { name: "University College of Technology Sarawak", state: "Sarawak" },
  { name: "Universiti Kebangsaan Malaysia (UKM)", state: "Selangor" },
  { name: "Universiti Putra Malaysia (UPM)", state: "Selangor" },
  { name: "Universiti Teknologi MARA (UiTM)", state: "Selangor" },
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
  { name: "Multimedia University (MMU) - Cyberjaya", state: "Selangor" },
  { name: "Open University Malaysia (OUM)", state: "Selangor" },
  { name: "SEGi University", state: "Selangor" },
  { name: "Selangor Islamic University (UIS)", state: "Selangor" },
  { name: "Universiti Tenaga Nasional (UNITEN)", state: "Selangor" },
  { name: "University of Cyberjaya (UoC)", state: "Selangor" },
  { name: "University of Nottingham Malaysia", state: "Selangor" },
  { name: "Universiti Selangor (UNISEL)", state: "Selangor" },
  { name: "Universiti Sultan Zainal Abidin (UniSZA)", state: "Terengganu" },
  { name: "Universiti Malaysia Terengganu (UMT)", state: "Terengganu" },
  { name: "UCSI University, Terengganu Campus", state: "Terengganu" },
  { name: "TATI University College", state: "Terengganu" },
];

// Add chat-related state and interfaces
interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string | null;  // Allow null for senderId
  senderName: string;
  message: string;
  timestamp: number;
}

// Use the same chat storage key as the find-ride page for compatibility
const CHAT_STORAGE_KEY = 'campusCarpoolChatMessages';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userOfferedRides, setUserOfferedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for editing rides
  const [editingRideId, setEditingRideId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Ride | null>(null);
  
  // New state for viewing ride details in modal
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add these additional states for edit form:
  const [editOriginCoordinates, setEditOriginCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [editDestinationCoordinates, setEditDestinationCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [editDistanceKm, setEditDistanceKm] = useState<number | null>(null);
  const [editUniversitiesInState, setEditUniversitiesInState] = useState<{name: string, state: string}[]>([]);

  // State for license UI Mockup
  const [licenseExpiryYear, setLicenseExpiryYear] = useState<string | null>(null);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [isProcessingLicense, setIsProcessingLicense] = useState(false);
  const [licenseFileName, setLicenseFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // For the file input

  // Add state for location validation
  const [isEditOriginValid, setIsEditOriginValid] = useState(false);
  const [isEditDestinationValid, setIsEditDestinationValid] = useState(false);

  // Add to the ProfilePage component state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const fullAddress = publicKey.toBase58();
      setUserAddress(fullAddress);
      
      try {
        const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
        if (storedRides) {
          const allRides = JSON.parse(storedRides) as Ride[];
          // Filter by the full public key
          const offeredByMe = allRides.filter(ride => ride.driver === fullAddress);
          setUserOfferedRides(offeredByMe);
          
          // Check if there's a ride ID to open in chat
          const openChatRideId = localStorage.getItem('openChatRideId');
          if (openChatRideId) {
            // First, check if it's one of the user's rides
            const myRideToOpen = offeredByMe.find(ride => ride.id === openChatRideId);
            
            if (myRideToOpen) {
              // Open the ride details modal with chat
              handleViewRideDetails(myRideToOpen);
            } else {
              // Try to find it among all rides (for passenger-driver chat)
              const externalRideToOpen = allRides.find(ride => ride.id === openChatRideId);
              if (externalRideToOpen) {
                // Create a temporary selection for the external ride
                setSelectedRide(externalRideToOpen);
                setIsModalOpen(true);
                // Load chat messages for this ride
                loadChatMessages(externalRideToOpen.id);
              }
            }
            // Clear the stored ride ID to prevent reopening on refresh
            localStorage.removeItem('openChatRideId');
          }
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

  // Function to handle edit button click
  const handleEditRide = (ride: Ride) => {
    setEditingRideId(ride.id);
    setEditFormData({ ...ride });
    
    // Set location validation to true initially since we're loading existing data
    setIsEditOriginValid(true);
    setIsEditDestinationValid(true);
    
    // Reset coordinates when starting edit
    setEditOriginCoordinates(null);
    setEditDestinationCoordinates(null);
    setEditDistanceKm(null);
    
    // Set universities for the selected state
    if (ride.state) {
      setEditUniversitiesInState(
        allUniversities.filter(uni => uni.state === ride.state)
      );
    } else {
      setEditUniversitiesInState([]);
    }
  };

  // Function to handle origin coordinates change
  const handleEditOriginCoordinatesChange = (lat: number, lon: number) => {
    console.log("Origin coordinates updated:", lat, lon);
    setEditOriginCoordinates({ lat, lon });
    
    // When coordinates change, trigger location-based state detection
    if (editFormData && editFormData.origin) {
      detectAndUpdateState(editFormData.origin);
    }
  };

  // Add a helper function to detect and update state from location
  const detectAndUpdateState = (location: string) => {
    for (const state of malaysianStates) {
      // Check if the location string contains the state name
      if (location.includes(state)) {
        console.log("Detected state from location:", state);
        
        // Update the form data with the detected state
        setEditFormData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            state: state
          };
        });
        
        // Update universities for this state
        setEditUniversitiesInState(
          allUniversities.filter(uni => uni.state === state)
        );
        
        return; // Exit after finding the first match
      }
    }
  };

  // Function to handle origin text changes - improved state detection
  const handleEditOriginChange = (value: string) => {
    // Update the origin value in the form data
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        origin: value
      });
    }
    
    // Try to detect and update state from the new location text
    detectAndUpdateState(value);
  };

  // Function to handle destination coordinates change
  const handleEditDestinationChange = (value: string) => {
    // Update the destination value in the form data
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        destination: value
      });
    }
  };

  // Function to handle destination coordinates change
  const handleEditDestinationCoordinatesChange = (lat: number, lon: number) => {
    console.log("Destination coordinates updated:", lat, lon);
    setEditDestinationCoordinates({ lat, lon });
  };

  // Add a function to manually recalculate price
  const recalculatePrice = () => {
    if (editOriginCoordinates && editDestinationCoordinates) {
      const distance = calculateDistance(
        editOriginCoordinates.lat, 
        editOriginCoordinates.lon, 
        editDestinationCoordinates.lat, 
        editDestinationCoordinates.lon
      );
      
      console.log("Manually recalculated distance:", distance);
      setEditDistanceKm(distance);
      
      // Calculate and update price with new rates
      const basePrice = 4.00; // RM4.00 for first 5 km
      const baseDistance = 5; // 5 km base distance
      const perKmRate = 1.00; // RM1.00 per km after base distance
      
      let price = basePrice;
      if (distance > baseDistance) {
        price += (distance - baseDistance) * perKmRate;
      }
      
      console.log("Manually recalculated price:", price);
      
      if (editFormData) {
        setEditFormData({
          ...editFormData,
          price: formatPrice(price)
        });
      }
    } else {
      alert("Please select valid locations with coordinates to calculate price");
    }
  };

  // Modify the useEffect to be more robust
  useEffect(() => {
    console.log("Coordinates changed:", { 
      origin: editOriginCoordinates, 
      destination: editDestinationCoordinates 
    });
    
    if (editOriginCoordinates && editDestinationCoordinates && editFormData) {
      // Use a timeout to ensure state updates have propagated
      const timer = setTimeout(() => {
        const distance = calculateDistance(
          editOriginCoordinates.lat, 
          editOriginCoordinates.lon, 
          editDestinationCoordinates.lat, 
          editDestinationCoordinates.lon
        );
        
        console.log("Calculated distance:", distance);
        setEditDistanceKm(distance);
        
        // Calculate and update price with new rates
        const basePrice = 4.00; // RM4.00 for first 5 km
        const baseDistance = 5; // 5 km base distance
        const perKmRate = 1.00; // RM1.00 per km after base distance
        
        let price = basePrice;
        if (distance > baseDistance) {
          price += (distance - baseDistance) * perKmRate;
        }
        
        console.log("Calculated price:", price);
        
        setEditFormData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            price: formatPrice(price)
          };
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [editOriginCoordinates, editDestinationCoordinates, editFormData]);

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingRideId(null);
    setEditFormData(null);
    setEditOriginCoordinates(null);
    setEditDestinationCoordinates(null);
    setEditDistanceKm(null);
    setEditUniversitiesInState([]);
  };

  // Function to handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  // Update state when changing in dropdown (still need this for direct state selection)
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        state: state,
        // Reset university when state changes
        university: ""
      });
      
      // Update universities for this state
      setEditUniversitiesInState(
        allUniversities.filter(uni => uni.state === state)
      );
    }
  };

  // Function to save edited ride
  const handleSaveRide = () => {
    if (!editFormData) return;
    
    // Validate locations before saving
    if (!isEditOriginValid || !isEditDestinationValid) {
      alert('Please select valid locations from the suggestions before saving.');
      return;
    }
    
    try {
      const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
      if (storedRides) {
        const allRides = JSON.parse(storedRides) as Ride[];
        const updatedRides = allRides.map(ride => 
          ride.id === editFormData.id ? editFormData : ride
        );
        localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
        
        // Update local state
        setUserOfferedRides(userOfferedRides.map(ride => 
          ride.id === editFormData.id ? editFormData : ride
        ));
        
        // Exit edit mode
        setEditingRideId(null);
        setEditFormData(null);
      }
    } catch (error) {
      console.error("Error saving edited ride:", error);
      alert("Failed to save ride changes. Please try again.");
    }
  };

  // Function to delete a ride
  const handleDeleteRide = (rideId: string) => {
    if (window.confirm('Are you sure you want to delete this ride offer?')) {
      try {
        const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
        if (storedRides) {
          const allRides = JSON.parse(storedRides) as Ride[];
          const updatedRides = allRides.filter(ride => ride.id !== rideId);
          localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
          
          // Update local state
          setUserOfferedRides(prevRides => prevRides.filter(ride => ride.id !== rideId));
        }
      } catch (error) {
        console.error("Error deleting ride:", error);
        alert("Failed to delete ride. Please try again.");
      }
    }
  };

  // Function to load chat messages
  const loadChatMessages = (rideId: string) => {
    try {
      const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!storedChats) {
        setChatMessages([]);
        return;
      }

      const parsedChats = JSON.parse(storedChats);
      
      // Handle different data structures
      if (typeof parsedChats === 'object' && !Array.isArray(parsedChats)) {
        // New format (from find-ride page)
        if (parsedChats[rideId] && Array.isArray(parsedChats[rideId])) {
          const chatMessages = parsedChats[rideId].map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            rideId: rideId,
            senderId: msg.sender === 'user' ? userAddress : 'driver',
            senderName: msg.sender === 'user' ? `User ${userAddress?.substring(0, 4)}` : 'Driver',
            message: msg.text || '',
            timestamp: msg.timestamp || Date.now()
          }));
          setChatMessages(chatMessages);
        } else {
          setChatMessages([]);
        }
      } else if (Array.isArray(parsedChats)) {
        // Old format (from profile page)
        const rideChats = parsedChats.filter((chat: ChatMessage) => chat.rideId === rideId);
        setChatMessages(rideChats);
      } else {
        // Invalid format
        console.warn('Invalid chat data structure in localStorage');
        setChatMessages([]);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      setChatMessages([]);
    }
  };

  // Function to handle sending a chat message
  const handleSendMessage = (rideId: string) => {
    if (!newMessage.trim() || !publicKey) return;

    setIsSendingMessage(true);
    
    try {
      // Create new message object
      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        rideId,
        senderId: publicKey.toBase58(),
        senderName: `User ${publicKey.toBase58().substring(0, 4)}`,
        message: newMessage.trim(),
        timestamp: Date.now()
      };
      
      // Get existing messages from storage
      const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
      
      // Check the structure of stored chats
      if (storedChats) {
        const parsedStoredChats = JSON.parse(storedChats);
        
        // If it's a record format from find-ride page
        if (typeof parsedStoredChats === 'object' && !Array.isArray(parsedStoredChats)) {
          // Add our message in the compatible format for find-ride page
          const findRideCompatibleMsg = {
            id: newChatMessage.id,
            text: newChatMessage.message,
            sender: 'user',
            timestamp: newChatMessage.timestamp
          };
          
          // Update the record structure
          const updatedChats = { ...parsedStoredChats };
          updatedChats[rideId] = [...(updatedChats[rideId] || []), findRideCompatibleMsg];
          
          // Save to storage
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
        } else {
          // Traditional array format from profile page
          const allChats = Array.isArray(parsedStoredChats) ? parsedStoredChats : [];
          const updatedChats = [...allChats, newChatMessage];
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
        }
      } else {
        // No existing chats, create new structure compatible with find-ride
        const newChatStructure = {
          [rideId]: [{
            id: newChatMessage.id,
            text: newChatMessage.message,
            sender: 'user',
            timestamp: newChatMessage.timestamp
          }]
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newChatStructure));
      }
      
      // Update state
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage('');
      
      // For testing purposes, simulate a driver response after 1 second
      if (selectedRide && selectedRide.driver !== publicKey.toBase58()) {
        setTimeout(() => {
          const driverResponse: ChatMessage = {
            id: Date.now().toString(),
            rideId,
            senderId: selectedRide.driver,
            senderName: `Driver ${selectedRide.driver.substring(0, 4)}`,
            message: "Thanks for your message! This is an automated response to test message positioning.",
            timestamp: Date.now()
          };
          
          // Add to local state
          setChatMessages(prevMessages => [...prevMessages, driverResponse]);
          
          // Add to storage
          try {
            const latestStoredChats = localStorage.getItem(CHAT_STORAGE_KEY);
            if (latestStoredChats) {
              const latestParsedChats = JSON.parse(latestStoredChats);
              
              if (typeof latestParsedChats === 'object' && !Array.isArray(latestParsedChats)) {
                // Find-ride format
                const driverResponseCompatible = {
                  id: driverResponse.id,
                  text: driverResponse.message,
                  sender: 'driver',
                  timestamp: driverResponse.timestamp
                };
                
                const updatedChats = { ...latestParsedChats };
                if (Array.isArray(updatedChats[rideId])) {
                  updatedChats[rideId] = [...updatedChats[rideId], driverResponseCompatible];
                } else {
                  updatedChats[rideId] = [driverResponseCompatible];
                }
                
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
              } else {
                // Profile page format
                const allChats = Array.isArray(latestParsedChats) ? latestParsedChats : [];
                const updatedChats = [...allChats, driverResponse];
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
              }
            }
          } catch (error) {
            console.error("Error saving driver response:", error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Function to handle opening the modal with ride details
  const handleViewRideDetails = (ride: Ride) => {
    setSelectedRide(ride);
    setIsModalOpen(true);
    // Load chat messages for this ride
    loadChatMessages(ride.id);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRide(null);
  };

  // Function to handle edit from the modal
  const handleEditFromModal = () => {
    if (selectedRide) {
      handleEditRide(selectedRide);
      handleCloseModal();
    }
  };

  // Function to handle delete from the modal with confirmation
  const handleDeleteFromModal = () => {
    if (selectedRide) {
      // Confirm deletion first
      if (window.confirm("Are you sure you want to delete this ride?")) {
        // Close modal first to prevent UI issues
        const rideId = selectedRide.id;
        handleCloseModal();
        // Then delete with a slight delay to ensure modal is closed
        setTimeout(() => {
          handleDeleteRide(rideId);
        }, 100);
      }
    }
  };

  // Format chat timestamp
  const formatChatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + 
      ' ' + date.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  // Add this helper function after the formatChatTime function
  const getSolanaExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
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
                     <p><span className="font-medium">Expiry Year:</span> {licenseExpiryYear}</p>
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
                                Upload License
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
                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Upload an image to verify your license.</p>
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
                    <a className="ml-1 text-blue-600 hover:underline">Offer a ride now!</a>
                  </Link>
                </p>
              ) : (
                <div className="space-y-6">
                  {userOfferedRides.map(ride => (
                    <div 
                      key={ride.id} 
                      className="bg-white dark:bg-gray-700/70 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      {editingRideId === ride.id ? (
                        // Edit Form
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Edit Ride</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <OsmLocationAutocomplete
                                label="Origin"
                                name="origin"
                                id="edit-origin"
                                value={editFormData?.origin || ''}
                                onChange={handleEditOriginChange}
                                onValidityChange={setIsEditOriginValid}
                                onCoordinatesChange={handleEditOriginCoordinatesChange}
                                required
                                placeholder="Search for pickup location"
                              />
                            </div>
                            <div>
                              <OsmLocationAutocomplete
                                label="Destination"
                                name="destination"
                                id="edit-destination"
                                value={editFormData?.destination || ''}
                                onChange={handleEditDestinationChange}
                                onValidityChange={setIsEditDestinationValid}
                                onCoordinatesChange={handleEditDestinationCoordinatesChange}
                                required
                                placeholder="Search for drop-off location"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                State (Auto-detected)
                              </label>
                              <select
                                name="state"
                                value={editFormData?.state || ''}
                                onChange={handleStateChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                                disabled={true}
                                required
                              >
                                <option value="">Select Origin to Auto-detect</option>
                                {malaysianStates.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-500 mt-1">State is automatically detected from origin</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                University / Main Area
                              </label>
                              <select
                                name="university"
                                value={editFormData?.university || ''}
                                onChange={(e) => setEditFormData(prev => prev ? { ...prev, university: e.target.value } : null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                                disabled={!editFormData?.state || editUniversitiesInState.length === 0}
                                required
                              >
                                <option value="">{editFormData?.state ? "Select University" : "Select origin first"}</option>
                                {editUniversitiesInState.map(uni => (
                                  <option key={uni.name} value={uni.name}>{uni.name}</option>
                                ))}
                              </select>
                            </div>
                            
                            {editDistanceKm !== null && (
                              <div className="col-span-2 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  <span className="font-medium">Estimated Distance:</span> {editDistanceKm.toFixed(1)} km
                                </p>
                                {editFormData?.price && (
                                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    Auto-calculated price: RM {editFormData.price} (RM 4.00 base for 5km + RM 1.00/km)
                                  </p>
                                )}
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                name="date"
                                value={editFormData?.date || ''}
                                onChange={handleEditFormChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Time
                              </label>
                              <input
                                type="time"
                                name="time"
                                value={editFormData?.time || ''}
                                onChange={handleEditFormChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price (RM) <span className="text-xs text-gray-500">(Auto-calculated)</span>
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  name="price"
                                  value={editFormData?.price || ''}
                                  readOnly
                                  disabled
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={recalculatePrice}
                                  className="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  title="Recalculate price from coordinates"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                  </svg>
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Price is automatically calculated based on distance</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Seats
                              </label>
                              <input
                                type="number"
                                name="seats"
                                value={editFormData?.seats || ''}
                                onChange={handleEditFormChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                min="1"
                                max="10"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveRide}
                              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isEditOriginValid && isEditDestinationValid
                                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                                  : 'bg-blue-400 cursor-not-allowed'
                              }`}
                              disabled={!isEditOriginValid || !isEditDestinationValid}
                            >
                              {!isEditOriginValid || !isEditDestinationValid
                                ? 'Please Use Valid Locations'
                                : 'Save Changes'}
                            </button>
                          </div>
                          {(!isEditOriginValid || !isEditDestinationValid) && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                              Both locations must be valid to save changes.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                                  From: {ride.origin}
                                </h4>
                              </div>
                              <div className="flex items-center mt-2">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <h4 className="text-lg font-semibold text-green-700 dark:text-green-400">
                                  To: {ride.destination}
                                </h4>
                              </div>
                              <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {ride.date} at {ride.time}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleViewRideDetails(ride)}
                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors duration-150"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditRide(ride)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRide(ride.id)}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-150"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Ride Details Modal */}
        {isModalOpen && selectedRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedRide.driver === userAddress ? 'Ride Details' : 'Chat with Driver'}
                  </h3>
                  <button 
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-150"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg border border-blue-100 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 text-lg">Route Information</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">From:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{selectedRide.origin}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">To:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.destination}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">State:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.state}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">University:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.university}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-lg border border-green-100 dark:border-green-800">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 text-lg">Ride Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Date:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.date}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Time:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.time}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Price:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">RM{parseFloat(selectedRide.price).toFixed(2)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Seats:</span>
                        <span className="text-gray-800 dark:text-gray-200">{selectedRide.seats}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-lg border border-gray-100 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-lg">Additional Information</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Ride Type:</span>
                        <span className="text-gray-800 dark:text-gray-200 capitalize">{selectedRide.type || 'Offer'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Ride ID:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-mono text-sm">{selectedRide.id}</span>
                      </div>
                      {selectedRide.transaction_id && (
                        <div className="flex flex-col">
                          <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Transaction ID:</span>
                          <a 
                            href={getSolanaExplorerUrl(selectedRide.transaction_id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-mono text-sm break-all mt-1 flex items-center"
                          >
                            <span className="truncate">{selectedRide.transaction_id}</span>
                            <svg 
                              className="w-4 h-4 ml-1" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                      {selectedRide.status && (
                        <div className="flex">
                          <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Payment Status:</span>
                          <span className={`font-medium ${
                            selectedRide.status === 'PaymentLocked' 
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : selectedRide.status === 'Completed'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {selectedRide.status}
                          </span>
                        </div>
                      )}
                      {selectedRide.driver !== userAddress && (
                        <div className="flex">
                          <span className="font-medium w-28 text-gray-700 dark:text-gray-300">Driver:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-mono text-sm">{selectedRide.driver}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Only show edit/delete buttons for the user's own rides */}
                {selectedRide.driver === userAddress && (
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={handleEditFromModal}
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      Edit Ride
                    </button>
                    <button
                      onClick={handleDeleteFromModal}
                      className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-150"
                    >
                      Delete Ride
                    </button>
                  </div>
                )}

                {/* Chat Section */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">Chat with {selectedRide.type === 'offer' ? (selectedRide.driver === userAddress ? 'Passengers' : 'Driver') : 'Requester'}</h4>
                  
                  {/* Messages Container */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-64 overflow-y-auto mb-4 p-4">
                    {chatMessages.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {chatMessages.map(msg => {
                          // Determine if the message was sent by the current user
                          const isCurrentUser = msg.senderId === userAddress;
                          
                          return (
                            <div 
                              key={msg.id} 
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                  isCurrentUser 
                                    ? 'bg-blue-500 text-white rounded-br-none' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-75 mt-1">{formatChatTime(msg.timestamp)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isSendingMessage) {
                          handleSendMessage(selectedRide.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleSendMessage(selectedRide.id)}
                      disabled={isSendingMessage || !newMessage.trim()}
                      className={`px-4 py-2 rounded-md font-medium ${
                        isSendingMessage || !newMessage.trim()
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      }`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}