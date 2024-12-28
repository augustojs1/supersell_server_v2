class ShoppingCart {
  total_price: string;
}

class ProductItem {
  quantity: number;
  product_id: string;
  product_name: string;
  product_price: number;
  subtotal_price: number;
  product_seller_id: string;
  product_description: string;
  product_seller_username: string;
  product_thumbnail_image_url: string;
}

export class ShoppingCartItemsDTO {
  shopping_cart: ShoppingCart;
  items: ProductItem[];
}
