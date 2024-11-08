import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { CreateProductDto } from './dto';
import { ProductEntity } from './types';

@Injectable()
export class ProductsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(
    user_id: string,
    data: CreateProductDto,
  ): Promise<ProductEntity | null> {
    const id = ulid();

    await this.drizzle.insert(schema.products).values({
      id: id,
      department_id: data.department_id,
      user_id: user_id,
      name: data.name,
      description: data.description,
      price: data.price,
      is_used: data.is_used,
      quantity: data.quantity,
    });

    return this.findById(id);
  }

  public async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.drizzle
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id));

    return product[0] ?? null;
  }
}
