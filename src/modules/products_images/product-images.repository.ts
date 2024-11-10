import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';

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
}
