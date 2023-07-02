import { BookingInterface } from 'interfaces/booking';
import { RateInterface } from 'interfaces/rate';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface BikeInterface {
  id?: string;
  model: string;
  availability_status: boolean;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  booking?: BookingInterface[];
  rate?: RateInterface[];
  company?: CompanyInterface;
  _count?: {
    booking?: number;
    rate?: number;
  };
}

export interface BikeGetQueryInterface extends GetQueryInterface {
  id?: string;
  model?: string;
  company_id?: string;
}
