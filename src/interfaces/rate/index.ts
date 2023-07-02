import { BikeInterface } from 'interfaces/bike';
import { GetQueryInterface } from 'interfaces';

export interface RateInterface {
  id?: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  bike_id?: string;
  created_at?: any;
  updated_at?: any;

  bike?: BikeInterface;
  _count?: {};
}

export interface RateGetQueryInterface extends GetQueryInterface {
  id?: string;
  bike_id?: string;
}
