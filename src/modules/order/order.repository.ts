import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq, sql } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { CreateOrderData, OrderEntity } from './types';
import { OrderSalesDTO } from './dto';
import { OrderStatus } from './enums';
import { ShoppingCartItemsDTO } from '../shopping_carts/dto';
import { ProductEntity } from '../products/types';
import { OrderItemEntity } from './types/order-item-entity.type';
import { ShoppingCartEntity } from '../shopping_carts/types';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schemas>,
  ) {}

  public async create(data: CreateOrderData): Promise<string> {
    const id = ulid();

    await this.drizzle.insert(schemas.orders).values({
      id,
      ...data,
    });

    return id;
  }

  public async findById(id: string): Promise<OrderEntity | null> {
    const result = await this.drizzle
      .select()
      .from(schemas.orders)
      .where(eq(schemas.orders.id, id));

    return result[0] ?? null;
  }

  public async findOrderByCustomerId(
    customer_id: string,
    status: OrderStatus | undefined,
  ): Promise<any[]> {
    // SELECT
    // 	p.name,
    // 	p.description,
    // 	p.thumbnail_image_url,
    // 	p.price,
    // 	o.status,
    // 	oi.quantity,
    // 	oi.subtotal_price
    // FROM
    // 	orders o
    // INNER JOIN
    // 	order_items oi
    // ON
    // 	o.id = oi.order_id
    // INNER JOIN
    // 	products p
    // ON
    // 	p.id = oi.product_id
    // WHERE
    // 	o.customer_id = 'customer_id';

    if (!status) {
      return await this.drizzle
        .select({
          seller_id: schemas.users.id,
          seller_name: schemas.users.username,
          order: sql<JSON>`JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', ${schemas.products.name},
            'description', ${schemas.products.description},
            'thumbnail_image_url', ${schemas.products.thumbnail_image_url},
            'quantity', ${schemas.order_items.quantity},
            'price', ${schemas.order_items.price},
            'subtotal_price', ${schemas.order_items.subtotal_price},
            'order_status', ${schemas.orders.status},
            'order_total_price', ${schemas.orders.total_price}
          )
        )`.as('order'),
        })
        .from(schemas.orders)
        .innerJoin(
          schemas.order_items,
          eq(schemas.orders.id, schemas.order_items.order_id),
        )
        .innerJoin(
          schemas.users,
          eq(schemas.orders.seller_id, schemas.users.id),
        )
        .innerJoin(
          schemas.products,
          eq(schemas.products.id, schemas.order_items.product_id),
        )
        .where(eq(schemas.orders.customer_id, customer_id))
        .groupBy(schemas.orders.seller_id);
    }

    return await this.drizzle
      .select({
        seller_id: schemas.users.id,
        seller_name: schemas.users.username,
        order: sql<JSON>`JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', ${schemas.products.name},
            'description', ${schemas.products.description},
            'thumbnail_image_url', ${schemas.products.thumbnail_image_url},
            'quantity', ${schemas.order_items.quantity},
            'price', ${schemas.order_items.price},
            'subtotal_price', ${schemas.order_items.subtotal_price},
            'order_status', ${schemas.orders.status},
            'order_total_price', ${schemas.orders.total_price}
          )
        )`.as('order'),
      })
      .from(schemas.orders)
      .innerJoin(
        schemas.order_items,
        eq(schemas.orders.id, schemas.order_items.order_id),
      )
      .innerJoin(schemas.users, eq(schemas.orders.seller_id, schemas.users.id))
      .innerJoin(
        schemas.products,
        eq(schemas.products.id, schemas.order_items.product_id),
      )
      .where(
        and(
          eq(schemas.orders.customer_id, customer_id),
          eq(schemas.orders.status, status),
        ),
      )
      .groupBy(schemas.orders.seller_id);
  }

  public async findOrderBySellerId(
    seller_id: string,
    status: OrderStatus | undefined,
  ): Promise<OrderSalesDTO[]> {
    // SELECT
    // 	p.name,
    // 	p.description,
    // 	p.thumbnail_image_url,
    // 	p.price,
    // 	o.status,
    // 	oi.quantity,
    // 	oi.subtotal_price
    // FROM
    // 	orders o
    // INNER JOIN
    // 	order_items oi
    // ON
    // 	o.id = oi.order_id
    // INNER JOIN
    // 	products p
    // ON
    // 	p.id = oi.product_id
    // WHERE
    // 	o.seller_id = 'seller_id';
    if (!status) {
      return await this.drizzle
        .select({
          name: schemas.products.name,
          description: schemas.products.description,
          thumbnail_image_url: schemas.products.thumbnail_image_url,
          quantity: schemas.order_items.quantity,
          price: schemas.order_items.price,
          subtotal_price: schemas.order_items.subtotal_price,
          order_status: schemas.orders.status,
          order_total_price: schemas.orders.total_price,
        })
        .from(schemas.orders)
        .innerJoin(
          schemas.order_items,
          eq(schemas.orders.id, schemas.order_items.order_id),
        )
        .innerJoin(
          schemas.products,
          eq(schemas.products.id, schemas.order_items.product_id),
        )
        .where(eq(schemas.orders.seller_id, seller_id));
    }

    return await this.drizzle
      .select({
        name: schemas.products.name,
        description: schemas.products.description,
        thumbnail_image_url: schemas.products.thumbnail_image_url,
        quantity: schemas.order_items.quantity,
        price: schemas.order_items.price,
        subtotal_price: schemas.order_items.subtotal_price,
        order_status: schemas.orders.status,
        order_total_price: schemas.orders.total_price,
      })
      .from(schemas.orders)
      .innerJoin(
        schemas.order_items,
        eq(schemas.orders.id, schemas.order_items.order_id),
      )
      .innerJoin(
        schemas.products,
        eq(schemas.products.id, schemas.order_items.product_id),
      )
      .where(
        and(
          eq(schemas.orders.seller_id, seller_id),
          eq(schemas.orders.status, status),
        ),
      );
  }

  public async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<void> {
    await this.drizzle
      .update(schemas.orders)
      .set({
        status: status,
      })
      .where(eq(schemas.orders.id, id));
  }

  public async checkOutFlowTrx(
    id: string,
    user_id: string,
    order: ShoppingCartItemsDTO,
    orderTotalPrice: number,
    deliveryAddressId: string,
  ): Promise<void> {
    await this.drizzle.transaction(async (tx) => {
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
      } catch (error) {
        throw error;
      }
    });
  }
}
