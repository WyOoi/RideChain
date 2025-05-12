'use client';

import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'; // For identifying the driver

// Data for states and universities (duplicated for now)
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
  driver: string; // Represents the user who created the entry (driver for 'offer', requester for 'request')
}

const RIDES_STORAGE_KEY = 'campusCarpoolRides';

export default function AddRidePage() {
  const { publicKey } = useWallet(); // Get publicKey to identify the driver
  const [currentMode, setCurrentMode] = useState<'offer' | 'request'>('offer');
  
  // In a real app, addRide would likely come from a global context or API call
  // For now, we'll manage a local list of rides on this page. 
  // This list will NOT be shared with the find-ride page without a global state solution.
  const [rides, setRides] = useState<Ride[]>([]); 

  // State for add ride form
  const [addRideOrigin, setAddRideOrigin] = useState("");
  const [addRideDestination, setAddRideDestination] = useState("");
  const [addRideState, setAddRideState] = useState("");
  const [addRideUniversitiesInState, setAddRideUniversitiesInState] = useState<{name: string, state: string}[]>([]);
  const [addRideUniversity, setAddRideUniversity] = useState("");
  const [addRideDate, setAddRideDate] = useState("");
  const [addRideTime, setAddRideTime] = useState("");
  const [addRidePrice, setAddRidePrice] = useState("");
  const [addRideSeats, setAddRideSeats] = useState("");
  const [addRideFormKey, setAddRideFormKey] = useState(Date.now());

  // Load rides from localStorage on component mount
  useEffect(() => {
    try {
      const storedRides = localStorage.getItem(RIDES_STORAGE_KEY);
      if (storedRides) {
        setRides(JSON.parse(storedRides));
      }
    } catch (error) {
      console.error("Error loading rides from localStorage:", error);
      // Optionally, clear corrupted data or handle error
      // localStorage.removeItem(RIDES_STORAGE_KEY); 
    }
  }, []);

  useEffect(() => {
    if (addRideState) {
      setAddRideUniversitiesInState(
        allUniversities.filter(uni => uni.state === addRideState)
      );
      setAddRideUniversity("");
    } else {
      setAddRideUniversitiesInState([]);
    }
  }, [addRideState]);

  const handleAddRideSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      alert(`Please connect your wallet to ${currentMode === 'offer' ? 'offer a ride' : 'request a ride'}.`);
      return;
    }
    const newRide: Ride = {
      id: Date.now().toString(),
      type: currentMode,
      origin: addRideOrigin,
      destination: addRideDestination,
      state: addRideState,
      university: addRideUniversity,
      date: addRideDate,
      time: addRideTime,
      price: addRidePrice,
      seats: addRideSeats, // For 'request', this means seats needed
      driver: publicKey.toBase58(), // Store the full public key
    };

    try {
      const currentStoredRides = JSON.parse(localStorage.getItem(RIDES_STORAGE_KEY) || '[]') as Ride[];
      const updatedRides = [...currentStoredRides, newRide];
      localStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(updatedRides));
      setRides(updatedRides); // Update local state to reflect the change
      alert(`${currentMode === 'offer' ? 'Ride offer' : 'Ride request'} added successfully and saved!`);
    } catch (error) {
      console.error("Error saving entry to localStorage:", error);
      alert('Failed to save entry. See console for details.');
      // Fallback to only local state if localStorage fails for some reason
      // setRides(prevRides => [...prevRides, newRide]);
      // alert('Ride added locally (failed to save to browser storage).');
      return; // Prevent form reset if save failed, or handle as needed
    }
    
    // Reset form fields
    setAddRideOrigin("");
    setAddRideDestination("");
    setAddRideState("");
    setAddRideUniversity("");
    setAddRideDate("");
    setAddRideTime("");
    setAddRidePrice("");
    setAddRideSeats("");
    setAddRideFormKey(Date.now()); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      <main className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
        <section id="add-ride" className="my-16 md:my-24 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-8 text-center">
            {currentMode === 'offer' ? 'Offer a Ride' : 'Request a Ride'}
          </h1>

          {/* Mode Toggle Buttons */}
          <div className="flex justify-center mb-8 space-x-2">
            <button 
              onClick={() => setCurrentMode('offer')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors 
                ${currentMode === 'offer' 
                  ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              I'm Driving (Offer Ride)
            </button>
            <button 
              onClick={() => setCurrentMode('request')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-colors 
                ${currentMode === 'request' 
                  ? 'bg-green-600 text-white shadow-md dark:bg-green-500' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
              I Need a Ride (Request)
            </button>
          </div>

          <form key={addRideFormKey} onSubmit={handleAddRideSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="add-origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                <input type="text" name="add-origin" id="add-origin" required className="input-field-page" placeholder="e.g., My Apartment Name" value={addRideOrigin} onChange={(e) => setAddRideOrigin(e.target.value)} />
              </div>
              <div>
                <label htmlFor="add-destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specific Destination</label>
                <input type="text" name="add-destination" id="add-destination" required className="input-field-page" placeholder="e.g., Main Library, Block C" value={addRideDestination} onChange={(e) => setAddRideDestination(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="add-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <select id="add-state" name="add-state" value={addRideState} onChange={(e) => setAddRideState(e.target.value)} required className="input-field-page">
                  <option value="">Select State</option>
                  {malaysianStates.map(state => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="add-university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University / Main Area</label>
                <select id="add-university" name="add-university" value={addRideUniversity} onChange={(e) => setAddRideUniversity(e.target.value)} disabled={!addRideState || addRideUniversitiesInState.length === 0} required className="input-field-page disabled:bg-gray-200 dark:disabled:bg-gray-700/50">
                  <option value="">{addRideState ? "Select University" : "Select state first"}</option>
                  {addRideUniversitiesInState.map(uni => (<option key={uni.name} value={uni.name}>{uni.name}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label htmlFor="add-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" name="add-date" id="add-date" required className="input-field-page" value={addRideDate} onChange={(e) => setAddRideDate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="add-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input type="time" name="add-time" id="add-time" required className="input-field-page" value={addRideTime} onChange={(e) => setAddRideTime(e.target.value)} />
              </div>
              <div>
                <label htmlFor="add-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {currentMode === 'offer' ? 'Price per Seat (RM)' : 'Willing to Pay (RM)'}
                </label>
                <input type="number" name="add-price" id="add-price" min="0" step="0.50" required className="input-field-page" placeholder="e.g., 5.00" value={addRidePrice} onChange={(e) => setAddRidePrice(e.target.value)} />
              </div>
            </div>
            
            <div className="mb-8">
                <label htmlFor="add-seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {currentMode === 'offer' ? 'Available Seats' : 'Seats Needed'}
                </label>
                <input type="number" name="add-seats" id="add-seats" min="1" max="10" required className="input-field-page" placeholder="e.g., 3" value={addRideSeats} onChange={(e) => setAddRideSeats(e.target.value)} />
            </div>

            <button type="submit" 
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${currentMode === 'offer' 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600'}
              ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!publicKey}
            >
              {publicKey ? (currentMode === 'offer' ? 'Add My Ride Offer' : 'Submit My Ride Request') : 'Connect Wallet to Proceed'}
            </button>
             {!publicKey && <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">Posting requires a connected wallet.</p>}
          </form>
        </section>
        {rides.length > 0 && (
            <section className="my-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">Your Postings (This Session)</h2>
                <div className="space-y-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                    {rides.map(ride => (
                        <div key={ride.id} className={`p-4 rounded-lg shadow-md ${ride.type === 'offer' ? 'bg-green-50 dark:bg-green-700/30' : 'bg-blue-50 dark:bg-blue-700/30'}`}>
                            <div className="flex justify-between items-start">
                                <h4 className={`text-lg font-semibold ${ride.type === 'offer' ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                    {ride.type === 'offer' ? 'Offering Ride' : ride.type === 'request' ? 'Requesting Ride' : 'Ride Posting'}
                                </h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ride.type === 'offer' ? 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100' : ride.type === 'request' ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                                    {ride.type ? ride.type.toUpperCase() : 'UNKNOWN'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">From: {ride.origin} To: {ride.destination} ({ride.university})</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date: {ride.date} at {ride.time} | Price: RM{ride.price} | Seats: {ride.seats}</p>
                        </div>
                    ))}
                </div>
            </section>
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
      `}</style>
    </div>
  );
} 