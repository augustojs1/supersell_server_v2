import {
  mysqlTable,
  char,
  varchar,
  timestamp,
  AnyMySqlColumn,
  text,
  int,
  boolean,
  double,
} from 'drizzle-orm/mysql-core';

import { users as userEntity } from '@/modules/users/entities/user.entity';
import { departments as departmentEntity } from '@/modules/departments/entities/departments.entity';

export const products = mysqlTable('products', {
  id: char({ length: 26 }).primaryKey().notNull(),
  user_id: char({ length: 26 })
    .notNull()
    .references((): AnyMySqlColumn => userEntity.id),
  department_id: char({ length: 26 })
    .notNull()
    .references((): AnyMySqlColumn => departmentEntity.id),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text().notNull(),
  sku: varchar({ length: 50 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  price: double({ precision: 13, scale: 2 }).notNull(),
  sales: int().$default(() => 0),
  thumbnail_image_url: text().notNull(),
  quantity: int().notNull(),
  is_in_stock: boolean().$default(() => true),
  average_rating: double({ precision: 3, scale: 2 }).$default(() => 0.0),
  is_used: boolean().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
