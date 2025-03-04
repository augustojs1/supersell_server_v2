import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq, sql } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { CreateOrderData, OrderEntity, OrderUserData } from './types';
import { OrderSalesDTO } from './dto';
import { OrderStatus } from './enums';

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

  public async findOrderCustomerByOrderId(
    id: string,
  ): Promise<OrderUserData | null> {
    // SELECT
    //   *
    // FROM
    //   orders o
    // INNER JOIN
    //   users u
    // ON
    //   o.customer_id = u.id
    // WHERE
    //   o.id = '';

    const result = await this.drizzle
      .select({
        order_id: schemas.orders.id,
        status: schemas.orders.status,
        customer_id: schemas.orders.id,
        customer_name: schemas.users.first_name,
        customer_email: schemas.users.email,
        seller_id: schemas.orders.seller_id,
      })
      .from(schemas.orders)
      .innerJoin(
        schemas.users,
        eq(schemas.orders.customer_id, schemas.users.id),
      )
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
            'product_id', ${schemas.products.id},
            'product_quantity', ${schemas.products.quantity},
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
}
