import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { OrderSalesDTO, OrdersDTO, UpdateOrderStatusDto } from './dto';
import { OrderStatus } from './enums';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  public async findOrders(
    @Query('status') status: OrderStatus,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrdersDTO[]> {
    return await this.orderService.findOrderByCustomerId(user.sub, status);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/sales')
  public async findSales(
    @Query('status') status: OrderStatus,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrderSalesDTO[]> {
    return await this.orderService.findOrderBySellerId(user.sub, status);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:order_id')
  public async updateStatus(
    @Param('order_id') order_id: string,
    @Body() data: UpdateOrderStatusDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.orderService.updateStatus(
      order_id,
      user.sub,
      data.status,
    );
  }
}
