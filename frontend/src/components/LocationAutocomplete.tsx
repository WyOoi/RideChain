import React, { useState, useEffect, useRef } from 'react';

// Add type definitions for Google Maps API
declare global {
  interface Window {
    google?: {
      maps?: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: {
                input: string;
                componentRestrictions?: { country: string };
              },
              callback: (
                predictions: Array<{ description: string }> | null,
                status: string
              ) => void
            ) => void;
          };
          PlacesService: new (div: HTMLElement) => {
            getDetails: (request: any, callback: (result: any, status: string) => void) => void;
          };
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}

// Define the interface for the component props
interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Enter a location',
  label,
  required = false,
  name,
  id,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Load Google Maps JavaScript API
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google?.maps?.places) {
      setAutocompleteInitialized(true);
      return;
    }

    // Get API key from environment variable or use a placeholder
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    
    // If no API key and not in development, just use the regular input
    if (!apiKey && process.env.NODE_ENV !== 'development') {
      console.warn('Google Maps API key is missing. Autocomplete will not work.');
      return;
    }

    // Create script element for Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setAutocompleteInitialized(true);
    };
    
    script.onerror = () => {
      console.error('Error loading Google Maps API');
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up script tag if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize autocomplete when the API is loaded and input is available
  useEffect(() => {
    if (!autocompleteInitialized || !inputRef.current || !window.google?.maps?.places) return;

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    // Setup input event handling
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      if (value.length > 2) {
        autocompleteService.getPlacePredictions(
          { input: value, componentRestrictions: { country: 'my' } }, // Restrict to Malaysia
          (predictions, status) => {
            if (status === window.google?.maps?.places.PlacesServiceStatus.OK && predictions) {
              const places = predictions.map(prediction => prediction.description);
              setSuggestions(places);
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        );
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Configure the input
    const input = inputRef.current;
    input.addEventListener('input', handleInputChange as any);
    
    return () => {
      input.removeEventListener('input', handleInputChange as any);
    };
  }, [autocompleteInitialized]);

  // Update parent component when a suggestion is selected
  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  // Update the input value when the value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          // Delay hiding suggestions to allow click event
          setTimeout(() => setShowSuggestions(false), 200);
          
          // Update parent with current value
          onChange(inputValue);
        }}
        onFocus={() => inputValue.length > 2 && setShowSuggestions(true)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${className}`}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete; 