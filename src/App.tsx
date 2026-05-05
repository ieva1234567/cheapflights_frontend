import React, { useState } from 'react';
import './App.css';
import FlightSearchForm from './components/FlightSearchForm';
import FlightResults from './components/FlightResults';
import { searchFlights } from './api/endpoints';

interface FlightSearchData {
  origin_iata: string;
  destination_iata?: string;
  departure_date_from: string;
  departure_date_to: string;
  return_date_from?: string;
  return_date_to?: string;
  passengers: number;
}

function App() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchData: FlightSearchData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchFlights(searchData);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search flights. Please try again.');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>✈️ Cheap Flights Finder</h1>
        <p>Find the best deals on Ryanair flights</p>
      </header>
      
      <main>
        <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="error-message" style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        
        <FlightResults searchResults={searchResults} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
