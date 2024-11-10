import {
  mysqlTable,
  char,
  timestamp,
  AnyMySqlColumn,
  text,
} from 'drizzle-orm/mysql-core';

import { products as productEntity } from '../../products/entities';

export const products_images = mysqlTable('products_images', {
  id: char({ length: 26 }).primaryKey().unique().notNull(),
  product_id: char({ length: 26 })
    .notNull()
    .references((): AnyMySqlColumn => productEntity.id),
  url: text().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
