import { Controller, Get, UseGuards } from '@nestjs/common';

import { OrderService } from './order.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { OrderSalesDTO, OrdersDTO } from './dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  public async findOrders(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrdersDTO[]> {
    return await this.orderService.findOrderByCustomerId(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/sales')
  public async findSales(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrderSalesDTO[]> {
    return await this.orderService.findOrderBySellerId(user.sub);
  }
}
