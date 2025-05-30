import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, count, eq, sql } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import {
  CreateProductDto,
  DepartmentProductsDTO,
  UpdateProductDto,
} from './dto';
import { ProductEntity } from './types';
import {
  PaginationParamsDto,
  PaginationParamsSortableDto,
} from '@/modules/common/dto';
import { PaginationService } from '@/modules/common/services/pagination.service';

@Injectable()
export class ProductsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
    private readonly paginationService: PaginationService,
  ) {}

  public async create(
    user_id: string,
    data: CreateProductDto,
    thumbnail_image_url: string,
  ): Promise<ProductEntity> {
    const id = ulid();

    await this.drizzle.insert(schema.products).values({
      id: id,
      department_id: data.department_id,
      user_id: user_id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      slug: data.slug,
      thumbnail_image_url: thumbnail_image_url,
      price: parseFloat(data.price),
      is_used: data.is_used,
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

  public async findBySkuAndUserId(
    sku: string,
    user_id: string,
  ): Promise<ProductEntity | null> {
    //     SELECT
    // 	*
    // FROM
    // 	products p
    // WHERE
    // 	p.sku = ''
    // AND
    // 	p.user_id = '';
    const result = await this.drizzle
      .select()
      .from(schema.products)
      .where(
        and(eq(schema.products.sku, sku), eq(schema.products.user_id, user_id)),
      );

    return result[0] ?? null;
  }

  public async findByName(name: string): Promise<ProductEntity | null> {
    const product = await this.drizzle
      .select()
      .from(schema.products)
      .where(eq(schema.products.name, name));

    return product[0] ?? null;
  }

  public async findByParentDepartmentId(
    id: string,
    pagination: PaginationParamsSortableDto,
  ): Promise<any> {
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
    const productsCountResult = await this.drizzle
      .select({
        productsCount: count(),
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(eq(schema.departments.parent_department_id, id));

    const productsCount = productsCountResult.pop();

    const productsQuery = this.drizzle
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
        sales: schema.products.sales,
        thumbnail_image_url: schema.products.thumbnail_image_url,
        is_used: schema.products.is_used,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(
        and(
          eq(schema.departments.parent_department_id, id),
          eq(schema.products.is_in_stock, true),
        ),
      );

    return this.paginationService.paginateProducts(
      productsCount.productsCount,
      pagination,
      productsQuery,
    );
  }

  public async findByDepartmentId(
    id: string,
    pagination: PaginationParamsSortableDto,
  ) {
    // SELECT
    // 	 p.id,
    //   p.user_id,
    //   p.name,
    //   p.description,
    //   p.quantity,
    //   p.is_in_stock,
    //   p.average_rating,
    //   p.is_used,
    //   p.updated_at,
    //   p.created_at,
    // FROM
    // 	products AS p
    // INNER JOIN
    // 	departments AS d
    // ON
    // 	p.department_id = d.id
    // WHERE
    // 	d.id = ´id´
    // GROUP BY
    // 	p.id;
    const productsCountResult = await this.drizzle
      .select({
        productsCount: count(),
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(eq(schema.departments.id, id));

    const productsCount = productsCountResult.pop();

    const productsQuery = this.drizzle
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
        sales: schema.products.sales,
        thumbnail_image_url: schema.products.thumbnail_image_url,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
      })
      .from(schema.products)
      .innerJoin(
        schema.departments,
        eq(schema.products.department_id, schema.departments.id),
      )
      .where(
        and(
          eq(schema.departments.id, id),
          eq(schema.products.is_in_stock, true),
        ),
      );

    return this.paginationService.paginateProducts(
      productsCount.productsCount,
      pagination,
      productsQuery,
    );
  }

  public async findProductByImageId(
    product_id: string,
  ): Promise<ProductEntity | null> {
    // SELECT * FROM products WHERE id = `product_id`;
    const product = await this.drizzle
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, product_id));

    return product[0] ?? null;
  }

  public async findByUserId(
    user_id: string,
    paginationParams: PaginationParamsDto,
  ): Promise<DepartmentProductsDTO> {
    //     SELECT
    // 	p.id,
    // 	p.user_id,
    //   p.department_id,
    // 	p.name,
    //   p.description,
    //   p.quantity,
    //   p.is_in_stock,
    //   p.average_rating,
    // 	p.is_used,
    //   p.updated_at,
    //   p.created_at,
    // FROM
    // 	products AS p
    // WHERE
    // 	p.user_id = '01JC1W9JBSBNSHH7Z5TP12B6X2';
    const productsCountResult = await this.drizzle
      .select({
        productsCount: count(),
      })
      .from(schema.products)
      .where(eq(schema.products.user_id, user_id));

    const productsCount = productsCountResult.pop();

    const productsQuery = this.drizzle
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
        sales: schema.products.sales,
        thumbnail_image_url: schema.products.thumbnail_image_url,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
      })
      .from(schema.products)
      .where(
        and(
          eq(schema.products.user_id, user_id),
          eq(schema.products.is_in_stock, true),
        ),
      );

    return await this.paginationService.paginate(
      productsCount.productsCount,
      paginationParams,
      productsQuery,
    );
  }

  public async updateProduct(
    product_id: string,
    data: UpdateProductDto,
  ): Promise<void> {
    // UPDATE
    //     products AS p
    // SET
    //   p.quantity = 95,
    //   p.average_rating = 5
    // WHERE p.id = '01JC711XQZMBTJ4XCW42QM8RM8';

    await this.drizzle
      .update(schema.products)
      .set({
        ...data,
      })
      .where(eq(schema.products.id, product_id));
  }

  public async deleteProduct(product_id: string): Promise<void> {
    // DELETE FROM
    //   products AS p
    // WHERE
    //   p.id = `product_id`;

    await this.drizzle
      .delete(schema.products)
      .where(eq(schema.products.id, product_id));
  }

  public async findAllByName(name: string): Promise<any> {
    //   SELECT
    //   *
    // FROM
    //   products p
    // WHERE MATCH
    //   (name)
    // AGAINST
    //   ('*pla*' IN BOOLEAN MODE);

    // return await this.drizzle.select().from(schema.products).where(match);

    const query = sql`
          SELECT
            p.id,
            p.name
          FROM
            products p
          WHERE MATCH
            (name)
          AGAINST
            (${`'*${name}*'`} IN BOOLEAN MODE)
          LIMIT 6;
          `;

    const result = await this.drizzle.execute(query);

    return result[0];
  }

  public async findByIdWithImages(id: string): Promise<any> {
    const products = await this.drizzle
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
        sales: schema.products.sales,
        thumbnail_image_url: schema.products.thumbnail_image_url,
        created_at: schema.products.created_at,
        updated_at: schema.products.updated_at,
        images:
          sql<JSON>`JSON_ARRAYAGG(JSON_OBJECT('url', ${schema.products_images.url}, 'id', ${schema.products_images.id}))`.as(
            'images',
          ),
      })
      .from(schema.products)
      .leftJoin(
        schema.products_images,
        eq(schema.products_images.product_id, schema.products.id),
      )
      .where(eq(schema.products.id, id))
      .groupBy(schema.products.id);

    return products[0] ?? null;
  }

  public async updateQuantity(
    product_id: string,
    amount: number,
  ): Promise<void> {
    await this.drizzle
      .update(schema.products)
      .set({
        quantity: amount,
      })
      .where(eq(schema.products.id, product_id));
  }

  public async setProductIsInStock(product_id: string, is_in_stock: boolean) {
    await this.drizzle
      .update(schema.products)
      .set({
        is_in_stock,
      } as ProductEntity)
      .where(eq(schema.products.id, product_id));
  }
}
