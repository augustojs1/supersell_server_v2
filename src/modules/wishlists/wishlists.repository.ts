import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { WishlistEntity } from './types';

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
