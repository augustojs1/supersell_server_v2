import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { ulid } from 'ulid';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { CreateReviewDto } from './dto';
import { ReviewsEntity } from './types';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationParamsDto } from '../common/dto';
import { ReviewsPaginatedDto } from './dto/response/reviews-paginated.dto';

@Injectable()
export class ReviewsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schemas>,
    private readonly paginationService: PaginationService,
  ) {}

  public async create(
    user_id: string,
    data: CreateReviewDto,
  ): Promise<ReviewsEntity> {
    // INSERT INTO reviews (id, user_id, product_id, content, rating) VALUES ('312312','01JCKW1MKBWV83FDQJCFSTMHVE', '1321321', 'Loved it!', 5);
    const id = ulid();

    await this.drizzle.insert(schemas.reviews).values({
      id,
      user_id,
      product_id: data.product_id,
      content: data.content,
      rating: data.rating,
    });

    return this.findById(id);
  }

  public async findById(id: string): Promise<ReviewsEntity | null> {
    // SELECT * FROM reviews WHERE id = `id`;

    const reviews = await this.drizzle
      .select()
      .from(schemas.reviews)
      .where(eq(schemas.reviews.id, id));

    return reviews[0] ?? null;
  }

  public async findByUserIdAndProductId(
    user_id: string,
    product_id: string,
  ): Promise<ReviewsEntity[]> {
    // SELECT
    //   *
    // FROM
    //   reviews r
    // WHERE
    //   r.user_id = `user_id`
    // AND
    //   r.product_id = `product_id`;

    return await this.drizzle
      .select()
      .from(schemas.reviews)
      .where(
        and(
          eq(schemas.reviews.user_id, user_id),
          eq(schemas.reviews.product_id, product_id),
        ),
      );
  }

  public async findAllByProductId(
    product_id: string,
    paginationParams: PaginationParamsDto,
  ): Promise<ReviewsPaginatedDto> {
    // SELECT
    //   *
    // FROM
    //   reviews r
    // WHERE
    //   r.product_id = '01JC71B8DBV6F6AT6A902RYWDR';
    const count = await this.count(product_id);

    const query = this.drizzle
      .select()
      .from(schemas.reviews)
      .where(eq(schemas.reviews.product_id, product_id))
      .orderBy(desc(schemas.reviews.created_at));

    return await this.paginationService.paginate(
      count,
      paginationParams,
      query,
    );
  }

  public async delete(id: string): Promise<void> {
    // DELETE FROM reviews r WHERE r.id = 'id';
    await this.drizzle
      .delete(schemas.reviews)
      .where(eq(schemas.reviews.id, id));
  }

  public async count(product_id: string): Promise<number> {
    const reviewsCountResult = await this.drizzle
      .select({
        reviewsCount: count(),
      })
      .from(schemas.reviews)
      .where(eq(schemas.reviews.product_id, product_id));

    return reviewsCountResult.pop().reviewsCount;
  }
}
