export class OrderItemEntity {
  id: string;
  product_id: string;
  order_id: string;
  price: number;
  quantity: number;
  subtotal_price: number;
  updated_at?: Date | string;
  created_at?: Date | string;
}
