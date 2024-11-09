import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
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

  public async findByName(name: string): Promise<ProductEntity | null> {
    const product = await this.drizzle
      .select()
      .from(schema.products)
      .where(eq(schema.products.name, name));

    return product[0] ?? null;
  }

  public async findByParentDepartmentId(id: string): Promise<ProductEntity[]> {
    // SELECT * FROM
    //   products AS p
    // INNER JOIN
    //   departments AS d ON p.department_id = d.id
    // WHERE
    //   d.parent_department_id = '01JC4CFKTNACVAKM1AHZGB991B';

    return await this.drizzle
      .select({
        id: schema.products.id,
        user_id: schema.products.user_id,
        department_id: schema.products.department_id,
        name: schema.products.name,
        description: schema.products.description,
        price: schema.products.price,
        quantity: schema.products.quantity,
        is_in_stock: schema.products.is_in_stock,
        average_rating: schema.products.average_rating,
        is_used: schema.products.is_used,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(eq(schema.departments.parent_department_id, id));
  }

  public async findByDepartmentId(id: string) {
    // SELECT * FROM
    //   products AS p
    // INNER JOIN
    //   departments AS d ON p.department_id = d.id
    // WHERE
    //   p.department_id = '01JC7092CJT6RXJW3YPDGMK6Y7';

    return await this.drizzle
      .select({
        id: schema.products.id,
        user_id: schema.products.user_id,
        department_id: schema.products.department_id,
        name: schema.products.name,
        description: schema.products.description,
        price: schema.products.price,
        quantity: schema.products.quantity,
        is_in_stock: schema.products.is_in_stock,
        average_rating: schema.products.average_rating,
        is_used: schema.products.is_used,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(eq(schema.departments.id, id));
  }
}
