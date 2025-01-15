import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CreateOrderData, CreateOrderItemData, OrderEntity } from './types';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { OrderSalesDTO, OrdersDTO } from './dto';
import { OrderStatus } from './enums';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
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
}
