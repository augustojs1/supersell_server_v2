export class EmailOrderConfirmedPayload {
  user: { first_name: string; email: string };
  order_id: string;
  order_items: {
    quantity: number;
    product_id: string;
    product_name: string;
    product_price: number;
    subtotal_price: number;
    product_quantity: number;
    product_seller_id: string;
    product_description: string;
    product_seller_username: string;
    product_thumbnail_image_url: string;
  }[];
  order_created_at: Date;
  delivery_address: {
    id: string;
    user_id: string;
    country_code: string;
    type: string;
    alias: string;
    complement: string;
    number: string;
    street: string;
    neighborhood: string;
    district: string;
    postalcode: string;
    city: string;
    updated_at: Date;
    created_at: Date;
  };
}
