import {
  mysqlTable,
  char,
  varchar,
  timestamp,
  double,
  text,
} from 'drizzle-orm/mysql-core';

import * as userEntity from './user.entity';

export const profiles = mysqlTable('profiles', {
  id: char({ length: 26 }).primaryKey().notNull(),
  user_id: char('user_id', { length: 26 })
    .notNull()
    .references(() => userEntity.users.id),
  average_rating: double({ precision: 3, scale: 2 }).$default(() => 0),
  avatar_url: text().$default(() => null),
  phone_number: varchar({ length: 45 }).$default(() => null),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});
