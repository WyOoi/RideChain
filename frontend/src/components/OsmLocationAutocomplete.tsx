import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the interface for the component props
interface OsmLocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (lat: number, lon: number) => void;
  onValidityChange?: (isValid: boolean) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

// Nominatim API endpoint
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';

interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const OsmLocationAutocomplete: React.FC<OsmLocationAutocompleteProps> = ({
  value,
  onChange,
  onCoordinatesChange,
  onValidityChange,
  placeholder = 'Enter a location',
  label,
  required = false,
  name,
  id,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationTouched, setIsLocationTouched] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValidLocation(false); // Invalid if query is too short
      if (onValidityChange) onValidityChange(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        countrycodes: 'my', // Restrict to Malaysia
        limit: '8',
        addressdetails: '1',
      });
      
      // IMPORTANT: Add headers per Nominatim usage policy
      const response = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
        headers: {
          'User-Agent': 'RideChain/1.0 (contact: your-email@example.com)', // Replace with your actual contact info
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim API request failed: ${response.statusText}`);
      }

      const data: NominatimSuggestion[] = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(data && data.length > 0);
      
      // Check if the current input exactly matches a suggestion
      const exactMatch = data.some(
        suggestion => suggestion.display_name.toLowerCase() === query.toLowerCase()
      );
      setIsValidLocation(exactMatch);
      if (onValidityChange) onValidityChange(exactMatch);

    } catch (error) {
      console.error("Error fetching Nominatim suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValidLocation(false);
      if (onValidityChange) onValidityChange(false);
    } finally {
      setIsLoading(false);
    }
  }, [onValidityChange]);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsLocationTouched(true);
    setIsValidLocation(false); // Assume invalid while typing
    if (onValidityChange) onValidityChange(false);

    // Clear previous debounce timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new debounce timer
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 500); // 500ms debounce
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: NominatimSuggestion) => {
    const displayName = suggestion.display_name;
    setInputValue(displayName);
    onChange(displayName);
    setShowSuggestions(false);
    setSuggestions([]); // Clear suggestions after selection
    setIsValidLocation(true);
    if (onValidityChange) onValidityChange(true);
    
    // Pass coordinates to parent component
    if (onCoordinatesChange) {
      onCoordinatesChange(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    }
  };

  // Validate location on blur
  const handleBlur = () => {
    // Give time for click on suggestion to register
    setTimeout(() => setShowSuggestions(false), 200);
    
    setIsLocationTouched(true);

    // If there was an exact match suggestion already selected, it's valid
    const alreadyValid = suggestions.some(
      s => s.display_name.toLowerCase() === inputValue.toLowerCase()
    );
    if (alreadyValid) {
        setIsValidLocation(true);
        if (onValidityChange) onValidityChange(true);
    } else {
        // Re-validate if the input doesn't exactly match a suggestion
        // This could involve another API call or stricter logic
        // For now, if it wasn't selected, mark as potentially invalid
        setIsValidLocation(false);
        if (onValidityChange) onValidityChange(false);
    }
    
    // Update parent with current value regardless of blur validation
    onChange(inputValue);
  };

  // Update the input value when the value prop changes from parent
  useEffect(() => {
    setInputValue(value);
    // Optionally, validate the initial value when component loads or value changes
    // You might want to trigger fetchSuggestions or a specific validation call here
    // For simplicity, we assume initial value might be valid or user needs to touch it
    // Consider if initial validation is needed for your use case
  }, [value]);
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => {
          // Show suggestions on focus if input is long enough
          if (inputValue.length >= 3 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border ${
          isLocationTouched && !isValidLocation && inputValue.trim() !== ''
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
        } rounded-md shadow-sm focus:outline-none dark:bg-gray-800 dark:text-gray-100 ${className}`}
        autoComplete="off" // Prevent browser autocomplete
      />
      
      {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
      
      {isLocationTouched && !isValidLocation && inputValue.trim().length >= 3 && !isLoading && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Please select a valid location from the suggestions.
        </p>
      )}
    </div>
  );
};

export default OsmLocationAutocomplete; 