import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MapPin } from 'lucide-react';
import { getAirports } from '../api/endpoints';

interface Airport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

interface AirportSelectProps {
  value: string;
  onChange: (iataCode: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

const AirportSelect: React.FC<AirportSelectProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select airport", 
  isDisabled = false 
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirports = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const airportData = await getAirports();
        console.log('Airports data received:', airportData);
        setAirports(airportData || []);
      } catch (err: any) {
        setError('Failed to load airports');
        console.error('Error fetching airports:', err);
        setAirports([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAirports();
  }, []);

  // Format airports for react-select
  const airportOptions = airports
    .filter(airport => airport && airport.iata_code && airport.name) // Filter out invalid data
    .map(airport => ({
      value: airport.iata_code,
      label: `${airport.iata_code} - ${airport.name}, ${airport.city || 'Unknown'}, ${airport.country || 'Unknown'}`,
      airport: airport
    }));

  // Debug: Log current state
  console.log('AirportSelect Debug:', {
    airportsCount: airports.length,
    airportOptionsCount: airportOptions.length,
    isLoading,
    error,
    firstAirport: airports[0],
    sampleOptions: airportOptions.slice(0, 3)
  });

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '48px',
      borderColor: '#e1e5e9',
      '&:hover': {
        borderColor: '#667eea',
      },
      '&:focus-within': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f0f4ff' : 'white',
      color: '#333',
      padding: '12px 16px',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#999',
    }),
    loadingIndicator: (provided: any) => ({
      ...provided,
      color: '#667eea',
    }),
  };

  // Filter function for search - simplified and more robust
  const filterOption = (option: any, inputValue: string) => {
    try {
      // Safety check - if option is undefined, return false
      if (!option) {
        return false;
      }
      
      // Use label for filtering since it includes all airport info
      const label = option.label || '';
      const searchLower = inputValue.toLowerCase();
      
      return label.toLowerCase().includes(searchLower);
    } catch (error) {
      console.error('FilterOption error:', error);
      return false;
    }
  };

  // Find current selected option
  const currentValue = airportOptions.find(option => option.value === value);

  return (
    <div className="airport-select" key="airport-select-v2">
      <label className="form-label">
        <MapPin size={16} />
        {placeholder}
      </label>
      <Select
        value={currentValue}
        onChange={(selectedOption) => {
          if (selectedOption) {
            onChange(selectedOption.value);
          } else {
            onChange('');
          }
        }}
        options={airportOptions}
        styles={customStyles}
        placeholder={isLoading ? "Loading airports..." : placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        isClearable
        isSearchable
        filterOption={filterOption}
        noOptionsMessage={({ inputValue }) => 
          inputValue.length > 0 
            ? "No airports found" 
            : "Type to search airports"
        }
      />
      {error && (
        <div className="error-text" style={{ 
          color: '#dc3545', 
          fontSize: '0.875rem', 
          marginTop: '4px' 
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AirportSelect;
