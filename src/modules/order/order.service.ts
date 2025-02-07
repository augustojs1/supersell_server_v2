import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CreateOrderData, CreateOrderItemData, OrderEntity } from './types';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { CreateOrderDto, OrderSalesDTO, OrdersDTO } from './dto';
import { OrderStatus } from './enums';
import { ProductItem } from '../shopping_carts/types';
import { ShoppingCartsService } from '../shopping_carts/shopping_carts.service';
import { AddressService } from '../address/address.service';
import { OrderPaymentDto } from './dto/request/order-payment.dto';
import { PaymentBrokerService } from '@/infra/messaging/brokers';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly shoppingCartService: ShoppingCartsService,
    private readonly addressService: AddressService,
    private readonly paymentBrokerService: PaymentBrokerService,
  ) {}

  public async create(data: CreateOrderData): Promise<string> {
    return await this.orderRepository.create(data);
  }

  public async createItem(data: CreateOrderItemData): Promise<void> {
    await this.orderItemRepository.create(data);
  }

  public async findByIdElseThrow(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new HttpException(
        'Order with this id not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    return order;
  }

  public async findOrderByCustomerId(
    customer_id: string,
    status: OrderStatus | undefined,
  ): Promise<OrdersDTO[]> {
    return await this.orderRepository.findOrderByCustomerId(
      customer_id,
      status,
    );
  }

  public async findOrderBySellerId(
    seller_id: string,
    status: OrderStatus | undefined,
  ): Promise<OrderSalesDTO[]> {
    return await this.orderRepository.findOrderBySellerId(seller_id, status);
  }

  public async updateStatus(
    id: string,
    user_id: string,
    status: OrderStatus,
  ): Promise<void> {
    const order = await this.findByIdElseThrow(id);

    if (order.seller_id !== user_id) {
      throw new ForbiddenException();
    }

    return await this.orderRepository.updateOrderStatus(order.id, status);
  }

  public async checkout(id: string, data: CreateOrderDto) {
    const deliveryAddress = await this.addressService.findByIdElseThrow(
      data.delivery_address_id,
    );

    this.addressService.checkUserIsOwnerElseThrow(deliveryAddress.user_id, id);

    try {
      const shoppingCartItems = await this.shoppingCartService.findAll(id);
      const shoppingCartId = shoppingCartItems[0].shopping_cart.id;

      for (const order of shoppingCartItems) {
        const orderTotalPrice = this.getOrderTotalPrice(order.items);

        await this.orderRepository.checkOutFlowTrx(
          shoppingCartId,
          id,
          order,
          orderTotalPrice,
          data.delivery_address_id,
        );
      }
      return {
        status: HttpStatus.CREATED,
        message: 'Order created succesfully!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public getOrderTotalPrice(items: ProductItem[]): number {
    return items.reduce((acc, item) => {
      return acc + item.subtotal_price;
    }, 0);
  }

  public async payOrder(
    user_id: string,
    order_id: string,
    dto: OrderPaymentDto,
  ) {
    const order = await this.findByIdElseThrow(order_id);

    if (order.customer_id !== user_id) {
      throw new ForbiddenException(
        'Only order customers can pay for an order!!',
      );
    }

    if (
      order.status !== OrderStatus.PENDING_PAYMENT &&
      order.status !== OrderStatus.FAILED_PAYMENT
    ) {
      throw new ForbiddenException(
        `Only orders with ${OrderStatus.PENDING_PAYMENT} or ${OrderStatus.FAILED_PAYMENT} status can be paid!`,
      );
    }

    this.paymentBrokerService.sendOrderPaymentMessage({
      order: {
        id: order.id,
        total_price: order.total_price,
      },
      ...dto,
    });
  }
}
