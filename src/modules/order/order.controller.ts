import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { OrderService } from './order.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import {
  CreateOrderDto,
  OrderSalesDTO,
  OrdersDTO,
  UpdateOrderStatusDto,
} from './dto';
import { OrderStatus } from './enums';
import { OrderPaymentDto } from './dto/request/order-payment.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Read all authenticated user orders.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all authenticated user orders.',
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  public async findOrders(
    @Query('status') status: OrderStatus,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrdersDTO[]> {
    return await this.orderService.findOrderByCustomerId(user.sub, status);
  }

  @ApiOperation({
    summary: 'Read all user products orders.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all user products orders',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/sales')
  public async findSales(
    @Query('status') status: OrderStatus,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<OrderSalesDTO[]> {
    return await this.orderService.findOrderBySellerId(user.sub, status);
  }

  @ApiOperation({
    summary: 'Update a order status.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'order_id',
    description: 'Id of order to be updated',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully updated an order status.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden!',
  })
  @ApiResponse({
    status: 404,
    description: 'Order with this id not found!',
  })
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

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateOrderDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.orderService.checkout(user.sub, data);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:order_id/pay')
  public async payOrder(
    @Body() dto: OrderPaymentDto,
    @Param('order_id') order_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<{ url: string }> {
    return await this.orderService.payOrder(user.sub, order_id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:order_id/cancel')
  public async cancel(
    @Param('order_id') order_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.orderService.cancel(user.sub, order_id);
  }
}
