import axios from 'axios';
import queryString from 'query-string';
import { BikeInterface, BikeGetQueryInterface } from 'interfaces/bike';
import { GetQueryInterface } from '../../interfaces';

export const getBikes = async (query?: BikeGetQueryInterface) => {
  const response = await axios.get(`/api/bikes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBike = async (bike: BikeInterface) => {
  const response = await axios.post('/api/bikes', bike);
  return response.data;
};

export const updateBikeById = async (id: string, bike: BikeInterface) => {
  const response = await axios.put(`/api/bikes/${id}`, bike);
  return response.data;
};

export const getBikeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bikes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBikeById = async (id: string) => {
  const response = await axios.delete(`/api/bikes/${id}`);
  return response.data;
};
