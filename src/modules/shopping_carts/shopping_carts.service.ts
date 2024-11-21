import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { ShoppingCartsRepository } from './shopping-carts.repository';
import { ShoppingCartEntity } from './types';
// import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';

@Injectable()
export class ShoppingCartsService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartsRepository,
    private readonly productsService: ProductsService,
  ) {}

  public async findByUserIdIfThrow(user_id: string) {
    const shoppingCart =
      await this.shoppingCartRepository.findByUserId(user_id);

    if (shoppingCart) {
      throw new HttpException(
        'User already have a shopping cart!',
        HttpStatus.NOT_FOUND,
      );
    }

    return shoppingCart;
  }

  public async findByUserIdElseThrow(
    user_id: string,
  ): Promise<ShoppingCartEntity> {
    const shoppingCart =
      await this.shoppingCartRepository.findByUserId(user_id);

    if (!shoppingCart) {
      throw new HttpException(
        'User shopping cart does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return shoppingCart;
  }

  public async create(user_id: string): Promise<void> {
    await this.findByUserIdIfThrow(user_id);

    await this.shoppingCartRepository.create(user_id);
  }

  public async createShoppingCartItem(
    user_id: string,
    product_id: string,
  ): Promise<any> {
    const shoppingCart = await this.findByUserIdElseThrow(user_id);

    const product = await this.productsService.findByIdElseThrow(product_id);

    if (user_id === product.user_id) {
      throw new HttpException(
        'Users can not add their own products to a shopping cart',
        HttpStatus.FORBIDDEN,
      );
    }

    const shoppingCartItem =
      await this.shoppingCartRepository.findShoppingCartItemByUserIdAndProductId(
        user_id,
        product_id,
      );

    if (shoppingCartItem) {
      throw new HttpException(
        'Product is already in user shopping list!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // MAYBE TRANSACTION
    await this.shoppingCartRepository.createShoppingCartItem({
      shopping_cart_id: shoppingCart.id,
      product_id: product.id,
      price: product.price,
      quantity: 1,
    });

    const updatedTotalPrice =
      Number(shoppingCart.total_price) + Number(product.price);

    await this.shoppingCartRepository.updateTotalPriceByUserId(
      user_id,
      updatedTotalPrice,
    );
  }

  public async findAll() {
    // return all shopping cart items products from user shopping cart
  }

  public async update() {
    // return `This action updates a #${id} shoppingCart`;
  }

  public async remove(user_id: string, product_id: string): Promise<any> {
    const shoppingCartItem =
      await this.shoppingCartRepository.findShoppingCartItemByUserIdAndProductId(
        user_id,
        product_id,
      );

    if (!shoppingCartItem) {
      throw new HttpException(
        'Product with this id not found on user shopping cart!',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedTotalPrice =
      Number(shoppingCartItem.shopping_cart.total_value) -
      Number(shoppingCartItem.shopping_cart_item.price) *
        Number(shoppingCartItem.shopping_cart_item.quantity);

    // MAYBE TRANSACTION
    await this.shoppingCartRepository.delete(
      shoppingCartItem.shopping_cart_item.id,
    );

    await this.shoppingCartRepository.updateTotalPriceByUserId(
      user_id,
      updatedTotalPrice,
    );
  }
}
