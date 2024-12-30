import { OrderStatus } from '../enums';

export class OrderEntity {
  id: string;
  customer_id: string;
  seller_id: string;
  delivery_address_id: string;
  status: OrderStatus;
  total_price: number;
  updated_at: Date | string;
  created_at: Date | string;
}
