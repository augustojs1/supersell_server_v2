import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { AccessTokenGuard } from '../auth/guards';
import { ReviewsEntityDto } from './dto';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { PaginationParamsSortableDto } from '../common/dto';
import { ReviewsPaginatedDto } from './dto/response/reviews-paginated.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Add review to a product.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Succesfully add review to product!',
  })
  @ApiResponse({
    status: 404,
    description: `Product with this id not found!
      `,
  })
  @ApiResponse({
    status: 403,
    description: `
    - User can not review its own products!
    - You already have a review for this product!
      `,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateReviewDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ReviewsEntityDto> {
    return await this.reviewsService.create(user.sub, data);
  }

  @ApiOperation({
    summary: 'Read all reviews for a product.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all product reviews!',
  })
  @ApiResponse({
    status: 404,
    description: `Product with this id not found!
      `,
  })
  @Get('products/:product_id')
  public async findAll(
    @Param('product_id') product_id: string,
    @Query() paginationParams: PaginationParamsSortableDto,
  ): Promise<ReviewsPaginatedDto> {
    return await this.reviewsService.findAll(product_id, paginationParams);
  }

  @ApiOperation({
    summary: 'Delete a review from a product.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully removed review from product!',
  })
  @ApiResponse({
    status: 403,
    description: `User can not remove this review!
      `,
  })
  @ApiResponse({
    status: 404,
    description: `Product with this id not found!
      `,
  })
  @UseGuards(AccessTokenGuard)
  @Delete(':review_id')
  public async remove(
    @Param('review_id') review_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.reviewsService.remove(user.sub, review_id);
  }
}
