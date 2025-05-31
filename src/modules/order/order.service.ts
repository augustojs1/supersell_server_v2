import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { ulid } from 'ulid';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { CreateOrderData, CreateOrderItemData, OrderEntity } from './types';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { CreateOrderDto, OrderSalesDTO, OrdersDTO } from './dto';
import { OrderStatus } from './enums';
import { ProductItem, ShoppingCartEntity } from '../shopping_carts/types';
import { ShoppingCartsService } from '../shopping_carts/shopping_carts.service';
import { AddressService } from '../address/address.service';
import { OrderPaymentDto } from './dto/request/order-payment.dto';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { ShoppingCartItemsDTO } from '../shopping_carts/dto';
import { ProductEntity } from '../products/types';
import { OrderItemEntity } from './types/order-item-entity.type';
import { UsersService } from '../users/users.service';
import { IPaymentEventsPublisher } from '@/infra/events/publishers/payment/ipayment-events-publisher.interface';
import { IEmailEventsPublisher } from '@/infra/events/publishers/emails/iemail-events-publisher.interface';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly jsonLogger: JsonLogger = LoggerFactory.createLogger(
    OrderService.name,
  );

  constructor(
    @Inject(DATABASE_TAG)
    private readonly trxManager: MySql2Database<typeof schemas>,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly shoppingCartService: ShoppingCartsService,
    private readonly addressService: AddressService,
    private readonly paymentEventsPublisher: IPaymentEventsPublisher,
    private readonly emailEventsPublisher: IEmailEventsPublisher,
    private readonly usersService: UsersService,
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
    this.jsonLogger.info(
      {
        id,
        status,
      },
      `Received request for order ${id} to change status to ${status}`,
    );

    try {
      const orderUser =
        await this.orderRepository.findOrderCustomerByOrderId(id);

      if (orderUser.seller_id !== user_id) {
        throw new ForbiddenException();
      }

      await this.orderRepository.updateOrderStatus(orderUser.order_id, status);

      this.emailEventsPublisher.emitEmailOrderStatusChangeMessage(orderUser);
    } catch (error) {
      throw error;
    }
  }

  public async checkout(id: string, data: CreateOrderDto) {
    const deliveryAddress =
      await this.addressService.findByUserAddressIdElseThrow(
        data.delivery_address_id,
      );

    this.addressService.checkUserIsOwnerElseThrow(
      deliveryAddress.address.user_id,
      id,
    );

    try {
      const shoppingCartItems = await this.shoppingCartService.findAll(id);
      const shoppingCartId = shoppingCartItems[0].shopping_cart.id;

      if (shoppingCartItems[0].items.length === 0) {
        throw new BadRequestException('Shopping cart is empty!');
      }

      for (const order of shoppingCartItems) {
        const orderTotalPrice = this.getOrderTotalPrice(order.items);

        const orderId = await this.checkOutFlowTrx(
          shoppingCartId,
          id,
          order,
          orderTotalPrice,
          data.delivery_address_id,
        );

        this.emailEventsPublisher.emitEmailOrderReceiptMessage({
          user: deliveryAddress.user,
          order_id: orderId,
          order_items: order.items,
          order_total_price: orderTotalPrice,
          order_created_at: new Date().toISOString(),
          delivery_address: deliveryAddress.address,
        });
      }

      return {
        status: HttpStatus.CREATED,
        message: 'Order created succesfully!',
      };
    } catch (error) {
      this.logger.error(
        `FAILED creating order for shopping cart id ${id}`,
        error,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async checkOutFlowTrx(
    id: string,
    user_id: string,
    order: ShoppingCartItemsDTO,
    orderTotalPrice: number,
    deliveryAddressId: string,
  ): Promise<string> {
    return await this.trxManager.transaction(async (tx) => {
      try {
        // Create order object
        const orderData: CreateOrderData = {
          customer_id: user_id,
          seller_id: order.items[0].product_seller_id,
          delivery_address_id: deliveryAddressId,
          status: OrderStatus.PENDING_PAYMENT,
          total_price: orderTotalPrice,
        };

        // Create order
        const orderId = ulid();

        await tx.insert(schemas.orders).values({
          id: orderId,
          ...orderData,
        });

        // Iterate trough shopping cart items
        for (const item of order.items) {
          if (item.quantity > item.product_quantity) {
            throw new Error('Order ammount surpasses product stock ammount.');
          }

          // Update product quantity
          const updatedQuantity = item.product_quantity - item.quantity;

          // Delist product if update quantity is 0
          if (updatedQuantity === 0) {
            await tx
              .update(schemas.products)
              .set({
                is_in_stock: false,
              } as ProductEntity)
              .where(eq(schemas.products.id, item.product_id));
          }

          await tx
            .update(schemas.products)
            .set({
              quantity: updatedQuantity,
            })
            .where(eq(schemas.products.id, item.product_id));

          // Create order item
          await tx.insert(schemas.order_items).values({
            id: ulid(),
            order_id: orderId,
            product_id: item.product_id,
            price: item.product_price,
            quantity: item.quantity,
            subtotal_price: item.subtotal_price,
          } as OrderItemEntity);
        }

        // Reset user shopping cart
        // Set shopping cart total price to 0
        await tx
          .update(schemas.shopping_carts)
          .set({
            total_price: 0,
          } as ShoppingCartEntity)
          .where(eq(schemas.shopping_carts.id, id));

        // Delete all shopping cart items associated to shopping cart
        await tx
          .delete(schemas.shopping_cart_item)
          .where(eq(schemas.shopping_cart_item.shopping_cart_id, id));

        this.logger.log(
          `SUCCESS creating order #${orderId} for shopping cart id #${id}.`,
        );

        return orderId;
      } catch (error) {
        this.logger.error(`FAIL creating order for shopping cart #${id}.`);
        throw new InternalServerErrorException(error);
      }
    });
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
    this.logger.log(`Received new order payment request for order ${order_id}`);

    const order = await this.findByIdElseThrow(order_id);

    if (order.customer_id !== user_id) {
      throw new ForbiddenException(
        'Only order customer can pay for an order!!',
      );
    }

    if (
      order.status !== OrderStatus.PENDING_PAYMENT &&
      order.status !== OrderStatus.FAILED_PAYMENT &&
      order.status !== OrderStatus.PAID
    ) {
      throw new ForbiddenException(
        `Only orders with ${OrderStatus.PENDING_PAYMENT} or ${OrderStatus.FAILED_PAYMENT} status can be paid!`,
      );
    }

    this.paymentEventsPublisher.sendOrderPaymentMessage({
      order: {
        id: order.id,
        total_price: order.total_price,
      },
      ...dto,
    });
  }

  public async cancel(user_id: string, order_id: string) {
    const order = await this.findByIdElseThrow(order_id);

    if (order.customer_id !== user_id) {
      throw new ForbiddenException('Only customer user can cancel an order!');
    }

    if (
      order.status !== OrderStatus.PENDING_PAYMENT &&
      order.status !== OrderStatus.FAILED_PAYMENT
    ) {
      throw new ForbiddenException(
        `Order can only be cancelled when in status ${OrderStatus.PENDING_PAYMENT} or ${OrderStatus.FAILED_PAYMENT}`,
      );
    }

    try {
      const orderItems = await this.orderRepository.findOrderByCustomerId(
        user_id,
        undefined,
      );

      for (const item of orderItems) {
        await this.trxManager.transaction(async (tx) => {
          try {
            for (const ordered_item of item.order) {
              await tx
                .update(schemas.products)
                .set({
                  quantity:
                    ordered_item.product_quantity + ordered_item.quantity,
                })
                .where(eq(schemas.products.id, ordered_item.product_id));

              await tx
                .update(schemas.orders)
                .set({
                  status: OrderStatus.CANCELLED,
                })
                .where(eq(schemas.orders.id, order_id));
            }

            const customer = await this.usersService.findById(user_id);

            this.logger.log(`SUCCESS cancelling order #${order.id}`);

            this.emailEventsPublisher.emitEmailOrderStatusChangeMessage({
              order_id: order_id,
              seller_id: order.seller_id,
              customer_id: customer.id,
              customer_email: customer.email,
              customer_name: customer.first_name,
              status: OrderStatus.CANCELLED,
            });
          } catch (error) {
            throw error;
          }
        });
      }
    } catch (error) {
      this.logger.error(`FAIL cancelling order #${order.id}:`, error);
      throw new InternalServerErrorException(error);
    }
  }
}
