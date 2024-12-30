import {
  AnyMySqlColumn,
  char,
  double,
  mysqlEnum,
  mysqlTable,
  timestamp,
} from 'drizzle-orm/mysql-core';

import { users as userEntity } from '@/infra/database/orm/drizzle/schema';
import { address as addressEntity } from '@/infra/database/orm/drizzle/schema';
import { OrderStatus } from '../enums';

export const orders = mysqlTable('orders', {
  id: char({ length: 26 }).primaryKey().notNull(),
  customer_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => userEntity.id,
  ),
  seller_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => userEntity.id,
  ),
  delivery_address_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => addressEntity.id,
  ),
  status: mysqlEnum(
    'status',
    Object.values(OrderStatus) as [OrderStatus, ...OrderStatus[]],
  ).notNull(),
  total_price: double({ precision: 13, scale: 2 }).notNull(),
  updated_at: timestamp().defaultNow(),
  created_at: timestamp().onUpdateNow(),
});
