import { Module } from '@nestjs/common';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import * as dotenv from 'dotenv';

import * as schema from './schema';

dotenv.config({
  path: `${process.cwd()}/src/infra/config/env/${process.env.NODE_ENV}.env`,
});

export const DATABASE_TAG = process.env.DB_TAG;

@Module({
  imports: [
    DrizzleMySqlModule.register({
      tag: DATABASE_TAG,
      mysql: {
        connection: 'client',
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
      },
      config: { schema: { ...schema }, mode: 'default' },
    }),
  ],
})
export class DrizzleModule {}
