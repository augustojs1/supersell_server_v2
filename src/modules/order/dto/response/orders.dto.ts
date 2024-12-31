class OrderProduct {
  name: string;
  price: number;
  quantity: number;
  description: string;
  order_status: string;
  subtotal_price: number;
  order_total_price: number;
  thumbnail_image_url: string;
}

export class OrdersDTO {
  seller_id: string;
  seller_name: string;
  order: OrderProduct[];
}
