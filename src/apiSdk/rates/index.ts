import axios from 'axios';
import queryString from 'query-string';
import { RateInterface, RateGetQueryInterface } from 'interfaces/rate';
import { GetQueryInterface } from '../../interfaces';

export const getRates = async (query?: RateGetQueryInterface) => {
  const response = await axios.get(`/api/rates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRate = async (rate: RateInterface) => {
  const response = await axios.post('/api/rates', rate);
  return response.data;
};

export const updateRateById = async (id: string, rate: RateInterface) => {
  const response = await axios.put(`/api/rates/${id}`, rate);
  return response.data;
};

export const getRateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRateById = async (id: string) => {
  const response = await axios.delete(`/api/rates/${id}`);
  return response.data;
};
