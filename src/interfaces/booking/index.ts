import { UserInterface } from 'interfaces/user';
import { BikeInterface } from 'interfaces/bike';
import { GetQueryInterface } from 'interfaces';

export interface BookingInterface {
  id?: string;
  start_date: any;
  end_date: any;
  user_id?: string;
  bike_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  bike?: BikeInterface;
  _count?: {};
}

export interface BookingGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  bike_id?: string;
}
