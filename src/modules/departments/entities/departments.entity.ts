import {
  mysqlTable,
  char,
  varchar,
  timestamp,
  AnyMySqlColumn,
} from 'drizzle-orm/mysql-core';

export const departments = mysqlTable('departments', {
  id: char({ length: 26 }).primaryKey().notNull(),
  parent_department_id: char({ length: 26 }).references(
    (): AnyMySqlColumn => departments.id,
  ),
  name: varchar({ length: 100 }).unique().notNull(),
  description: varchar({ length: 255 }).$default(() => null),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
