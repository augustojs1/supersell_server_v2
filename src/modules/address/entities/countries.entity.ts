import { char, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const countries = mysqlTable('countries', {
  code: char({ length: 2 }).primaryKey().notNull().unique(),
  name: varchar({ length: 50 }).notNull(),
});
