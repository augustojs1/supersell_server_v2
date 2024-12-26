import {
  AnyMySqlColumn,
  char,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { users } from '@/infra/database/orm/drizzle/schema';
import { countries } from './';

export const address = mysqlTable('address', {
  id: char({ length: 26 }).unique().primaryKey().notNull(),
  user_id: char({ length: 26 })
    .notNull()
    .references((): AnyMySqlColumn => users.id),
  country_code: char({ length: 2 })
    .notNull()
    .references((): AnyMySqlColumn => countries.code),
  type: mysqlEnum([
    'PERSONAL_ADDRESS',
    'DELIVERY_ADDRESS',
    'BILLING_ADDRESS',
    'DELIVERY_AND_BILLING_ADDRESS',
  ]).notNull(),
  alias: varchar({ length: 50 }),
  complement: varchar({ length: 50 }),
  number: varchar({ length: 50 }).notNull(),
  street: varchar({ length: 50 }).notNull(),
  neighborhood: varchar({ length: 50 }).notNull(),
  district: varchar({ length: 50 }).notNull(),
  postalcode: varchar({ length: 50 }).notNull(),
  city: varchar({ length: 50 }).notNull(),
  updated_at: timestamp().onUpdateNow(),
  created_at: timestamp().defaultNow(),
});
