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

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateReviewDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ReviewsEntityDto> {
    return await this.reviewsService.create(user.sub, data);
  }

  @Get('products/:product_id')
  public async findAll(
    @Param('product_id') product_id: string,
    @Query() paginationParams: PaginationParamsSortableDto,
  ): Promise<ReviewsPaginatedDto> {
    return await this.reviewsService.findAll(product_id, paginationParams);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':review_id')
  public async remove(
    @Param('review_id') review_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.reviewsService.remove(user.sub, review_id);
  }
}
