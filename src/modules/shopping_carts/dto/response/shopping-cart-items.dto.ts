import { ProductItem } from '../../types';

class ShoppingCart {
  id: string;
  total_price: string;
}

export class ShoppingCartItemsDTO {
  shopping_cart: ShoppingCart;
  items: ProductItem[];
}
