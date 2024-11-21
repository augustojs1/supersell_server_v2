import { char, double, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

import * as schemas from '@/infra/database/orm/drizzle/schema';

export const shopping_carts = mysqlTable('shopping_carts', {
  id: char({ length: 26 }).primaryKey().notNull(),
  user_id: char({ length: 26 })
    .notNull()
    .references(() => schemas.users.id),
  total_price: double({ precision: 13, scale: 2 })
    .notNull()
    .$default(() => 0),
  updated_at: timestamp().onUpdateNow(),
  created_at: timestamp().defaultNow(),
});
