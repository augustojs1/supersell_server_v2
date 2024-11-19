import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateReviewDto } from './dto/request/create-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsEntityDto } from './dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsService: ProductsService,
  ) {}

  public async create(
    user_id: string,
    data: CreateReviewDto,
  ): Promise<ReviewsEntityDto> {
    const product = await this.productsService.findByIdElseThrow(
      data.product_id,
    );

    if (user_id === product.user_id) {
      throw new HttpException(
        'User can not review its own products!',
        HttpStatus.FORBIDDEN,
      );
    }

    const review = await this.reviewsRepository.findByUserIdAndProductId(
      user_id,
      data.product_id,
    );

    if (review.length !== 0) {
      throw new HttpException(
        'You already have a review for this product!',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.reviewsRepository.create(user_id, data);
  }

  public async findAll(product_id: string): Promise<ReviewsEntityDto[]> {
    await this.productsService.findByIdElseThrow(product_id);

    return await this.reviewsRepository.findAllByProductId(product_id);
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
