import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { WishlistEntity } from './types';
import { ProductEntity } from '../products/types';

@Injectable()
export class WishlistsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(user_id: string, product_id: string): Promise<void> {
    // INSERT INTO
    //   wishlists (product_id, user_id)
    // VALUES
    //   (`product_id`, `user_id`);

    await this.drizzle.insert(schema.wishlists).values({
      user_id,
      product_id,
    });
  }

  public async findAllByUserId(user_id: string): Promise<ProductEntity[]> {
    // SELECT
    //   p.name
    // FROM
    //   wishlists w
    // INNER JOIN
    //   products p
    // ON
    //   w.product_id = p.id
    // WHERE
    //   w.user_id = `user_id`;

    return await this.drizzle
      .select({
        id: schema.products.id,
        user_id: schema.products.user_id,
        department_id: schema.products.department_id,
        name: schema.products.name,
        description: schema.products.description,
        price: schema.products.price,
        quantity: schema.products.quantity,
        is_in_stock: schema.products.is_in_stock,
        sales: schema.products.sales,
        thumbnail_image_url: schema.products.thumbnail_image_url,
        average_rating: schema.products.average_rating,
        is_used: schema.products.is_used,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
        images:
          sql<JSON>`JSON_ARRAYAGG(JSON_OBJECT('url', ${schema.products_images.url}))`.as(
            'images',
          ),
      })
      .from(schema.wishlists)
      .innerJoin(
        schema.products,
        eq(schema.wishlists.product_id, schema.products.id),
      )
      .leftJoin(
        schema.products_images,
        eq(schema.products_images.id, schema.products.id),
      )
      .where(eq(schema.wishlists.user_id, user_id))
      .groupBy(schema.products.id);
  }

  public async findByUserIdAndProductId(
    user_id: string,
    product_id: string,
  ): Promise<WishlistEntity | null> {
    // SELECT
    //   *
    // FROM
    //   wishlists AS w
    // WHERE
    //   w.user_id = `user_id` AND w.product_id = `product_id`;

    const wishlist = await this.drizzle
      .select()
      .from(schema.wishlists)
      .where(
        and(
          eq(schema.wishlists.user_id, user_id),
          eq(schema.wishlists.product_id, product_id),
        ),
      );

    return wishlist[0] ?? null;
  }

  public async delete(user_id: string, product_id: string) {
    // DELETE FROM
    //   wishlists AS w
    // WHERE
    //   w.user_id = `user_id` AND w.product_id = `product_id`;

    await this.drizzle
      .delete(schema.wishlists)
      .where(
        and(
          eq(schema.wishlists.user_id, user_id),
          eq(schema.wishlists.product_id, product_id),
        ),
      );
  }
}
