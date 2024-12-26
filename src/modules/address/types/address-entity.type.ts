import { AddressType } from '../enums';

export class AddressEntity {
  id: string;
  user_id: string;
  country_code: string;
  type: AddressType;
  alias: string;
  complement: string;
  number: string;
  street: string;
  neighborhood: string;
  district: string;
  postalcode: string;
  city: string;
  updated_at: Date | string;
  created_at: Date | string;
}
