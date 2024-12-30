import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { CreateOrderItemData } from './types';
import { ulid } from 'ulid';

@Injectable()
export class OrderItemRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schemas>,
  ) {}

  public async create(data: CreateOrderItemData): Promise<void> {
    const id = ulid();

    await this.drizzle.insert(schemas.order_items).values({
      id,
      ...data,
    });
  }
}
