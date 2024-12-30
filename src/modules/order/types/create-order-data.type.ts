import { OrderStatus } from '../enums';

export class CreateOrderData {
  customer_id: string;
  seller_id: string;
  delivery_address_id: string;
  status: OrderStatus;
  total_price: number;
}
