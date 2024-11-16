import {
  char,
  double,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

import * as schemas from '@/infra/database/orm/drizzle/schema';

export const reviews = mysqlTable('reviews', {
  id: char({ length: 26 }).primaryKey().unique().notNull(),
  user_id: char({ length: 26 })
    .notNull()
    .references(() => schemas.users.id),
  product_id: char({ length: 26 })
    .notNull()
    .references(() => schemas.products.id),
  content: text().notNull(),
  rating: double({ precision: 3, scale: 2 }).notNull(),
  updated_at: timestamp().onUpdateNow(),
  created_at: timestamp().onUpdateNow(),
});
