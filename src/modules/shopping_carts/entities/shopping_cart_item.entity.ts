import {
  char,
  double,
  int,
  mysqlTable,
  timestamp,
} from 'drizzle-orm/mysql-core';

import * as schemas from '@/infra/database/orm/drizzle/schema';

export const shopping_cart_item = mysqlTable('shopping_cart_item', {
  id: char({ length: 26 }).primaryKey().notNull(),
  shopping_cart_id: char({ length: 26 })
    .notNull()
    .references(() => schemas.shopping_carts.id),
  product_id: char({ length: 26 })
    .notNull()
    .references(() => schemas.products.id),
  price: double({ precision: 13, scale: 2 }).notNull(),
  quantity: int().notNull(),
  updated_at: timestamp().onUpdateNow(),
  created_at: timestamp().defaultNow(),
});
