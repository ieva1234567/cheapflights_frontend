import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';

// Flight search endpoints
export const searchFlights = async (searchData: {
  origin_iata: string;
  destination_iata?: string;
  departure_date_from: string;
  departure_date_to: string;
  return_date_from?: string;
  return_date_to?: string;
  passengers: number;
}) => {
  const response = await axios.post(`${BASE_URL}search/ryanair/`, searchData);
  return response.data;
};

export const getCheapestFlights = async (origin?: string, destination?: string) => {
  const params = new URLSearchParams();
  if (origin) params.append('origin', origin);
  if (destination) params.append('destination', destination);
  
  const response = await axios.get(`${BASE_URL}flights/cheapest/?${params.toString()}`);
  return response.data;
};

export const getAirports = async () => {
  try {
    console.log('Making request to:', `${BASE_URL}airports/`);
    const response = await axios.get(`${BASE_URL}airports/`);
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
    console.log('Raw airports response (first 2 items):', Array.isArray(response.data) ? response.data.slice(0, 2) : response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error - getAirports:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    throw error;
  }
};
