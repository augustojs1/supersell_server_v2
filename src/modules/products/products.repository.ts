import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
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
  ): Promise<ProductEntity> {
    const id = ulid();

    await this.drizzle.insert(schema.products).values({
      id: id,
      department_id: data.department_id,
      user_id: user_id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      is_used: data.is_used === 'true' ? true : false,
      quantity: parseInt(data.quantity),
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
    //     SELECT
    //     p.id,
    //     p.user_id,
    //     p.department_id,
    //     p.name,
    //     p.description,
    //     p.price,
    //     p.quantity,
    //     p.is_in_stock,
    //     p.average_rating,
    //     p.is_used,
    //     p.created_at,
    //     p.updated_at,
    //     JSON_ARRAYAGG(JSON_OBJECT('url', pi.url)) AS images
    // FROM
    //     products AS p
    // INNER JOIN
    //     departments AS d ON p.department_id = d.id
    // LEFT JOIN
    //     products_images AS pi ON pi.product_id = p.id
    // WHERE
    //     d.parent_department_id = `id`
    // GROUP BY
    //     p.id;

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
        images:
          sql<JSON>`JSON_ARRAYAGG(JSON_OBJECT('url', ${schema.products_images.url}))`.as(
            'images',
          ),
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .leftJoin(
        schema.products_images,
        eq(schema.products_images.product_id, schema.products.id),
      )
      .where(eq(schema.departments.parent_department_id, id))
      .groupBy(schema.products.id);
  }

  public async findByDepartmentId(id: string) {
    //     SELECT
    // 	p.id,
    //   p.user_id,
    //   p.name,
    //   p.description,
    //   p.quantity,
    //   p.is_in_stock,
    //   p.average_rating,
    //   p.is_used,
    //   p.updated_at,
    //   p.created_at,
    //   JSON_ARRAYAGG(JSON_OBJECT('url', pi.url)) AS images
    // FROM
    // 	products AS p
    // INNER JOIN
    // 	departments AS d
    // ON
    // 	p.department_id = d.id
    // LEFT JOIN
    // 	products_images AS pi
    // ON
    // 	pi.product_id = p.id
    // WHERE
    // 	d.id = ´id´
    // GROUP BY
    // 	p.id;

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
        images:
          sql<JSON>`JSON_ARRAYAGG(JSON_OBJECT('url', ${schema.products_images.url}))`.as(
            'images',
          ),
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .leftJoin(
        schema.products_images,
        eq(schema.products_images.product_id, schema.products.id),
      )
      .where(eq(schema.departments.id, id))
      .groupBy(schema.products.id);
  }
}
