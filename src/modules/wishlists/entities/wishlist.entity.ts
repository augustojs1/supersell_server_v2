import { mysqlTable, char, timestamp } from 'drizzle-orm/mysql-core';

import { products, users } from '@/infra/database/orm/drizzle/schema';

export const wishlists = mysqlTable('wishlists', {
  product_id: char('product_id', { length: 26 })
    .notNull()
    .references(() => products.id),
  user_id: char('user_id', { length: 26 })
    .notNull()
    .references(() => users.id),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
