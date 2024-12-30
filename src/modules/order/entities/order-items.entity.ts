import {
  AnyMySqlColumn,
  char,
  double,
  int,
  mysqlTable,
  timestamp,
} from 'drizzle-orm/mysql-core';

import { products as productEntity } from '@/infra/database/orm/drizzle/schema';
import { orders as orderEntity } from '@/infra/database/orm/drizzle/schema';

export const order_items = mysqlTable('order_items', {
  id: char({ length: 26 }).primaryKey().notNull(),
  product_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => productEntity.id,
  ),
  order_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => orderEntity.id,
  ),
  price: double({ precision: 13, scale: 2 }).notNull(),
  quantity: int().notNull(),
  subtotal_price: double({ precision: 13, scale: 2 }).notNull(),
  updated_at: timestamp().defaultNow(),
  created_at: timestamp().onUpdateNow(),
});
