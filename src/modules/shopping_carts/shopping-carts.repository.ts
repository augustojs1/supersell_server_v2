import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import {
  RemoveAndUpdatePriceData,
  ShoppingCartEntity,
  ShoppingCartItemEntity,
  ShoppingCartItemUpdate,
  UpdateQuantityAndTotalPriceData,
} from './types';
import { CreateShoppingCartItemDataType } from './types/create-shopping-cart-item-data.type';

@Injectable()
export class ShoppingCartsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schemas>,
  ) {}

  public async create(user_id: string): Promise<void> {
    //     INSERT INTO
    // 	shopping_carts (id, user_id)
    //     VALUES
    // 	('id','user_id');
    const id = ulid();

    await this.drizzle.insert(schemas.shopping_carts).values({
      id,
      user_id,
    });
  }

  public async createShoppingCartItem(
    data: CreateShoppingCartItemDataType,
  ): Promise<void> {
    //     INSERT INTO
    // 	shopping_cart_item sc (id, shopping_cart_id, product_id, price, quantity)
    // VALUES
    // 	('');
    const id = ulid();

    await this.drizzle.insert(schemas.shopping_cart_item).values({
      id,
      shopping_cart_id: data.shopping_cart_id,
      product_id: data.product_id,
      price: data.price,
      quantity: data.quantity,
    });
  }

  public async findByUserId(user_id: string): Promise<ShoppingCartEntity> {
    // SELECT
    // 	*
    // FROM
    // 	shopping_carts sc
    // WHERE
    // 	sc.user_id = 'ddasdasa';
    const shoppingCarts = await this.drizzle
      .select()
      .from(schemas.shopping_carts)
      .where(eq(schemas.shopping_carts.user_id, user_id));

    return shoppingCarts[0] ?? null;
  }

  public async updateTotalPriceByUserId(user_id: string, total_price: number) {
    // UPDATE
    // 	shopping_carts sc
    // SET
    // 	sc.total_price = `total_price`
    // WHERE
    // 	sc.user_id = 'user_id';

    await this.drizzle
      .update(schemas.shopping_carts)
      .set({
        total_price: total_price,
      } as ShoppingCartEntity)
      .where(eq(schemas.shopping_carts.user_id, user_id));
  }

  public async findShoppingCartItemByUserIdAndProductId(
    user_id: string,
    product_id: string,
  ): Promise<{
    shopping_cart: {
      total_value: number;
    };
    shopping_cart_item: ShoppingCartItemEntity;
  }> {
    // SELECT
    // 	*
    // FROM
    // 	shopping_cart_item sci
    // INNER JOIN
    // 	shopping_carts sc
    // WHERE
    // 	sci.product_id = `product_id`
    // AND
    // 	sc.user_id = `user_id`;
    const shoppingCartItem = await this.drizzle
      .select({
        shopping_cart: {
          total_value: schemas.shopping_carts.total_price,
        },
        shopping_cart_item: {
          id: schemas.shopping_cart_item.id,
          shopping_cart_id: schemas.shopping_cart_item.shopping_cart_id,
          product_id: schemas.shopping_cart_item.product_id,
          price: schemas.shopping_cart_item.price,
          quantity: schemas.shopping_cart_item.quantity,
          updated_at: schemas.shopping_cart_item.updated_at,
          created_at: schemas.shopping_cart_item.created_at,
        },
      })
      .from(schemas.shopping_carts)
      .innerJoin(
        schemas.shopping_cart_item,
        eq(
          schemas.shopping_carts.id,
          schemas.shopping_cart_item.shopping_cart_id,
        ),
      )
      .where(
        and(
          eq(schemas.shopping_cart_item.product_id, product_id),
          eq(schemas.shopping_carts.user_id, user_id),
        ),
      );

    return shoppingCartItem[0] ?? null;
  }

  public async updateShoppingCartItemQuantiy(
    product_id: string,
    quantity: number,
  ): Promise<void> {
    // UPDATE
    //   shopping_cart_item AS sci
    // SET
    //   sci.quantity = `quantity`
    // WHERE
    //   sci.product_id = `product_id`;
    await this.drizzle
      .update(schemas.shopping_cart_item)
      .set({
        quantity: quantity,
      })
      .where(eq(schemas.shopping_cart_item.product_id, product_id));
  }

  public async delete(id: string): Promise<void> {
    await this.drizzle
      .delete(schemas.shopping_cart_item)
      .where(eq(schemas.shopping_cart_item.id, id));
  }

  public async createItemAndUpdateShoppingCartValueTrx(
    data: ShoppingCartItemUpdate,
  ): Promise<void> {
    await this.drizzle.transaction(async (tx) => {
      try {
        const id = ulid();

        // First operation
        await tx.insert(schemas.shopping_cart_item).values({
          id,
          shopping_cart_id: data.shopping_cart_id,
          product_id: data.product_id,
          price: data.price,
          quantity: data.quantity,
        });

        // Second operation
        await tx
          .update(schemas.shopping_carts)
          .set({
            total_price: data.updatedTotalPrice,
          } as ShoppingCartEntity)
          .where(eq(schemas.shopping_carts.user_id, data.user_id));
      } catch (error) {
        throw error;
      }
    });
  }

  public async updateQuantityAndTotalPriceTrx(
    data: UpdateQuantityAndTotalPriceData,
  ): Promise<void> {
    await this.drizzle.transaction(async (tx) => {
      try {
        // First operation
        await tx
          .update(schemas.shopping_cart_item)
          .set({
            quantity: data.quantity,
          })
          .where(eq(schemas.shopping_cart_item.product_id, data.product_id));

        // Second operation
        await tx
          .update(schemas.shopping_carts)
          .set({
            total_price: data.updatedTotalPrice,
          } as ShoppingCartEntity)
          .where(eq(schemas.shopping_carts.user_id, data.user_id));
      } catch (error) {
        throw error;
      }
    });
  }

  public async removeItemAndUpdateTotalPriceTrx(
    data: RemoveAndUpdatePriceData,
  ) {
    await this.drizzle.transaction(async (tx) => {
      try {
        // First operation
        tx.delete(schemas.shopping_cart_item).where(
          eq(schemas.shopping_cart_item.id, data.shopping_cart_item_id),
        );

        // Second operation
        tx.update(schemas.shopping_carts)
          .set({
            total_price: data.total_price,
          } as ShoppingCartEntity)
          .where(eq(schemas.shopping_carts.user_id, data.user_id));
      } catch (error) {
        throw error;
      }
    });
  }
}
