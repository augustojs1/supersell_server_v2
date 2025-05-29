import { AddressType } from '@/modules/address/enums';
import { ProductItem } from '@/modules/shopping_carts/types';

export class OrderReceiptEventPayload {
  user: {
    first_name: string;
    email: string;
  };
  order_id: string;
  order_items: ProductItem[];
  order_total_price: number;
  order_created_at: string | Date;
  delivery_address: {
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
  };
}
