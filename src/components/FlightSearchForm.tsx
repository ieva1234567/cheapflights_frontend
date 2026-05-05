import React, { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import AirportSelect from './AirportSelect';

interface FlightSearchData {
  origin_iata: string;
  destination_iata: string;
  departure_date_from: string;
  departure_date_to: string;
  return_date_from: string;
  return_date_to: string;
  passengers: number;
}

interface FlightSearchFormProps {
  onSearch: (searchData: FlightSearchData) => void;
  isLoading: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchData, setSearchData] = useState<FlightSearchData>({
    origin_iata: '',
    destination_iata: '',
    departure_date_from: '',
    departure_date_to: '',
    return_date_from: '',
    return_date_to: '',
    passengers: 1,
  });

  const [isOneWay, setIsOneWay] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: name === 'passengers' ? parseInt(value) || 1 : value,
    }));
  };

  const handleAirportChange = (field: 'origin_iata' | 'destination_iata', value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = { ...searchData };
    if (isOneWay) {
      dataToSubmit.return_date_from = '';
      dataToSubmit.return_date_to = '';
    }
    
    onSearch(dataToSubmit);
  };

  return (
    <div className="flight-search-form">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          <AirportSelect
            value={searchData.origin_iata}
            onChange={(value) => handleAirportChange('origin_iata', value)}
            placeholder="Origin Airport"
            isDisabled={isLoading}
          />

          <AirportSelect
            value={searchData.destination_iata}
            onChange={(value) => handleAirportChange('destination_iata', value)}
            placeholder="Destination Airport"
            isDisabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departure_date_from">
              <Calendar size={16} />
              Departure From
            </label>
            <input
              type="date"
              id="departure_date_from"
              name="departure_date_from"
              value={searchData.departure_date_from}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="departure_date_to">
              <Calendar size={16} />
              Departure To
            </label>
            <input
              type="date"
              id="departure_date_to"
              name="departure_date_to"
              value={searchData.departure_date_to}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isOneWay}
                onChange={(e) => setIsOneWay(e.target.checked)}
              />
              One Way Flight
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="passengers">
              <Users size={16} />
              Passengers
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              value={searchData.passengers}
              onChange={handleInputChange}
              min="1"
              max="10"
            />
          </div>
        </div>

        {!isOneWay && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="return_date_from">
                <Calendar size={16} />
                Return From
              </label>
              <input
                type="date"
                id="return_date_from"
                name="return_date_from"
                value={searchData.return_date_from}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="return_date_to">
                <Calendar size={16} />
                Return To
              </label>
              <input
                type="date"
                id="return_date_to"
                name="return_date_to"
                value={searchData.return_date_to}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="search-button">
          <Search size={20} />
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;
