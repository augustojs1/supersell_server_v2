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

  @ApiOperation({
    summary: 'Create a order for all products in the shopping cart.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Succesfully created order.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden!',
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateOrderDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.orderService.checkout(user.sub, data);
  }

  @ApiOperation({
    summary: 'Pay and order by id.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'order_id',
    description: 'Id of order to be paid.',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment request successfully sent!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden!',
  })
  @ApiResponse({
    status: 403,
    description:
      'Order can only be cancelled when in PENDING_PAYMENT or FAILED_PAYMENT status',
  })
  @ApiResponse({
    status: 403,
    description: 'Only order customer can pay for an order!',
  })
  @ApiResponse({
    status: 404,
    description: 'Order with this id not found!',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:order_id/pay')
  public async payOrder(
    @Param('order_id') order_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<{ url: string }> {
    return await this.orderService.payOrder(user.sub, order_id);
  }

  @ApiOperation({
    summary: 'Cancel order.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'order_id',
    description: 'Id of order to be cancelled',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully cancelled an order.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden!',
  })
  @ApiResponse({
    status: 403,
    description:
      'Order can only be cancelled when in PENDING_PAYMENT or FAILED_PAYMENT status',
  })
  @ApiResponse({
    status: 403,
    description: 'Only customer user can cancel an order!',
  })
  @ApiResponse({
    status: 404,
    description: 'Order with this id not found!',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:order_id/cancel')
  public async cancel(
    @Param('order_id') order_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.orderService.cancel(user.sub, order_id);
  }
}
