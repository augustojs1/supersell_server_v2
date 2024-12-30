import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { ShoppingCartsRepository } from './shopping-carts.repository';
import { ProductItem, ShoppingCartEntity } from './types';
import { CheckoutOrderDTO, ShoppingCartItemsDTO } from './dto';
import { OrderService } from '../order/order.service';
import { CreateOrderData } from '../order/types';
import { OrderStatus } from '../order/enums';

@Injectable()
export class ShoppingCartsService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartsRepository,
    private readonly productsService: ProductsService,
    private readonly orderService: OrderService,
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

    const updatedTotalPrice =
      Number(shoppingCart.total_price) + Number(product.price);

    await this.shoppingCartRepository.createItemAndUpdateShoppingCartValueTrx({
      shopping_cart_id: shoppingCart.id,
      product_id: product.id,
      price: product.price,
      quantity: 1,
      user_id,
      updatedTotalPrice,
    });
  }

  public async findAll(user_id: string): Promise<ShoppingCartItemsDTO[]> {
    return await this.shoppingCartRepository.findAll(user_id);
  }

  public async update(user_id: string, product_id: string, quantity: number) {
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

    const shoppingCart = await this.findByUserIdElseThrow(user_id);

    const newProductCartValue =
      Number(shoppingCart.total_price) -
      shoppingCartItem.shopping_cart_item.quantity *
        Number(shoppingCartItem.shopping_cart_item.price);

    const updatedTotalPrice =
      Number(newProductCartValue) +
      Number(quantity) * Number(shoppingCartItem.shopping_cart_item.price);

    this.shoppingCartRepository.updateQuantityAndTotalPriceTrx({
      product_id,
      quantity,
      updatedTotalPrice,
      user_id,
    });
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

    this.shoppingCartRepository.removeItemAndUpdateTotalPriceTrx({
      shopping_cart_item_id: shoppingCartItem.shopping_cart_item.id,
      user_id,
      total_price: updatedTotalPrice,
    });
  }

  public async checkout(id: string, data: CheckoutOrderDTO) {
    const shoppingCartItems = await this.findAll(id);

    shoppingCartItems.forEach(async (order) => {
      const orderTotalPrice = this.getOrderTotalPrice(order.items);

      const orderData: CreateOrderData = {
        customer_id: id,
        seller_id: order.items[0].product_seller_id,
        delivery_address_id: data.delivery_address_id,
        status: OrderStatus.PENDING_PAYMENT,
        total_price: orderTotalPrice,
      };

      const orderId = await this.orderService.create(orderData);

      order.items.forEach(async (item) => {
        await this.orderService.createItem({
          order_id: orderId,
          price: item.product_price,
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal_price: item.subtotal_price,
        });
      });
    });
  }

  public getOrderTotalPrice(items: ProductItem[]): number {
    return items.reduce((acc, item) => {
      return acc + item.subtotal_price;
    }, 0);
  }
}
