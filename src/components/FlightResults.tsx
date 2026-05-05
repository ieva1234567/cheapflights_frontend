import React from 'react';
import { Plane, Calendar, Clock, Euro, MapPin } from 'lucide-react';

interface Flight {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  flight_number: string;
}

interface FlightResultsProps {
  searchResults: {
    search_id: number;
    outbound_flights: Flight[];
    return_flights: Flight[];
    total_flights_found: number;
  } | null;
  isLoading: boolean;
}

const FlightResults: React.FC<FlightResultsProps> = ({ searchResults, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <Plane className="spinning" size={40} />
        </div>
        <p>Searching for flights...</p>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <div className="no-results">
        <Plane size={48} />
        <p>Enter your search criteria to find flights</p>
      </div>
    );
  }

  const { outbound_flights, return_flights, total_flights_found } = searchResults;

  if (total_flights_found === 0) {
    return (
      <div className="no-results">
        <Plane size={48} />
        <p>No flights found for your search criteria</p>
      </div>
    );
  }

  return (
    <div className="flight-results">
      <div className="results-header">
        <h3>Found {total_flights_found} flights</h3>
      </div>

      {outbound_flights.length > 0 && (
        <div className="flight-section">
          <h4>Outbound Flights</h4>
          <div className="flights-grid">
            {outbound_flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      )}

      {return_flights.length > 0 && (
        <div className="flight-section">
          <h4>Return Flights</h4>
          <div className="flights-grid">
            {return_flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <div className="flight-number">{flight.flight_number}</div>
        <div className="flight-price">
          <Euro size={16} />
          {flight.price}
        </div>
      </div>
      
      <div className="flight-route">
        <div className="airport">
          <MapPin size={14} />
          <span>{flight.origin}</span>
        </div>
        <div className="flight-arrow">
          <Plane size={16} />
        </div>
        <div className="airport">
          <MapPin size={14} />
          <span>{flight.destination}</span>
        </div>
      </div>
      
      <div className="flight-times">
        <div className="time-group">
          <Clock size={14} />
          <div>
            <div className="time">{flight.departure_time}</div>
            <div className="date">{flight.departure_date}</div>
          </div>
        </div>
        <div className="time-group">
          <Clock size={14} />
          <div>
            <div className="time">{flight.arrival_time}</div>
            <div className="date">{flight.departure_date}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
