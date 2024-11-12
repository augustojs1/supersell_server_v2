import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { ProductImagesEntity } from './types/product-images-entity.type';

@Injectable()
export class ProductImagesRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(images: ProductImagesEntity[]): Promise<any> {
    return await this.drizzle
      .insert(schema.products_images)
      .values(images)
      .$returningId();
  }

  public async findById(id: string) {
    // SELECT * FROM products_images WHERE id = `id`;
    const productImage = await this.drizzle
      .select()
      .from(schema.products_images)
      .where(eq(schema.products_images.id, id));

    return productImage[0] ?? null;
  }

  public async delete(id: string): Promise<void> {
    // DELETE FROM product_images WHERE id = `id`;
    await this.drizzle
      .delete(schema.products_images)
      .where(eq(schema.products_images.id, id));
  }
}
