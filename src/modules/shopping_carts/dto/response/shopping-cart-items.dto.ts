export class ShoppingCartItemsDTO {
  shopping_cart: {
    id: string;
    total_price: string;
  };
  items: {
    item_price: number;
    product_id: string;
    product_name: string;
    item_quantity: number;
    product_description: string;
  }[];
}
