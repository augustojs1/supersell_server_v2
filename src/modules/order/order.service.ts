import { Injectable } from '@nestjs/common';

import { CreateOrderData, CreateOrderItemData } from './types';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';

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

  public async findOrderByCustomerId(customer_id: string) {
    return await this.orderRepository.findOrderByCustomerId(customer_id);
  }

  public async findOrderBySellerId(seller_id: string) {
    return await this.orderRepository.findOrderBySellerId(seller_id);
  }
}
