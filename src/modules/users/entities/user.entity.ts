import {
  mysqlTable,
  char,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: char({ length: 26 }).primaryKey().notNull(),
  first_name: varchar({ length: 100 }).notNull(),
  last_name: varchar({ length: 100 }).notNull(),
  username: varchar({ length: 30 }).unique().notNull(),
  email: varchar({ length: 100 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  is_admin: boolean().$default(() => false),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
